import { Component, Input, OnInit } from '@angular/core';
import { JiraService } from "../../../providers/jira.service";
import { Subject } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';

@Component( {
  selector: 'app-issues-by-search',
  templateUrl: './issues-by-search.component.html',
  styleUrls: [ './issues-by-search.component.scss' ]
} )
export class IssuesBySearchComponent implements OnInit {


  @Input()
  searchQuery: string;

  issues: Array<any> = [];

  onSearch = new Subject();

  loading: boolean = true;

  constructor( private jiraService: JiraService ) {
  }

  ngOnInit() {
    this.searchIssues();
  }

  ngOnChanges() {
    this.onSearch.next();
  }

  searchIssues() {

    this.loading = true;
    this.onSearch.pipe(
      debounceTime( 500 ),
      mergeMap( () => {
        const search: Array<string> = [];
        if ( this.searchQuery && /\w+-\d+/.test( this.searchQuery ) ) {
          search.push( `issue = '${ this.searchQuery }'` );
        } else {
          search.push( `text ~ '${ this.searchQuery }'` );
        }
        return this.jiraService.getIssuesByJql( search.join( ' or ' ) )
      } ),
    ).subscribe( issues => {
      this.issues = issues.issues;
      this.loading = false;
    } );
  }

}
