import {Component, HostListener, Input, OnChanges} from '@angular/core';
import {fadeInContent, MatBottomSheet} from '@angular/material';
import {TimeDetailsSheetComponent} from '../time-details-sheet/time-details-sheet.component';
import {HourModel} from '../../../domain/hour.model';
import {SimplicateService} from '../../../providers/simplicate.service';
import {DateUtil} from '../../../utils/date.util';
import {TrackingServiceService} from '../../../providers/tracking-service.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
  animations: [fadeInContent]
})
export class TimetableComponent implements OnChanges {

  @Input()
  groupedHours: { [key: string]: Array<HourModel> } = {};

  @Input()
  days: Array<string> = [];

  @Input()
  activeDate: Date;

  @Input()
  timer: string;

  approvalStatus = 'EMPTY';

  constructor(private bottomSheet: MatBottomSheet, public simplicateService: SimplicateService, private track: TrackingServiceService) {
  }

  ngOnChanges() {
    const todaysHours = this.groupedHours[this.days[0]] || [];
    const totalApprovedHours = todaysHours.filter(hour => !hour.approvalstatus.label);
    const totalSubmittedHours = todaysHours.filter(hour => hour.approvalstatus.label);
    console.log(todaysHours, totalApprovedHours);

    if (todaysHours.length === 0) {
      this.approvalStatus = 'EMPTY';
    } else if (totalApprovedHours.length === todaysHours.length) {
      this.approvalStatus = 'APPROVED';
    } else if (totalSubmittedHours.length > 1) {
      this.approvalStatus = 'TO_RESUBMIT';
    } else {
      this.approvalStatus = 'TO_APPROVE';
    }
  }

  showTimeDetails(item: HourModel, newTimer: boolean = false) {
    const activeTimer = this.simplicateService.getActiveTimer();
    console.log(activeTimer);
    this.track.trackEvent('timetable', 'show-details');
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
      this.track.trackEvent('timetable', 'stop-timer');
      this.simplicateService.clearTimer();
    } else {
      day ? this.addItemToList(day, true) : this.addNewItemToList(true);
      this.track.trackEvent('timetable', 'start-timer');
    }
  }

  addItemToList(day: string, isTimer: boolean = false, copyFrom?: HourModel) {
    this.track.trackEvent('timetable', 'add-item');
    const lastItem: HourModel = this.groupedHours[day][this.groupedHours[day].length - 1] || ({} as HourModel);
    const newItem: HourModel = HourModel.fromJSON(copyFrom || lastItem);
    newItem.id = null;

    if (isTimer) {
      newItem.start_date = DateUtil.UTCDateFromLocalDate(new Date());
      newItem.end_date = DateUtil.UTCDateFromLocalDate(new Date());
    } else {
      newItem.start_date = lastItem.end_date;
      newItem.end_date = DateUtil.addTimeInMilliseconds(newItem.start_date, 30 * 60 * 1000);
    }

    newItem.hours = 0;
    newItem.note = null;
    newItem.approvalstatus = null;
    newItem.is_time_defined = true;

    this.showTimeDetails(newItem, isTimer);
  }

  addNewItemToList(isTimer: boolean = false) {
    this.track.trackEvent('timetable', 'add-new-item');
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

  handleTimeAction(event: string, item: HourModel) {
    switch (event) {
      case 'EDIT':
        return this.showTimeDetails(item);
      case 'COPY_TIMER':
        return this.addItemToList(this.days[0], true, item);
      case 'COPY':
        return this.addItemToList(this.days[0], false, item);
    }
  }
}
