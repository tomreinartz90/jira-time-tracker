import { StoreAware, StoreAwareComponent } from './store-aware.decorator';
import { CalculatorService, CalculatorState } from '../examples/calculator.service';
import { mockStoreDependencyService } from '../store-dependency.service';
import { GlobalStateService } from '../global-state.service';
import { Directive } from "@angular/core";

@Directive()
@StoreAware()
class SimpleStoreAware implements StoreAwareComponent {
  onInitCalled = false;
  onDestroyCalled = false;
  state: CalculatorState;

  constructor( private store: CalculatorService ) {
  }

  ngOnDestroy(): void {
    this.onDestroyCalled = true;
  }

  ngOnInit(): void {
    this.onInitCalled = true;
  }

  ngOnChanges() {

  }
}

@Directive()
@StoreAware( { storeKey: 'store1', stateKey: 'state1' } )
@StoreAware( { storeKey: 'store2', stateKey: 'state2' } )
class MultiStoreAware extends StoreAwareComponent {
  state1: CalculatorState;
  state2: CalculatorState;

  constructor( private store1: CalculatorService, private store2: CalculatorService ) {
    super();
  }

}

@Directive()
@StoreAware( { storeKey: 'store', stateKey: 'state1' } )
@StoreAware( { storeKey: 'store', stateKey: 'state2' } )
class BrokenMultiStoreAware extends StoreAwareComponent {
  state: CalculatorState;

  constructor( private store1: CalculatorService, private store2: CalculatorService ) {
    super();
  }
}

@Directive()
@StoreAware( { forceDetectChanges: true } )
class ForceDetectWithoutCDR extends StoreAwareComponent {
  state: CalculatorState;

  constructor( private store: CalculatorService ) {
    super();
  }
}

describe( 'StoreAware decorator', () => {
  it( 'it should override onInit and onDestroy but still call the original functions', () => {
    const testInstance = new SimpleStoreAware( new CalculatorService(  ) );
    expect( testInstance.onInitCalled ).toEqual( false );
    expect( testInstance.onDestroyCalled ).toEqual( false );

    testInstance.ngOnInit();
    expect( testInstance.onInitCalled ).toEqual( true );

    testInstance.ngOnDestroy();
    expect( testInstance.onDestroyCalled ).toEqual( true );
  } );

  it( 'should throw when the param to store state is not empty', () => {
    const testInstance = new SimpleStoreAware( new CalculatorService(  ) );
    expect( testInstance.state ).toEqual( undefined );
    testInstance.state = { currentValue: 100 };
    expect( testInstance.ngOnInit ).toThrow();
  } );

  it( 'it should connect to the store and make the current state of the store available in a variable', () => {
    const testInstance = new SimpleStoreAware( new CalculatorService(  ) );
    expect( testInstance.state ).toEqual( undefined );

    testInstance.ngOnInit();
    expect( testInstance.state ).toEqual( { currentValue: 0 } );
  } );

  it( 'it should be able to connect to multiple stores and make the current state of the stores available in a variable', () => {
    const testInstance = new MultiStoreAware( new CalculatorService(  ), new CalculatorService(  ) );
    expect( testInstance.state1 ).toEqual( undefined );
    expect( testInstance.state2 ).toEqual( undefined );

    testInstance.ngOnInit();
    expect( testInstance.state1 ).toEqual( { currentValue: 0 } );
    expect( testInstance.state2 ).toEqual( { currentValue: 0 } );
  } );

  it( 'should throw when multiple Stores try to use the same param to store their state', () => {
    const testInstance = new BrokenMultiStoreAware( new CalculatorService(  ), new CalculatorService(  ) );
    expect( testInstance.state ).toEqual( undefined );
    expect( testInstance.ngOnInit ).toThrow();
  } );

  it( 'should update the state in the component when the state in the store has been updated', () => {
    const service = new CalculatorService(  );
    const testInstance = new SimpleStoreAware( service );
    expect( testInstance.state ).toEqual( undefined );
    testInstance.ngOnInit();
    expect( testInstance.state ).toEqual( { currentValue: 0 } );
    service.setState( { currentValue: 100 } );
    expect( testInstance.state ).toEqual( { currentValue: 100 } );
  } );

  it( 'should update the state in all components when the state in the store has been updated', () => {
    const service = new CalculatorService(  );
    const testInstance1 = new SimpleStoreAware( service );
    const testInstance2 = new SimpleStoreAware( service );
    spyOn( testInstance2, 'ngOnChanges' );

    service.setState( { currentValue: 100 } );

    testInstance1.ngOnInit();
    testInstance2.ngOnInit();

    service.setState( { currentValue: 500 } );
    expect( testInstance1.state ).toEqual( { currentValue: 500 } );
    expect( testInstance2.state ).toEqual( { currentValue: 500 } );

    service.setState( { currentValue: 499 } );
    expect( testInstance1.state ).toEqual( { currentValue: 499 } );
    expect( testInstance2.state ).toEqual( { currentValue: 499 } );

  } );

  it( 'should not trigger an update if a different slice of state has been updated', () => {
    const service = new CalculatorService(  );
    const testInstance1 = new SimpleStoreAware( service );
    spyOn( testInstance1, 'ngOnChanges' );
    testInstance1.ngOnInit();

    // @ts-ignore
    expect( testInstance1.ngOnChanges.calls.count() ).toEqual( 1 );

    // trigger change in other slice of state,
    GlobalStateService.setSliceOfState( '__TEST__1', {} );
    GlobalStateService.setSliceOfState( '__TEST__2', {} );
    GlobalStateService.setSliceOfState( '__TEST__3', {} );

    // @ts-ignore
    expect( testInstance1.ngOnChanges.calls.count() ).toEqual( 1 );
  } );

  it( 'When enabling forceDetectChanges without cdr it should throw an error', () => {
    const service = new CalculatorService(  );
    const testInstance1 = new ForceDetectWithoutCDR( service );
    expect( testInstance1.ngOnInit ).toThrow();

  } );

} );
