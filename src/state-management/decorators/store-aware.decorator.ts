/**
 *
 * Maxxton Group 2019
 *
 * @author W. Hollebrandse (w.hollebrandse@maxxton.com)
 */
import { Subscription } from "rxjs";
import { StoreService } from "../store.service";
import { ChangeDetectorRef, OnDestroy, OnInit, SimpleChange } from "@angular/core";

export interface StoreAwareOptions {
  storeKey?: string,
  stateKey?: string | 'state',
  forceDetectChanges?: boolean
}

export class StoreAwareComponent implements OnDestroy, OnInit {
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
}

export function StoreAware( { stateKey = 'state', storeKey, forceDetectChanges = false }: StoreAwareOptions = {} ) {

  return ( constructor: Function ) => {

    let originalNgOnDestroy: () => void = constructor.prototype.ngOnDestroy;
    let originalNgOnOnit: () => void = constructor.prototype.ngOnInit;
    let stateSubscription: Subscription = null;

    if ( !originalNgOnDestroy || !originalNgOnOnit ) {
      throw new Error( 'When using @StoreAware ngOnInit and ngOnDestroy must be implemented. (can also be an empty function)' )
    }


    constructor.prototype.ngOnInit = function (): void {
      const params = Object.getOwnPropertyNames( this );
      const store: StoreService<any> = storeKey ? this[ storeKey ] : this[ params.find( param => this[ param ] instanceof StoreService ) ];
      const cdr: ChangeDetectorRef = this[ params.find( param => this[ param ] && this[ param ][ 'detectChanges' ] && this[ param ][ '_view' ] ) ];
      const initialState = this[ stateKey ];
      let firstChange: boolean = true;

      if ( initialState != null ) {
        throw new Error( `Trying to set StoreAware state on a non empty property: ${ this.constructor.name }.${ stateKey } ` );
      }

      const updateState = ( state: any ) => {
        const previousValue = this[ stateKey ];
        this[ stateKey ] = state;

        //trigger angular lifecycle hook to trigger functions when state has been updated.
        if ( this.ngOnChanges ) {
          this.ngOnChanges( { [ stateKey ]: new SimpleChange( previousValue, state, firstChange ) } );
        }

        if ( cdr && forceDetectChanges ) {
          cdr.detectChanges(  )
        } else if ( forceDetectChanges ) {
          throw new Error( `Could not detect changes as not ChangeDetectorRef is found on ${ this.constructor.name }` )
        }

        firstChange = false;
      };

      if ( store ) {
        //track state changes.
        stateSubscription = store.state$().subscribe( state => {
          updateState( state );
        } )
      } else {
        throw new Error( `Cannot make ${ this.constructor.name } StoreAware as it does not have an injected store. Did you forget to inject a store in the constructor?` )
      }

      originalNgOnOnit.apply( this, arguments ); // tslint:disable-line
    };

    constructor.prototype.ngOnDestroy = function (): void {
      //call the original ngOnDestroy logic.
      originalNgOnDestroy.apply( this, arguments ); // tslint:disable-line
      if ( stateSubscription ) {
        stateSubscription.unsubscribe();
        stateSubscription = null;
      }
    }
  }
}
