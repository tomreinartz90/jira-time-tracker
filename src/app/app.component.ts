import {Component, HostBinding, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
} )
export class AppComponent implements OnInit {
  @HostBinding( 'class.ready' )
  ready = false;

  constructor( private translate: TranslateService ) {
    translate.setDefaultLang( 'en' );
  }

  ngOnInit() {
    setTimeout( () => {
      this.ready = true;
    }, 500 );
  }
}
