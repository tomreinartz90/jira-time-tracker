import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JiraService} from '../../../providers/jira.service';
import * as ms from 'ms';
import {IssueI} from "../../../domain/jira/issue.model";

@Component({
  selector: 'app-worklog-form',
  templateUrl: './worklog-form.component.html',
  styleUrls: ['./worklog-form.component.scss']
})
export class WorklogFormComponent implements OnInit {


  @Output()
  onUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();


  set time(value: string) {
    if (value && !value.match(/\w/)) {
      value = `${value}m`;
    }
    try {
      console.log(ms(value));
      this._time = parseInt(ms(value)) / 1000;
    } catch (e) {
      this._time = 0;
      console.error(`could not update time with ${value}`)
    }
  }

  get time(): string {
    if (this._time) {

      return ms(this._time * 1000);
    }
  }

  @Input()
  activeDate:Date = new Date();

  @Input()
  issue:IssueI;

  @Input('time')
  _time = 0;

  constructor(private jiraService: JiraService) {
  }

  ngOnInit() {
  }

  addWorkLog() {
    this.jiraService.logWork(this.issue.key, {
      started: this.activeDate.toISOString(),
      timeSpentSeconds: this._time
    }).subscribe(() => {
      this.onUpdate.emit(true);
    });

  }
}
