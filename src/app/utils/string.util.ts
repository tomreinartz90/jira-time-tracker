export class StringUtil {
  static clean(value: string) {
    if(!value) {
      return '';
    }

    return value.replace( /<?.b>/g, '' )
      .replace( '\'', ' - ' )
      .replace( '\'', '' )
      .trim();
  }
}
