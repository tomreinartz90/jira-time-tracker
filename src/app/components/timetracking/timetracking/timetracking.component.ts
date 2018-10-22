import { Component, HostBinding, OnInit } from '@angular/core';
import { SimplicateService } from '../../../providers/simplicate.service';
import { DateUtil } from '../../../utils/date.util';

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

  @HostBinding( 'class.active' )
  active: boolean;

  employee: any;

  constructor( private simplicate: SimplicateService ) {
  }

  ngOnInit() {
    this.active = true;
    this.getEmployeeHours();
    this.getEmployee();
    this.simplicate.onUpdateHour.subscribe( () => this.getEmployeeHours() );
  }

  getEmployee() {
    this.simplicate.getEmployeeInfo().subscribe( employee => {
      this.employee = employee;
      console.log( employee );
    } );
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
