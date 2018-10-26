import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'stringToHexColor'
} )
export class StringToHexColorPipe implements PipeTransform {

  transform( value: any, args?: any ): any {
    console.log(value);
    const firstLetterMatch = /[a-zA-z]/.exec( value );
    const firstLetter = firstLetterMatch ? firstLetterMatch[0].toLowerCase() : null;
    console.log(firstLetter);
    switch ( firstLetter ) {
      case 'a':
      case 'b':
      case 'c':
      case 'd':
        return '#FF2345';
      case 'e':
      case 'f':
      case 'g':
      case 'h':
        return '#FFC20E';
      case 'i':
      case 'j':
      case 'k':
      case 'l':
        return '#2FBA31';
      case 'm':
      case 'n':
      case 'o':
      case 'p':
      case 'q':
        return '#2F69BA';
      case 'r':
      case 's':
      case 't':
      case 'u':
      case 'v':
        return '#682FBA';
      case 'w':
      case 'x':
      case 'y':
      case 'z':
      default:
        return '#A8A8A8';
    }


  }

}
