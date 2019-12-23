import {StoreService} from '../store.service';

export function Reducer(action: any ): MethodDecorator {
  return function ( target: StoreService<any>, propertyKey: string, descriptor: PropertyDescriptor ) {
    // register the action handler to the target (handling this action is done by the store service).
    if (target.actionHandlers && target.actionHandlers[action.ACTION_TYPE]) {
      throw new Error(`It is not possible to have multiple REDUCERS for the same action in the same service.
      action: ${action.ACTION_TYPE}, reducer: ${target.constructor.name}.${propertyKey}`);
    }

    Object.defineProperty( target, 'actionHandlers', {
        enumerable: true,
        configurable: true,
        value: {
          ...target.actionHandlers,
          [ action.ACTION_TYPE ]: propertyKey
        }
      }
    );
  };
}
