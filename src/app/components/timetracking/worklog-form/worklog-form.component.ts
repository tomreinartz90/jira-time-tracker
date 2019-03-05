import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JiraService } from '../../../providers/jira.service';

@Component( {
  selector: 'app-worklog-form',
  templateUrl: './worklog-form.component.html',
  styleUrls: ['./worklog-form.component.scss']
} )
export class WorklogFormComponent implements OnInit {

  @Output()
  onUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  time = 0;

  @Input()
  issue = '';

  constructor( private jiraService: JiraService ) { }

  ngOnInit() {
  }

  addWorkLog() {
    this.jiraService.logWork( this.issue, {
      timeSpentSeconds: this.time
    } ).subscribe( () => {
      this.onUpdate.emit( true );
    } );

  }
}
