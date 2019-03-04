import { ErrorHandler, Injectable } from '@angular/core';
import { TrackingServiceService } from './tracking-service.service';

@Injectable( {
  providedIn: 'root'
} )
export class CustomErrorHandler implements ErrorHandler {
  constructor( private trackSerivce: TrackingServiceService ) {
  }

  handleError( error ) {
    // your custom error handling logic
    console.error( error );
    // this.trackSerivce.trackException( error );
  }
}
