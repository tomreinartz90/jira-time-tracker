import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
// electron
import {NgxElectronModule} from './ngx-electron/ngx-electron.module';
// app
import {AppRoutingModule} from './app-routing.module';
import {WelcomeModule} from './welcome/welcome.module';
import {AppComponent} from './app.component';
import {SimplicateService} from 'app/services/simplicate.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        NgxElectronModule,
        WelcomeModule,
    ],
    providers: [SimplicateService],
    bootstrap: [AppComponent]
})
export class AppModule { }
