import {Component, Input} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {TimeDetailsSheetComponent} from '../time-details-sheet/time-details-sheet.component';
import {HourModel} from '../../../domain/hour.model';
import {SimplicateService} from '../../../providers/simplicate.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent {

  @Input()
  groupedHours: { [key: string]: Array<any> } = {};

  @Input()
  days: Array<any> = [];

  @Input()
  activeDate: Date;

  constructor(private bottomSheet: MatBottomSheet, public simplicateService:SimplicateService) {
  }

  showTimeDetails(item) {
    this.bottomSheet.open(TimeDetailsSheetComponent, {data: item});
  }

  addItemToList(day: string) {
    const lastItem = this.groupedHours[day][this.groupedHours[day].length - 1] || {};
    const newItem: HourModel = HourModel.fromJSON(lastItem);
    newItem.id = null;
    newItem.start_date = lastItem.end_date;
    newItem.end_date = new Date(newItem.start_date.getTime() + (30 * 60 * 1000));
    newItem.hours = 0;
    newItem.note = null;
    newItem.approvalstatus = null;
    newItem.is_time_defined = true;
    this.showTimeDetails(newItem);
  }

  addNewItemToList() {
    const item = new HourModel();
    item.employee.id = this.simplicateService.employee.id;
    item.start_date = new Date(this.activeDate.getTime());
    item.start_date.setUTCHours(8, 30, 0);
    item.end_date = new Date(item.start_date.getTime() + (30 * 60 * 1000));
    // item.end_date = null;
    item.hours = 0;
    item.note = null;
    item.approvalstatus = null;
    item.is_time_defined = true;
    this.showTimeDetails(item);
  }

  getTotalHours(hours: Array<HourModel>): number {
    return hours.map(hour => hour.hours).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

}
