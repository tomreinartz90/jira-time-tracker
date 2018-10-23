import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'hoursToMs'
})
export class HoursToMsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    return value ? (value * 60 * 60 * 1000) : 0;
  }

}
