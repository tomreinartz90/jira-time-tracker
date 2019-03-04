import { Component, HostListener, Input, OnChanges } from '@angular/core';
import { fadeInContent, MatBottomSheet } from '@angular/material';
import { TimeDetailsSheetComponent } from '../time-details-sheet/time-details-sheet.component';
import { HourModel } from '../../../domain/hour.model';
import { JiraService } from '../../../providers/jira.service';
import { DateUtil } from '../../../utils/date.util';
import { TrackingServiceService } from '../../../providers/tracking-service.service';

@Component( {
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
  animations: [fadeInContent]
} )
export class TimetableComponent implements OnChanges {

  @Input()
  hours: Array<HourModel> = [];

  @Input()
  activeDate: Date;

  @Input()
  timer: string;

  approvalStatus = 'EMPTY';

  constructor(private bottomSheet: MatBottomSheet, public simplicateService: JiraService, private track: TrackingServiceService ) {
  }

  ngOnChanges() {
    const todaysHours = this.hours;
    const totalApprovedHours = todaysHours.filter( hour => !hour.approvalstatus.label );
    const totalSubmittedHours = todaysHours.filter( hour => hour.approvalstatus.label );

    if ( todaysHours.length === 0 ) {
      this.approvalStatus = 'EMPTY';
    } else if ( totalApprovedHours.length === todaysHours.length ) {
      this.approvalStatus = 'APPROVED';
    } else if ( totalSubmittedHours.length > 1 ) {
      this.approvalStatus = 'TO_RESUBMIT';
    } else {
      this.approvalStatus = 'TO_APPROVE';
    }
  }

  showTimeDetails( item: HourModel, newTimer: boolean = false ) {
    const activeTimer = this.simplicateService.getActiveTimer();
    this.track.trackEvent( 'timetable', 'show-details' );
    this.bottomSheet.open<TimeDetailsSheetComponent>( TimeDetailsSheetComponent as any, {
      disableClose: true,
      autoFocus: false,
      data: {
        hour: item,
        isTimer: newTimer || (activeTimer && item.id === activeTimer)
      }
    } );
  }


  @HostListener( 'window:keydown', ['$event'] )
  onKeyDown( event: KeyboardEvent ) {
    if ( (<any>event.target).nodeName === 'BODY' ) {
      const { code } = event;
      if ( code === 'KeyN' ) {
        if ( this.hours && this.hours.length > 0 ) {
          this.addItemToList();
        } else {
          this.addNewItemToList();
        }
      }
    }
  }

  startStopTimer() {
    if ( this.timer ) {
      this.track.trackEvent( 'timetable', 'stop-timer' );
      this.simplicateService.clearTimer();
    } else {
      this.add();
      this.track.trackEvent( 'timetable', 'start-timer' );
    }
  }

  add() {
    if ( this.hours && this.hours.length ) {
      this.addItemToList( this.hours[this.hours.length - 1] );
    } else {
      this.addNewItemToList();
    }
  }

  addItemToList( copyFrom?: HourModel ) {
    this.track.trackEvent( 'timetable', 'add-item' );
    const lastItem: HourModel = this.hours[this.hours.length - 1] || ({} as HourModel);
    const newItem: HourModel = HourModel.fromJSON( copyFrom || lastItem );
    newItem.id = null;

    newItem.start_date = lastItem.end_date;
    newItem.end_date = DateUtil.addTimeInMilliseconds( newItem.start_date, 30 * 60 * 1000 );

    newItem.hours = 0;
    newItem.note = null;
    newItem.approvalstatus = null;
    newItem.is_time_defined = true;

    this.showTimeDetails( newItem, false );
  }

  addNewItemToList() {
    this.track.trackEvent( 'timetable', 'add-new-item' );
    const item = new HourModel();
    item.employee.id = this.simplicateService.employee.id;
    item.start_date = new Date( this.activeDate.getTime() );
    item.start_date.setUTCHours( 8, 30, 0 );

    item.end_date = DateUtil.addTimeInMilliseconds( item.start_date, 30 * 60 * 1000 );

    // item.end_date = null;
    item.hours = 0;
    item.note = null;
    item.approvalstatus = null;
    item.is_time_defined = true;

    this.showTimeDetails( item );
  }

  getTotalHours(): number {
    if ( this.hours && this.hours.length ) {
      return this.hours.map( hour => hour.hours ).reduce( ( previousValue, currentValue ) => previousValue + currentValue, 0 );
    }
    return 0;
  }

  hasGap( i: number ) {
    if ( i > 0 && this.hours && this.hours.length ) {
      const curr = this.hours[i].start_date;
      const prev = this.hours[i - 1].end_date;
      // max 10 sec between two items

      return (this.hours[i].is_time_defined && curr.getTime() - prev.getTime() > 1000 * 60);
    }
  }

  handleTimeAction( event: string, item: HourModel ) {
    switch ( event ) {
      case 'EDIT':
        return this.showTimeDetails( item );
      case 'COPY':
        return this.addItemToList( item );
    }
  }
}
