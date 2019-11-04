import { ActionService } from "../action.service";
import { EffectStatus } from "..";

let actionInstanceNum: number = 0;

export class ActionUtil {

  static onAction = ActionService.onAction;
  static onFirstAction$ = ActionService.onFirstAction$;

  static createActionWithSuccessAndFailure<START, SUCCESS>( actionType: string ) {
    return {
      start: ActionUtil.createAction<START>( `${ actionType }/start` ),
      success: ActionUtil.createAction<SUCCESS>( `${ actionType }/success` ),
      error: ActionUtil.createAction<{ error?: string } & START>( `${ actionType }/error` ),
      setStatus: ActionUtil.createAction<EffectStatus>( `${ actionType }/setStatus` )
    }
  }

  static withCRUD<MODEL>( baseActionType: string ) {
    return {
      update: ActionUtil.createActionWithSuccessAndFailure<MODEL, MODEL>( `${ baseActionType }/update` ),
      create: ActionUtil.createActionWithSuccessAndFailure<MODEL, MODEL>( `${ baseActionType }/create` ),
      delete: ActionUtil.createActionWithSuccessAndFailure<MODEL, MODEL>( `${ baseActionType }/delete` ),
      read: ActionUtil.createActionWithSuccessAndFailure<number, MODEL>( `${ baseActionType }/read` ),
    }
  }

  static createAction<T>( type: string ) {
    actionInstanceNum = actionInstanceNum + 1;
    const actionType = `${ actionInstanceNum }/${ type }`;

    const actionFunction: any = function ( payload: T ) {
      ActionService.pushAction( actionType, payload );
    };

    Object.defineProperty( actionFunction, 'ACTION_TYPE', {
      value: actionType,
      writable: false
    } );
    return actionFunction as ( payload: T ) => void;
  }
}
