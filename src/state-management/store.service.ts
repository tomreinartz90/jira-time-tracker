import { catchError, tap, } from 'rxjs/operators';
import { empty, Observable, of, Subscription } from 'rxjs';
import { ActionService } from './action.service';
import { GlobalStateService } from './global-state.service';
import { LogType, StoreLoggingUtil } from './util/store-logging.util';
import { StoreDependencyService } from './store-dependency.service';

// TODO: Add Angular decorator.
export class StoreService<S extends object> {

  // gets injected by decorator
  public actionHandlers: { [ key: string ]: any };
  public effectHandlers: { [ key: string ]: Array<any> };
  public actionHandlerSub: Subscription;
  public effectHandlerSubs: Subscription[] = [];

  private _storeId: string;

  constructor( initialState?: S, storeId?: string ) {
    this._storeId = storeId;

    if ( initialState ) {
      this.setState( initialState );
    }

    this.setupActionHandlers();
  }

  get storeId(): string {
    if ( !this._storeId ) {
      const name = this.constructor.name;

      // when multiple instances of the same store service are running it will add an instanceId to the slice of state
      if ( GlobalStateService.getSliceSnapshot( name ) ) {
        const newStoreName = `${ name }-instance-${ Date.now() }`;
        console.info( `${ name } is already defined in the global state and will be created as ${ newStoreName }` );
        this._storeId = newStoreName;
      } else {
        this._storeId = name;
      }
    }
    return this._storeId;
  }

  /**
   * update the current state with a new version of the state and return the updated version of the state.
   * @param state
   */
  setState( state: Partial<S> ) {
    GlobalStateService.setSliceOfState( this.storeId, state );
  }

  /**
   * get a stream of state updates (used to show information in a component)
   */
  state$ = () => {
    return GlobalStateService.sliceOfState$( this.storeId ) as Observable<Readonly<S>>;
  }

  /**
   * get the current state as an Observable (this can be used in effects);
   */
  stateSnapshot$ = () => {
    return of( this.snapshot ) as Observable<S>;
  }


  /**
   * this method should only be used by the action decorators to inject the current state into the handler;
   */
  get snapshot(): Readonly<S> {
    return GlobalStateService.getSliceSnapshot( this.storeId );
  }

  ngOnDestroy() {
    this.effectHandlerSubs.forEach( sub => sub.unsubscribe() );
    this.actionHandlerSub.unsubscribe();
    GlobalStateService.deleteSlice( this.storeId );
  }

  setupActionHandlers() {
    this.actionHandlerSub = ActionService.onActions$().subscribe( action => {

      // handle direct state manipulation
      if ( action && this.actionHandlers && this.actionHandlers[ action.type.toString() ] ) {
        const result: Partial<S> = ( this as any )[ this.actionHandlers[ action.type.toString() ] ]( action.payload, this.snapshot );

        if ( ActionService.debugEnabled ) {
          StoreLoggingUtil.log( LogType.REDUCER, `REDUCER RAN FOR ACTION ${ action.type }`, [
            { subject: 'method', log: `${ this.constructor.name }.${ this.actionHandlers[ action.type ] }` },
            { subject: 'payload', log: action.payload },
            { subject: 'result', log: result },
          ] );
        }

        this.setState( result );
      }

      // handle sideEffects
      if ( action && this.effectHandlers && this.effectHandlers[ action.type.toString() ] ) {
        const snapShot = { ...( this.snapshot as any ) };
        this.effectHandlers[ action.type.toString() ].forEach( effectMethodKey => {

          if ( ActionService.debugEnabled ) {
            StoreLoggingUtil.log( LogType.EFFECT, `EFFECT STARTED FOR ACTION ${ action.type }`, [
              { subject: 'method', log: `${ this.constructor.name }.${ effectMethodKey }` },
              { subject: 'payload', log: action.payload },
            ], false, false );
          }
          const result: Observable<any> | null = ( this as any )[ effectMethodKey ]( action.payload, snapShot );

          if ( result ) {
            this.effectHandlerSubs.push( result.pipe( tap( undefined, undefined, () => {
//            on complete
                if ( ActionService.debugEnabled ) {
                  StoreLoggingUtil.log( LogType.EFFECT, `EFFECT COMPLETED FOR ACTION ${ action.type }`, [
                    { subject: 'method', log: `${ this.constructor.name }.${ effectMethodKey }` },
                    { subject: 'payload', log: action.payload },
                  ], false, true );
                }
              } ),
              catchError( ( error ) => {
                console.error( `There was an error during execution of effect ${ this.constructor.name }.${ effectMethodKey }`, error );
                return empty();
              } ) ).subscribe() );
          }

          if ( ActionService.debugEnabled && !result ) {
            StoreLoggingUtil.log( LogType.EFFECT, `COULD NOT START EFFECT FOR ACTION ${ action.type }`, [
              { subject: 'method', log: `${ this.constructor.name }.${ effectMethodKey }` },
              { subject: 'payload', log: action.payload },
            ], false, true );
          }
        } );
      }
    } );
  }
}
