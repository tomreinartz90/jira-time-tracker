import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class ConfigurationModel {

  flashTaskbarOnUnloggedMinutes: number = 60;

  constructor( config?: any ) {
    if ( config ) {
      Object.assign( this, config );
    }
  }

  static createDefault(): ConfigurationModel {
    return new ConfigurationModel();
  }

}
