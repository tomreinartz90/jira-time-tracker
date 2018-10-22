import {Component, Input, OnInit} from '@angular/core';
import {SimplicateService} from '../../../providers/simplicate.service';
import {DateUtil} from '../../../utils/date.util';

@Component({
  selector: 'app-timetableitem',
  templateUrl: './timetableitem.component.html',
  styleUrls: ['./timetableitem.component.scss']
})
export class TimetableitemComponent implements OnInit {

  @Input()
  item: any = {};


  constructor(private simplicate: SimplicateService) {
  }

  ngOnInit() {
  }



  handleInputBlur(event) {
    const value = event.currentTarget.value;
  }

  updateHours(hours) {
    const item = {...this.item, hours};
    return this.simplicate.updateEmployeeHours(item).subscribe(resp => {
      console.log(resp);
    });
  }

  formatTime(time) {
    const [hours = 0, decimals = 0] = `${time}`.split('.');
    return `${hours}:${Math.round(60 * parseFloat(`0.${decimals}`))}`;
  }

  getTime(date:Date){
    return DateUtil.getTimeForInput(date);
  }


}
