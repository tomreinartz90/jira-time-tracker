import { Component, OnInit } from '@angular/core';
import { JiraService } from '../../../providers/jira.service';

@Component( {
  selector: 'app-user-info-bar',
  templateUrl: './user-info-bar.component.html',
  styleUrls: [ './user-info-bar.component.scss' ]
} )
export class UserInfoBarComponent implements OnInit {
  public employee: any;

  constructor( private jiraService: JiraService ) {
  }

  ngOnInit() {
    this.jiraService.getEmployeeInfo().subscribe( employee => {
      this.employee = employee;
    } );
  }

  get avatar() {
    if ( this.employee ) {
      return this.employee.avatarUrls[ '48x48' ];
    }
  }

}
