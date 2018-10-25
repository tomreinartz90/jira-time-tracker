import {Pipe, PipeTransform} from '@angular/core';
import {DateUtil} from '../../utils/date.util';

@Pipe({
  name: 'msToTime'
})
export class MsToTimePipe implements PipeTransform {
  transform(value: number, fullName?: any): any {
    const time = DateUtil.milisToDHMS(value || 0);
    return `${time.hour > 9 ? time.hour : `0${time.hour}`}:${time.minute > 9 ? time.minute : `0${time.minute}`}h`;
  }
}
