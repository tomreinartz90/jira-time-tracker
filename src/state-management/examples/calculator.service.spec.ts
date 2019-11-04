import { CalculatorService } from "./calculator.service";
import { CalculatorActions } from "./calculator.actions";
import { StoreTester } from "../testing/store-tester";
import { EffectTester } from "../testing/effect-tester";
import { mockStoreDependencyService } from "../store-dependency.service";

describe( 'Calculator service', () => {
  let service: CalculatorService;
  beforeEach( () => {
    service = new CalculatorService( mockStoreDependencyService );
    service.setState( { currentValue: 0 } );
  } );

  afterEach( () => {
    service.ngOnDestroy();
    service = null;
  } );

  it( 'Reducer onAdd should return a new value of the state with an incremented value', () => {
    expect( service.onAdd( { amount: 10 }, { currentValue: 0 } ) ).toEqual( { currentValue: 10 } );
  } );

  it( 'Reducer onRemove should return a new value of the state with an decremented value', () => {
    expect( service.onRemove( { amount: 10 }, { currentValue: 0 } ) ).toEqual( { currentValue: -10 } );
  } );

  it( 'Effect addRemaining should call add with specific payload', ( done ) => {
    new EffectTester( service )
      .expectEffect( service.onAddRemaining )
      .toCallAction( CalculatorActions.add, { amount: 10 } )
      .toCallAction( CalculatorActions.add, { amount: 36 } )
      .run( done );
  } );

  it( 'Effect onAddUntill(10) should call add 10 times', ( done ) => {
    new EffectTester( service )
      .expectEffect( service.onAddUntil, { untilAmount: 10 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .toCallAction( CalculatorActions.add, { amount: 1 } )
      .run( done );
  } );

  it( 'Add should have the ability to add a certain value to the state', ( done: any ) => {
    new StoreTester( service )
      .withState( { currentValue: 0 } )
      .action( () => CalculatorActions.add( { amount: 10 } ) )
      .action( () => CalculatorActions.add( { amount: 10 } ) )
      .action( () => CalculatorActions.add( { amount: 10 } ) )
      .expectState( { currentValue: 30 } )
      .run( done )

  } );

  it( 'Add should have the ability to remove a certain value from the state', ( done: any ) => {

    new StoreTester( service )
      .withState( { currentValue: 0 } )
      .action( () => CalculatorActions.remove( { amount: 10 } ) )
      .action( () => CalculatorActions.remove( { amount: 10 } ) )
      .action( () => CalculatorActions.remove( { amount: 10 } ) )
      .expectState( { currentValue: -30 } )
      .run( done )

  } );

  it( 'Add should update the state via a effect', ( done: any ) => {

    new StoreTester( service )
      .withState( { currentValue: 0 } )
      .action( () => CalculatorActions.addRemaining() )
      .expectState( { currentValue: 46 } )
      .run( done )

  } );

  it( 'Add should use the current state while running an effect', ( done: any ) => {
    new StoreTester( service )
      .withState( { currentValue: 0 } )
      .action( () => CalculatorActions.addUntil( { untilAmount: 20 } ) )
      .expectState( { currentValue: 20 } )
      .run( done );
  } )
} )
