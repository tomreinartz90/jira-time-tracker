import { Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { TimeDetailsSheetComponent } from '../time-details-sheet/time-details-sheet.component';
import { HourModel } from '../../../domain/hour.model';

@Component( {
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
} )
export class TimetableComponent {

  @Input()
  groupedHours: { [key: string]: Array<any> } = {};

  @Input()
  days: Array<any> = [];

  constructor( private bottomSheet: MatBottomSheet ) {
  }

  ngOnChanges() {
    const day = Object.keys( this.groupedHours )[0];
    if ( day ) {
      this.addItemToList( day );
    }
  }

  showTimeDetails( item ) {
    this.bottomSheet.open( TimeDetailsSheetComponent, { data: item } );
  }

  addItemToList( day: string ) {
    const lastItem = this.groupedHours[day][this.groupedHours[day].length - 1] || {};
    const newItem: HourModel = HourModel.fromJSON( lastItem );
    newItem.id = null;
    newItem.start_date = null;
    newItem.end_date = null;
    newItem.hours = 0;
    newItem.note = null;
    newItem.approvalstatus = null;
    newItem.is_time_defined = true;
    this.showTimeDetails( newItem );
  }

  getTotalHours( hours: Array<HourModel> ): number {
    return hours.map( hour => hour.hours ).reduce( ( previousValue, currentValue ) => previousValue + currentValue, 0 );
  }

}
