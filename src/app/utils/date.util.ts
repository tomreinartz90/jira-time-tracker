import { groupBy, sortBy } from 'lodash';

export class DateUtil {
  static groupByDateDay( collection: Array<any>, dateSelector: Function ) {
    return groupBy( sortBy( collection, dateSelector ), ( item ) => {
      return new Date( dateSelector( item ) ).toISOString().slice( 0, 10 );
    } );
  }

  static getTimeForInput( date: Date | string ): string {
    return new Date( typeof date === 'string' ? DateUtil.stringToDateIgnoreTimeZone( date ) : date ).toISOString().slice( 11, 16 );
  }

  static setTimeFromInput( date: Date, timeString: string ): Date {
    return date;
  }

  /**
   * parse a date string from simplicate api to Date
   * @param dateString
   */
  static stringToDateIgnoreTimeZone( dateString: string ): Date {
    const date = new Date( dateString );
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date( date.getTime() - userTimezoneOffset );
  }

  /**
   * parse a Date object to a string for the simplicate api
   * @param date
   */
  static dateToStringIgnoreTimeZone( date ): string {
    return new Date( date ).toISOString().slice( 0, 19 );
  }

  static isDateDayTheSame( date1: Date, date2: Date ) {
    return date1.toISOString().slice( 0, 10 ) === date2.toISOString().slice( 0, 10 );
  }

  static timeStringToDate( timeString: string, date = new Date() ): Date {
    const timeDate = new Date( date );
    if ( timeString && typeof timeString === 'string' ) {
      const hour = (timeString.match( /[012]?[0-9]/ ) || ['0'])[0];
      const rest = timeString.replace( `${hour}`, '' );
      const minutes = (rest.match( /[0-9]?[0-9]/ ) || ['0'])[0];
      timeDate.setUTCHours( parseInt( hour, 10 ), parseInt( minutes, 10 ), 0 );
      return timeDate;
    }
    return null;
  }

  static milisToDHMS( milliseconds: number ): { day: number, hour: number, minute: number, seconds: number } {
    let day, hour, minute, seconds;
    seconds = Math.round( milliseconds / 1000 );
    minute = Math.round( seconds / 60 );
    seconds = seconds % 60;
    hour = Math.floor( minute / 60 );
    minute = minute % 60;
    day = Math.floor( hour / 24 );
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }
}
