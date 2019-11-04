import {ActionUtil} from "../util/action.util";

export function Action( ): MethodDecorator {
  return function ( target: { actions: {} | null, [ key: string ]: any, name: string }, propertyKey: string, descriptor: PropertyDescriptor ) {
    descriptor.value = ActionUtil.createAction<any>(`${target.name}/${propertyKey}`);
    return descriptor;
  }
}



