import { NgZone, Injectable } from "@angular/core";

@Injectable()
export class StoreDependencyService {
  constructor( public ngZone: NgZone ) { }
}

export const mockStoreDependencyService = new StoreDependencyService(
  new NgZone( { enableLongStackTrace: false } )
);
