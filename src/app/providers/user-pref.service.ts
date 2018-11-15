import { Injectable } from '@angular/core';
import { UserPrefModel } from '../domain/user-pref.model';

@Injectable( {
  providedIn: 'root'
} )
export class UserPrefService {

  constructor() { }


  getPreferences(): UserPrefModel {
    return new UserPrefModel( JSON.parse( localStorage.getItem( 'prefs' ) ) );
  }

  setPreferences( model: UserPrefModel ) {
    localStorage.setItem( 'prefs', JSON.stringify( model ) );
  }
}
