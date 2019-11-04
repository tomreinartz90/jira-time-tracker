import { CalculatorSelectors } from "./calculator.selectors";

describe( 'Calculator Selectors', () => {
  it( 'currentValue Should return the currentValue of the state', () => {
    expect( CalculatorSelectors.currentValue( { currentValue: 10 } ) ).toEqual( 10 );
    expect( CalculatorSelectors.currentValue( { currentValue: 95 } ) ).toEqual( 95 );
    expect( CalculatorSelectors.currentValue( { currentValue: 1012 } ) ).toEqual( 1012 );
  } );

} )
