import {Pipe, PipeTransform} from '@angular/core';
import ColorHash from 'color-hash';
import md5 from 'md5';

@Pipe( {
  name: 'stringToHexColor'
} )
export class StringToHexColorPipe implements PipeTransform {

  transform( value: any, args?: any ): any {
    return (new ColorHash).hex(md5(value), {
      lightness: [0.3, 0.8]
    });
  }

}
