import { DateUtil } from './date.util';

describe( 'DateUtil', () => {

  it( 'should convert any time string to a date with corresponding time', () => {
    const baseDate = new Date( '2018-01-01' );
    const options = ['10', '8', '08:30', '16', '1', '10:15', '15:20', '8:10', '8.5', '1015'];
    const result = ['10:00', '08:00', '08:30', '16:00', '01:00', '10:15', '15:20', '08:10', '08:05', '10:15'];

    options.forEach( ( option, index ) => {
      expect( DateUtil.timeStringToDate( option, baseDate ).toISOString().slice( 11, 16 ) ).toEqual( result[index] );
    } );
  } );

} );
