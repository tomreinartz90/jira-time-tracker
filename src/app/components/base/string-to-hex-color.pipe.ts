import {Pipe, PipeTransform} from '@angular/core';

@Pipe( {
  name: 'stringToHexColor'
} )
export class StringToHexColorPipe implements PipeTransform {

  transform( value: any, args?: any ): any {
    const firstLetterMatch = /[a-zA-z]/.exec( value );
    const firstLetter = firstLetterMatch ? firstLetterMatch[0].toLowerCase() : null;
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
        return '#29ba4b';
      case 'm':
      case 'n':
      case 'o':
      case 'p':
      case 'q':
        return '#2f86ba';
      case 'r':
      case 's':
      case 't':
      case 'u':
      case 'v':
        return '#9931ba';
      case 'w':
      case 'x':
      case 'y':
      case 'z':
      default:
        return '#A8A8A8';
    }


  }

}
