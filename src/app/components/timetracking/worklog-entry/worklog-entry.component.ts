import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component( {
  selector: 'app-worklog-entry',
  templateUrl: './worklog-entry.component.html',
  styleUrls: ['./worklog-entry.component.scss']
} )
export class WorklogEntryComponent implements OnInit {

  @Input()
  worklog: any;

  @HostBinding('class.worklog-entry')
  @HostBinding('class.wrap')
  className = true;

  constructor() { }

  ngOnInit() {
  }


}
