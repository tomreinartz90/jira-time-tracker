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
  issues: any;

  activeDate = new Date();

  @HostBinding('class.active')
  active: boolean;

  constructor(private jiraService: JiraService) {
  }

  ngOnInit() {
    this.active = true;
    this.getWorklog();
  }

  get totalTimeSpend() {
    if (this.issues) {
      return this.issues.map( issue => issue.totalTimeSpendSeconds)
    }
    return 0;
  }

  getWorklog() {
    this.loading = true;
    this.jiraService.getCurrentEmployeeHours(this.activeDate).subscribe(resp => {
        this.issues = resp;
        console.log(resp);
      },
      () => {
      },
      () => this.loading = false
    );
  }

  setActiveDate(date: Date) {
    this.activeDate = date;
    this.issues = [];
    this.getWorklog();
  }


}
