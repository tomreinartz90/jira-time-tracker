import { Component, OnInit } from '@angular/core';
import { JiraService } from '../../../providers/jira.service';
import { Router } from '@angular/router';
import { TrackingServiceService } from '../../../providers/tracking-service.service';

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
} )
export class LoginComponent implements OnInit {

  password = '';
  email = '';
  domain = '';
  error: string = null;

  constructor( private jiraService: JiraService,
               private track: TrackingServiceService,
               private router: Router ) {
  }

  ngOnInit() {
    this.jiraService.getEmployeeInfo().subscribe( () => {
      this.goHome();
    } );
  }

  get isValid() {
    return this.password && this.email && this.domain;
  }

  private goHome() {
    this.router.navigate( ['/home'] );
  }

  get url() {
    return this.domain;
  }

  set url( url: string ) {
    const URI = new URL(url);
    console.log(url, URI);
    this.domain = URI.origin;
  }

  handleLogin() {
    this.jiraService.login( this.domain, this.email, this.password ).subscribe( result => {
      console.log( result );
      this.error = null;
      this.track.trackEvent( 'login', 'success' );
      this.goHome();
    }, ( err ) => {
      console.error( err );
      this.track.trackEvent( 'login', 'error' );
      this.error = err;
    } );
  }
}
