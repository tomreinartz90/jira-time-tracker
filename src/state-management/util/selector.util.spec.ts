import { SelectorUtil } from "./selector.util";

describe( 'Selector Util', () => {
  it( 'should be possible to generate a unique string for a object', () => {
    const objects = [ { id: 1, foo: 'bar' }, { id: 2, foo: 'baz' } ];
    expect( SelectorUtil.uniqueObjectString( objects, ['id'] ) ).toBe( '12' );
    expect( SelectorUtil.uniqueObjectString( objects, ['id', 'foo'] ) ).toBe( '1bar2baz' );
  } );

  it( 'should be possible to generate a unique string for a object with dates', () => {
    const date1 = new Date( 2021, 1, 1 );
    const date2 = new Date( 2021, 1, 2 );
    const objects = [ { id: 1, foo: 'bar', date: date1 }, { id: 2, foo: 'baz', date: date2 } ];
    expect( SelectorUtil.uniqueObjectString( objects, ['id', 'date'] ) ).toBe( '1' + date1.getTime() + '2' + date2.getTime() );
  } );
} );
