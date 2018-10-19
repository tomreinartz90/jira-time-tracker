import {Routes} from '@angular/router';
// app
import {GettingStartedComponent, WelcomeScreenComponent} from './components/index';


export const WelcomeRoutes: Routes = [
    {
        path: 'welcome',
        component: WelcomeScreenComponent
    },
    {
        path: 'login',
        component: GettingStartedComponent
    }
];
