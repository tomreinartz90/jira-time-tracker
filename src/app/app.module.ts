import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpClient, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
// NG Translate
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';

import {WebviewDirective} from './directives/webview.directive';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {SimplicateService} from './providers/simplicate.service';
import {TimetableComponent} from './components/timetracking/timetable/timetable.component';
import {TimetrackingComponent} from './components/timetracking/timetracking/timetracking.component';
import {WeekdayselectorComponent} from './components/timetracking/weekdayselector/weekdayselector.component';
import {UserInfoBarComponent} from './components/user/user-info-bar/user-info-bar.component';
import {TimetableitemComponent} from './components/timetracking/timetableitem/timetableitem.component';
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
  MatNativeDateModule, MatProgressBarModule, MatSlideToggleModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {TimeDetailsSheetComponent} from './components/timetracking/time-details-sheet/time-details-sheet.component';
import {TimePickerComponent} from './components/base/time-picker/time-picker.component';
import {LoginComponent} from './components/login/login/login.component';
import {ProjectSelectComponent} from './components/base/project-select/project-select.component';
import {ProjectServiceSelectComponent} from './components/base/project-service-select/project-service-select.component';
import {ServiceTypeSelectComponent} from './components/base/service-type-select/service-type-select.component';
import { MsToTimePipe } from './components/base/ms-to-time.pipe';
import { HoursToMsPipe } from './components/base/hours-to-ms.pipe';
import { TimerComponent } from './components/base/timer/timer.component';
import { SelectOnFocusDirective } from './components/base/select-on-focus.directive';
import { StringToHexColorPipe } from './components/base/string-to-hex-color.pipe';
import { ApprovalStatusComponent } from './components/timetracking/approval-status/approval-status.component';

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
  MatSlideToggleModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    TimetableComponent,
    TimetrackingComponent,
    WeekdayselectorComponent,
    UserInfoBarComponent,
    TimetableitemComponent,
    TimeDetailsSheetComponent,
    TimePickerComponent,
    LoginComponent,
    ProjectSelectComponent,
    ProjectServiceSelectComponent,
    ServiceTypeSelectComponent,
    MsToTimePipe,
    HoursToMsPipe,
    TimerComponent,
    SelectOnFocusDirective,
    StringToHexColorPipe,
    ApprovalStatusComponent,
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
    TimeDetailsSheetComponent
  ],
  providers: [ElectronService, SimplicateService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
