import {Component, HostBinding, OnInit} from '@angular/core';
import {JiraService} from '../../../providers/jira.service';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-timetracking',
  templateUrl: './timetracking.component.html',
  styleUrls: ['./timetracking.component.scss']
})
export class TimetrackingComponent implements OnInit {
  loading: boolean;
  groupedHours: any;
  hours: any;
  timer: string;
  days: string[];

  activeDate = new Date();

  @HostBinding('class.active')
  active: boolean;

  employee: any;

  constructor(private simplicate: JiraService) {
  }

  ngOnInit() {
    this.active = true;
    this.getEmployeeHours();
    this.getEmployee();
  }

  getEmployee() {
    this.simplicate.getEmployeeInfo().subscribe(employee => {
      this.employee = employee;
    });
  }

  get totalTimeSpend() {
    if (this.hours) {
      return this.hours.map(issue => issue.totalTimeSpendSeconds)
    }
    return 0
  }

  getEmployeeHours() {
    this.loading = true;
    this.simplicate.getCurrentEmployeeHours(this.activeDate).subscribe(resp => {
        this.hours = resp;
      },
      () => {
      },
      () => this.loading = false
    );
  }

  setActiveDate(date: Date) {
    this.activeDate = date;
    this.hours = [];
    this.groupedHours = [];
    this.days = [];
    this.getEmployeeHours();
  }


}
