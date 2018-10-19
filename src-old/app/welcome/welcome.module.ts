import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WelcomeRoutingModule} from './welcome-routing.module';

import {WelcomeScreenComponent} from './components/welcome-screen/welcome-screen.component';
import {GettingStartedComponent} from './components/getting-started/getting-started.component';
import {CardComponent} from './components/card/card.component';
import {UserInfoBarComponent} from './components/user/user-info-bar/user-info-bar.component';
import {TimetrackingComponent} from './components/timetracking/timetracking/timetracking.component';
import { WeekdayselectorComponent } from './components/timetracking/weekdayselector/weekdayselector.component';
import { TimetableComponent } from './components/timetracking/timetable/timetable.component';

@NgModule({
    imports: [
        CommonModule,
        WelcomeRoutingModule
    ],
    declarations: [WelcomeScreenComponent, GettingStartedComponent, CardComponent, UserInfoBarComponent, TimetrackingComponent, WeekdayselectorComponent, TimetableComponent]
})
export class WelcomeModule {
}
