import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DateUtil} from '../../../utils/date.util';
import {TrackingServiceService} from '../../../providers/tracking-service.service';

@Component( {
  selector: 'app-weekdayselector',
  templateUrl: './weekdayselector.component.html',
  styleUrls: ['./weekdayselector.component.scss']
} )
export class WeekdayselectorComponent implements OnInit {

  @Input()
  activeDate: Date;

  @Input()
  initials: string;

  @Output()
  activeDateChange = new EventEmitter<Date>();

  constructor(private track: TrackingServiceService) {
  }

  ngOnInit() {
  }

  @HostListener( 'window:keydown', ['$event'] )
  onKeyDown( event: KeyboardEvent ) {
    if ( (<any>event.target).nodeName === 'BODY' ) {
      const { code } = event;
      if ( code === 'ArrowRight' ) {
        this.next();
      } else if ( code === 'ArrowLeft' ) {
        this.prev();
      }
    }
  }

  get isActiveDateToday() {
    return DateUtil.isDateDayTheSame( this.activeDate, new Date() );
  }

  next() {
    this.activeDateChange.emit( new Date( this.activeDate.getTime() + (60 * 60 * 24 * 1000) ) );
    this.track.trackEvent('timetable', 'next-date');
  }

  prev() {
    this.activeDateChange.emit( new Date( this.activeDate.getTime() - (60 * 60 * 24 * 1000) ) );
    this.track.trackEvent('timetable', 'prev-date');
  }

  updateDate( event: Date ) {
    this.activeDateChange.emit( new Date( event.getTime() - (event.getTimezoneOffset() * 60000) ) );
    this.track.trackEvent('timetable', 'change-date');
  }

}
