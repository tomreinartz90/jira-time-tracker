import { CalculatorService } from './calculator.service';

describe( 'Calculator service', () => {
  let service: CalculatorService;
  beforeEach( () => {
    service = new CalculatorService( );
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

} );
