import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'minutesToMs'
})
export class MinutesToMsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? (value * 1000) : 0;
  }


}
