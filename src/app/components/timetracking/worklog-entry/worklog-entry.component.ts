import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorklogEntryDetailsComponent } from "../worklog-entry-details/worklog-entry-details.component";

@Component( {
  selector: 'app-worklog-entry',
  templateUrl: './worklog-entry.component.html',
  styleUrls: [ './worklog-entry.component.scss' ]
} )
export class WorklogEntryComponent implements OnInit {

  @Input()
  worklog: any;

  @HostBinding( 'class.worklog-entry' )
  @HostBinding( 'class.wrap' )
  className = true;

  constructor( public dialog: MatDialog ) {
  }

  ngOnInit() {
  }

  @HostListener( 'click' )
  onClick() {
    this.dialog.open( WorklogEntryDetailsComponent, { width: '100%', data: this.worklog, position: { left: '20px' } } )
  }


}
