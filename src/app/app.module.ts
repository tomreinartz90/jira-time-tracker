import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
// NG Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { JiraService } from './providers/jira.service';
import { TimetrackingComponent } from './components/timetracking/timetracking/timetracking.component';
import { WeekdayselectorComponent } from './components/timetracking/weekdayselector/weekdayselector.component';
import { UserInfoBarComponent } from './components/user/user-info-bar/user-info-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginComponent } from './components/login/login/login.component';
import { MsToTimePipe } from './components/base/ms-to-time.pipe';
import { HoursToMsPipe } from './components/base/hours-to-ms.pipe';
import { SelectOnFocusDirective } from './components/base/select-on-focus.directive';
import { CustomErrorHandler } from './providers/custom-error-handler.service';
import { MinutesToMsPipe } from './components/base/minutes-to-ms.pipe';
import { WorklogEntryComponent } from './components/timetracking/worklog-entry/worklog-entry.component';
import { WorklogFormComponent } from './components/timetracking/worklog-form/worklog-form.component';
import { IssuesByFilterComponent } from './components/timetracking/issues-by-filter/issues-by-filter.component';
import { JiraTimeTrackerStore } from './store/jira-time-tracker.store';
import { IssuesBySearchComponent } from './components/timetracking/issues-by-search/issues-by-search.component';
import { WorklogEntryDetailsComponent } from './components/timetracking/worklog-entry-details/worklog-entry-details.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, './assets/i18n/', '.json' );
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
  MatProgressSpinnerModule,
  MatSelectModule
];

@NgModule( {
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    TimetrackingComponent,
    WeekdayselectorComponent,
    UserInfoBarComponent,
    LoginComponent,
    MsToTimePipe,
    HoursToMsPipe,
    MinutesToMsPipe,
    SelectOnFocusDirective,
    WorklogEntryComponent,
    WorklogFormComponent,
    IssuesByFilterComponent,
    IssuesBySearchComponent,
    WorklogEntryDetailsComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    matModules,
    ReactiveFormsModule,
    TranslateModule.forRoot( {
      loader: {
        provide: TranslateLoader,
        useFactory: ( HttpLoaderFactory ),
        deps: [ HttpClient ]
      }
    } )
  ],
  entryComponents: [
    WorklogEntryDetailsComponent,
  ],
  providers: [
    JiraService,
    JiraTimeTrackerStore,
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    }, ],
  bootstrap: [ AppComponent ]
} )
export class AppModule {
}
