import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {NgxElectronService} from './../../../ngx-electron/ngx-electron.service';
import {SimplicateService} from '../../../services/simplicate.service';

@Component({
    selector: 'seed-welcome-screen',
    templateUrl: './welcome-screen.component.html',
    styleUrls: ['./welcome-screen.component.scss']
})
export class WelcomeScreenComponent {

    constructor(
        private electron: NgxElectronService,
        private simplicateService: SimplicateService,
        private router: Router) {
    }

    gettingStarted(): void {
        this.electron.send('ping');
        this.electron.listener$.subscribe(message => {
            if (message === 'pong') {
                this.electron.shell.beep();
                this.router.navigate(['/getting-started']);
            }
        });
    }

}
