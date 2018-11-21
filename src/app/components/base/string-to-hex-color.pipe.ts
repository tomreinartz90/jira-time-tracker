import { Pipe, PipeTransform } from '@angular/core';
import ColorHash from 'color-hash';
import md5 from 'md5';

const hashOptions = {
  lightness: [.6, .7],
  saturation: [.8, .9, 1]
};

@Pipe( {
  name: 'stringToHexColor'
} )
export class StringToHexColorPipe implements PipeTransform {

  transform( value: any, args?: any ): any {
    return (new ColorHash( hashOptions )).hex( md5( value ) );
  }

}
