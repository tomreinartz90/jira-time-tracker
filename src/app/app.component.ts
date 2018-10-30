import {Component, HostBinding, OnInit} from '@angular/core';
import {ElectronService} from './providers/electron.service';
import {TranslateService} from '@ngx-translate/core';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
} )
export class AppComponent implements OnInit {
  @HostBinding( 'class.ready' )
  ready = false;

  constructor( public electronService: ElectronService,
               private translate: TranslateService ) {

    translate.setDefaultLang( 'en' );

    if ( electronService.isElectron() ) {
      console.log( 'Mode electron' );
      console.log( 'Electron ipcRenderer', electronService.ipcRenderer );
      console.log( 'NodeJS childProcess', electronService.childProcess );
    } else {
      console.log( 'Mode web' );
    }
  }

  ngOnInit() {
    setTimeout( () => {
      this.ready = true;
    }, 500 );
  }
}
