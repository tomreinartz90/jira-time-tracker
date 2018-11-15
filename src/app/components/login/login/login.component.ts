import {Component, OnInit} from '@angular/core';
import {SimplicateService} from '../../../providers/simplicate.service';
import {Router} from '@angular/router';
import {TrackingServiceService} from '../../../providers/tracking-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password = '';
  email = '';
  domain = '';
  error: string = null;

  constructor(private simplicateService: SimplicateService,
              private track: TrackingServiceService,
              private router: Router) {
  }

  ngOnInit() {
    this.simplicateService.getEmployeeInfo().subscribe(() => {
      this.goHome();
    });
  }

  get isValid() {
    return this.password && this.email && this.domain;
  }

  private goHome() {
    this.router.navigate(['/home']);
  }

  handleLogin() {
    this.simplicateService.login(this.domain, this.email, this.password).subscribe(result => {
      console.log(result);
      this.error = null;
      this.track.trackEvent('login', 'success');
      this.goHome();
    }, (err) => {
      console.error(err);
      this.track.trackEvent('login', 'error');
      this.error = err.error.errors[0].message.replace(/_/g, ' ');
    });
  }
}
