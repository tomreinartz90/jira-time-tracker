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
  groupedHours: { [key: string]: Array<HourModel> } = {};

  @Input()
  days: Array<string> = [];

  @Input()
  activeDate: Date;

  @Input()
  timer: string;

  constructor(private bottomSheet: MatBottomSheet, public simplicateService: SimplicateService) {
  }

  showTimeDetails(item: HourModel, newTimer: boolean = false) {
    const activeTimer = this.simplicateService.getActiveTimer();
    console.log(activeTimer);
    this.bottomSheet.open(TimeDetailsSheetComponent, {
      data: {
        hour: item,
        isTimer: newTimer || (activeTimer && item.id === activeTimer)
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

  startStopTimer(day?: string) {
    if (this.timer) {
      this.simplicateService.clearTimer();
    } else {
      day ? this.addItemToList(day, true) : this.addNewItemToList(true);
    }
  }

  addItemToList(day: string, isTimer: boolean = false) {
    const lastItem: HourModel = this.groupedHours[day][this.groupedHours[day].length - 1] || ({} as HourModel);
    const newItem: HourModel = HourModel.fromJSON(lastItem);
    newItem.id = null;
    newItem.start_date = lastItem.end_date;

    if (isTimer) {
      newItem.start_date = DateUtil.UTCDateFromLocalDate(new Date());
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
      item.start_date = DateUtil.UTCDateFromLocalDate(new Date());
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

  getTotalHours(): number {
    if (this.groupedHours && this.days.length && this.groupedHours[this.days[0]]) {
      return this.groupedHours[this.days[0]].map(hour => hour.hours).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }
    return 0;
  }

  hasGap(i: number) {
    if (i > 0 && this.groupedHours && this.days.length && this.groupedHours[this.days[0]][i - 1]) {
      const curr = this.groupedHours[this.days[0]][i].start_date;
      const prev = this.groupedHours[this.days[0]][i - 1].end_date;
      // max 10 sec between two items
      return (curr.getTime() - prev.getTime() > 1000 * 10);
    }
  }
}
