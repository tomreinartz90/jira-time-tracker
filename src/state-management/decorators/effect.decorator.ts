import { StoreService } from '../store.service';

export function Effect( action: any ): MethodDecorator {
  return function ( target: StoreService<any>, propertyKey: string, descriptor: PropertyDescriptor ) {
    // register the action handler to the target (handling this action is done by the store service).
    if ( target.effectHandlers && target.effectHandlers[ action.ACTION_TYPE ] ) {
      target.effectHandlers[ action.ACTION_TYPE ].push(propertyKey);
    } else {
      // register the action handler to the target (handling this action is done by the store service).
      Object.defineProperty( target, 'effectHandlers', {
          enumerable: true,
          configurable: true,
          value: {
            ...target.effectHandlers,
            [ action.ACTION_TYPE ]: [ propertyKey ]
          }
        }
      );
    }
  };
}
