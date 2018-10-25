import {Component, HostListener, Input} from '@angular/core';
import {fadeInContent, MatBottomSheet} from '@angular/material';
import {TimeDetailsSheetComponent} from '../time-details-sheet/time-details-sheet.component';
import {HourModel} from '../../../domain/hour.model';
import {SimplicateService} from '../../../providers/simplicate.service';
import {DateUtil} from '../../../utils/date.util';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
  animations: [fadeInContent]
})
export class TimetableComponent {

  @Input()
  groupedHours: { [key: string]: Array<any> } = {};

  @Input()
  days: Array<any> = [];

  @Input()
  activeDate: Date;

  @Input()
  timer: string;

  constructor(private bottomSheet: MatBottomSheet, public simplicateService: SimplicateService) {
  }

  showTimeDetails(item: HourModel, newTimer: boolean = false) {
    const activeTimer = this.simplicateService.getActiveTimer();

    this.bottomSheet.open(TimeDetailsSheetComponent, {
      data: {
        hour: item,
        isTimer: newTimer || item.id === activeTimer
      }
    });
  }


  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((<any>event.target).nodeName === 'BODY') {
      const {code} = event;
      if (code === 'KeyN') {
        if (this.days && this.days.length > 0) {
          this.addItemToList(this.days[this.days.length - 1]);
        } else {
          this.addNewItemToList();
        }
      }
    }
  }

  addItemToList(day: string, isTimer: boolean = false) {
    const lastItem = this.groupedHours[day][this.groupedHours[day].length - 1] || {};
    const newItem: HourModel = HourModel.fromJSON(lastItem);
    newItem.id = null;
    newItem.start_date = lastItem.end_date;

    if (isTimer) {
      newItem.end_date = DateUtil.UTCDateFromLocalDate(new Date());
    } else {
      newItem.end_date = DateUtil.addTimeInMilliseconds(newItem.start_date, 30 * 60 * 1000);
    }

    newItem.hours = 0;
    newItem.note = null;
    newItem.approvalstatus = null;
    newItem.is_time_defined = true;

    this.showTimeDetails(newItem, isTimer);
  }

  addNewItemToList(isTimer: boolean = false) {
    const item = new HourModel();
    item.employee.id = this.simplicateService.employee.id;
    item.start_date = new Date(this.activeDate.getTime());
    item.start_date.setUTCHours(8, 30, 0);

    if (isTimer) {
      item.end_date = DateUtil.UTCDateFromLocalDate(new Date());
    } else {
      item.end_date = DateUtil.addTimeInMilliseconds(item.start_date, 30 * 60 * 1000);
    }

    // item.end_date = null;
    item.hours = 0;
    item.note = null;
    item.approvalstatus = null;
    item.is_time_defined = true;

    this.showTimeDetails(item, isTimer);
  }

  getTotalHours(hours: Array<HourModel>): number {
    return hours.map(hour => hour.hours).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }
}
