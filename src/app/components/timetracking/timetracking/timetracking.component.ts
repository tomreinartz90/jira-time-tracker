import {Component, OnInit} from '@angular/core';
import {SimplicateService} from '../../../providers/simplicate.service';
import {DateUtil} from '../../../utils/date.util';

@Component( {
  selector: 'app-timetracking',
  templateUrl: './timetracking.component.html',
  styleUrls: ['./timetracking.component.scss']
} )
export class TimetrackingComponent implements OnInit {
  groupedHours: any;
  hours: any;
  days: string[];

  activeDate = new Date();

  constructor( private simplicate: SimplicateService ) {
  }

  ngOnInit() {
    this.getEmployeeHours();
    this.simplicate.onUpdateHour.subscribe( () => this.getEmployeeHours() );
  }

  getEmployeeHours() {
    this.simplicate.getCurrentEmployeeHours( this.activeDate ).subscribe( resp => {
        this.hours = resp;
        this.groupedHours = DateUtil.groupByDateDay( resp, ( item ) => item.start_date );
        this.days = Object.keys( this.groupedHours ).sort();
      }
    );
  }

  setActiveDate( date: Date ) {
    this.activeDate = date;
    this.getEmployeeHours();
  }

}
