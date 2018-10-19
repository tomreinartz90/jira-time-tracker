import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule( {
  imports: [RouterModule.forRoot( routes, { useHash: true } )],
  exports: [RouterModule]
} )
export class AppRoutingModule {}
