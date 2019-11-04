import { Observable, of as observableOf } from 'rxjs';

import { mergeMap, tap } from 'rxjs/operators';
import { EffectStatus } from "../models/effect-status.model";
import { ActionUtil } from "./action.util";

export class EffectUtil {
  static withStatus<S>( obs$: () => Observable<S>, setStatus: ( status: EffectStatus ) => void ) {
    return EffectUtil.withActions( obs$,
      () => setStatus( EffectStatus.DONE ),
      () => setStatus( EffectStatus.ERROR ),
      () => setStatus( EffectStatus.PENDING )
    )
  }

  static withActions<S>( obs$: () => Observable<S>, onCompleteSuccess: ( lastPayload: S ) => void, onError: ( error: any ) => void, onStart?: () => void ): Observable<S> {
    let lastPayload: S = null;
    let emittedSuccessFully: boolean = false;
    return observableOf( null ).pipe(
      tap( () => onStart && onStart() ),
      mergeMap( obs$ ),
      tap(
        ( payload ) => {
          lastPayload = payload;
          emittedSuccessFully = true;
        },
        ( error ) => {
          emittedSuccessFully = false;
          if ( onError ) {
            onError( error )
          }
        },
        () => emittedSuccessFully && onCompleteSuccess( lastPayload )
      ), )
  }

  static withActionHandlers<S>( obs$: () => Observable<S>, actionHandlers: ReturnType<typeof ActionUtil.createActionWithSuccessAndFailure> ) {
    return EffectUtil.withStatus( () =>
        EffectUtil.withActions( obs$,
          actionHandlers.success,
          actionHandlers.error,
        ),
      actionHandlers.setStatus
    )
  }
}

