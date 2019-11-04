import { distinctUntilChanged, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from "rxjs";

export class GlobalStateService {
  private static globalState: { [ key: string ]: any } = {};
  private static readonly globalStateChanges = new BehaviorSubject<any>( GlobalStateService.globalState );
  private static debugMode: boolean = false;

  static enableDebugInfo() {
    GlobalStateService.debugMode = true;
  }

  static disableDebugInfo() {
    GlobalStateService.debugMode = false;
  }

  /**
   * used to set the current state of the application (this can be used to initialize the complete state when the application is starting up)
   * @param state
   * @param mergeWithCurrentState
   */
  static setState( state: { [ key: string ]: any, }, mergeWithCurrentState: boolean = true ) {
    if ( state && typeof state === 'object' ) {
      const globalState = mergeWithCurrentState ? { ...GlobalStateService.globalState, ...state } : state;

      GlobalStateService.globalState = globalState;
      GlobalStateService.globalStateChanges.next( globalState );

    } else {
      throw new Error( 'Cannot update state without an object containing state' );
    }
  }

  /**
   * get an observable that emits the current state of the application
   */
  static globalState$(): Observable<any> {
    return GlobalStateService.globalStateChanges.asObservable();
  }


  /**
   * this method should only be used by the action decorators to inject the current state into the handler;
   */
  static get snapshot(): { [ key: string ]: any } {
    return { ...GlobalStateService.globalState };
  }

  /**
   * used to get a specific slice of state
   * @param slice
   */
  static sliceOfState$<S>( slice: string ) {
    return GlobalStateService.globalState$().pipe(
      map( () => this.getSliceSnapshot( slice ) ),
      distinctUntilChanged(),
    )
  }

  /**
   * used to update a specific slice of state and then push an update trough the application
   * @param slice
   * @param state
   * @param mergeWithCurrentState
   */
  static setSliceOfState( slice: string, state: { [ key: string ]: any } ) {
    if ( !slice || slice.length === 0 ) {
      throw new Error( `Cannot update state as it is not clear what slice you wish to update` );
    }

    if ( !state && typeof state === 'object' ) {
      throw new Error( `Cannot update slice of state ${ slice } with ${ state } are you sure this is a Object?` );
    }

    const currentState = GlobalStateService.snapshot;
    GlobalStateService.setState( { ...currentState, [ slice ]: state } );
  }

  static getSliceSnapshot( slice: string ) {
    return GlobalStateService.snapshot[ slice ];
  }

  /**
   * used to delete a specific slice in the state. use this to clean up a part of state after the information is not needed anymore.
   * @param slice
   */
  static deleteSlice( slice: string ) {
    const globalState = GlobalStateService.snapshot;
    delete globalState[ slice ];
    GlobalStateService.setState( globalState, false );
  }

}

( window as any ).__STATE = GlobalStateService;

