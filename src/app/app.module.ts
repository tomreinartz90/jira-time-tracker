import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpClient, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
// NG Translate
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {WebviewDirective} from './directives/webview.directive';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {JiraService} from './providers/jira.service';
import {TimetrackingComponent} from './components/timetracking/timetracking/timetracking.component';
import {WeekdayselectorComponent} from './components/timetracking/weekdayselector/weekdayselector.component';
import {UserInfoBarComponent} from './components/user/user-info-bar/user-info-bar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {TimePickerComponent} from './components/base/time-picker/time-picker.component';
import {LoginComponent} from './components/login/login/login.component';
import {ProjectSelectComponent} from './components/base/project-select/project-select.component';
import {ProjectServiceSelectComponent} from './components/base/project-service-select/project-service-select.component';
import {ServiceTypeSelectComponent} from './components/base/service-type-select/service-type-select.component';
import {MsToTimePipe} from './components/base/ms-to-time.pipe';
import {HoursToMsPipe} from './components/base/hours-to-ms.pipe';
import {TimerComponent} from './components/base/timer/timer.component';
import {SelectOnFocusDirective} from './components/base/select-on-focus.directive';
import {StringToHexColorPipe} from './components/base/string-to-hex-color.pipe';
import {CleanNamePipe} from './components/base/clean-name.pipe';
import {CustomErrorHandler} from './providers/custom-error-handler.service';
import {ConfirmButtonComponent} from './components/base/confirm-button/confirm-button.component';
import {MinutesToMsPipe} from './components/base/minutes-to-ms.pipe';
import { WorklogEntryComponent } from './components/timetracking/worklog-entry/worklog-entry.component';
import { WorklogFormComponent } from './components/timetracking/worklog-form/worklog-form.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const matModules = [
  MatToolbarModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatBottomSheetModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    TimetrackingComponent,
    WeekdayselectorComponent,
    UserInfoBarComponent,
    TimePickerComponent,
    LoginComponent,
    ProjectSelectComponent,
    ProjectServiceSelectComponent,
    ServiceTypeSelectComponent,
    MsToTimePipe,
    HoursToMsPipe,
    MinutesToMsPipe,
    TimerComponent,
    SelectOnFocusDirective,
    StringToHexColorPipe,
    CleanNamePipe,
    ConfirmButtonComponent,
    WorklogEntryComponent,
    WorklogFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    matModules,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
  ],
  providers: [JiraService,
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    }, ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
