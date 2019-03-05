import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JiraService} from '../../../providers/jira.service';
import * as ms from 'ms';

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
    if (value && value.match(/\w/)) {
      value = `${value}m`;
    }
    try {
      this._time = ms(value) / 1000;
    } catch (e) {
      console.error(`could not update time with ${value}`)
    }
  }

  get time(): string {
    if (this._time) {

      return ms(this._time * 1000);
    }
  }


  @Input()
  issue = '';

  @Input('time')
  _time = 0;

  constructor(private jiraService: JiraService) {
  }

  ngOnInit() {
  }

  addWorkLog() {
    this.jiraService.logWork(this.issue, {
      timeSpentSeconds: this._time
    }).subscribe(() => {
      this.onUpdate.emit(true);
    });

  }
}
