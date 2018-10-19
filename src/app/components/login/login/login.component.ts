import { Component, OnInit } from '@angular/core';
import { SimplicateService } from '../../../providers/simplicate.service';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
} )
export class LoginComponent implements OnInit {

  password: string = '';
  email: string = '';
  domain: string = '';
  error: string = null;

  constructor( private simplicateService: SimplicateService,
               private router: Router ) { }

  ngOnInit() {
    this.simplicateService.getEmployeeInfo().subscribe( () => {
      this.goHome();
    } );
  }

  get isValid() {
    return this.password && this.email && this.domain;
  }

  private goHome() {
    this.router.navigate( ['/home'] );
  }

  handleLogin() {
    this.simplicateService.login( this.domain, this.email, this.password ).subscribe( result => {
      console.log( result );
      this.error = null;
      this.goHome();
    }, ( err ) => {
      console.error( err );
      this.error = err.error.errors[0].message.replace( /_/g, ' ' );
    } );
  }
}
