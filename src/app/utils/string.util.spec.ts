import { StringUtil } from './string.util';

describe( 'StringUtil', () => {

  it( 'should clean up a string value', () => {
    const options = ['<b>hello</b>\'world\''];
    const result = ['hello - world'];

    options.forEach( ( option, index ) => {
      expect( StringUtil.clean( option )).toEqual( result[index] );
    } );
  } );

} );
