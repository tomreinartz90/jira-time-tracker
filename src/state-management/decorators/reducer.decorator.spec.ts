import { Reducer } from "./reducer.decorator";
import { ActionUtil } from "../util/action.util";

describe( 'Reducer decorator', () => {
  const action:any = ActionUtil.createAction('TEST__REDUCER__ACTION');

  it( 'Should add the name of the method to a actionHandlers property on the class it is used in.', ( ) => {
    class TestClass {
      @Reducer(action)
      testFn() {
      }
    }
    const testClass:any = new TestClass();
    expect(testClass.actionHandlers).toEqual({[action.ACTION_TYPE]: 'testFn'})
  } );

  it( 'Should throw when using the same action in multiple reducers', ( ) => {
    const create = () => {
      class TestClass {
        @Reducer(action)
        testFn() {
        }

        @Reducer(action)
        testFn2() {
        }
      }
      return new TestClass();
    };

    expect(create).toThrow();
  } )
} )
