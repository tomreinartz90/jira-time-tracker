import {Pipe, PipeTransform} from '@angular/core';
import {DateUtil} from '../../utils/date.util';

@Pipe({
  name: 'msToTime'
})
export class MsToTimePipe implements PipeTransform {
  transform(value: number, fullName?: any): any {
    const hourLabel = fullName ? ' Hours' : 'h';
    const minuteLabel = fullName ? ' Minutes' : 'm';
    const time = DateUtil.milisToDHMS(value || 0);
    return `${time.hour > 0 ? `${time.hour}${hourLabel}` : ''} ${time.minute > 0 ? `${time.minute}${minuteLabel}` : ''}`;
  }
}
