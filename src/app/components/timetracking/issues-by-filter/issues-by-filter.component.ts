import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { JiraService } from '../../../providers/jira.service';
import { IssueI } from '../../../domain/jira/issue.model';

@Component( {
  selector: 'app-issues-by-filter',
  templateUrl: './issues-by-filter.component.html',
  styleUrls: [ './issues-by-filter.component.scss' ]
} )
export class IssuesByFilterComponent implements OnChanges {

  @Input()
  filterId: number;

  @Output()
  issueSelect: EventEmitter<IssueI> = new EventEmitter<IssueI>();

  issues: Array<any> = [];
  loading = false;

  constructor( private jira: JiraService ) {
  }

  ngOnChanges( changes: SimpleChanges ) {
    this.updateList();
  }

  ngOnInit() {
    if ( this.filterId ) {
      this.updateList();
    }
  }

  updateList() {
    this.issues = [];
    this.loading = true;
    this.jira.getIssuesByFilterId( this.filterId ).subscribe( resp => {
        this.issues = resp.issues;
      },
      () => null,
      () => this.loading = false );
  }

}
