import {Pipe, PipeTransform} from '@angular/core';
import { StringUtil } from '../../utils/string.util';

@Pipe( {
  name: 'cleanName'
} )
export class CleanNamePipe implements PipeTransform {
  transform( value: any, args?: any ): any {
    return StringUtil.clean(value);
  }
}
