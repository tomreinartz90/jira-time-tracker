export class BaseModel<T> {
  static fromJSON( payload: any ) {
    // @ts-ignore
    const model = new this() as T;
    Object.assign( model, payload );
    return model;
  }
}
