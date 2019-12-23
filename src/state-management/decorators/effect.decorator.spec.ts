import { ActionUtil } from '../util/action.util';
import { Effect } from './effect.decorator';

describe( 'Effect decorator', () => {
  const action: any = ActionUtil.createAction( 'TEST__REDUCER__ACTION' );

  it( 'Should add the name of the method to a effectHandlers property on the class it is used in.', () => {
    class TestClass {
      @Effect( action )
      testFn() {
      }
    }

    const testClass: any = new TestClass();
    expect( testClass.effectHandlers ).toEqual( { [ action.ACTION_TYPE ]: [ 'testFn' ] } );
  } );

  it( 'Should be able to handle the same action in multiple Effects', () => {
    const create = () => {
      class TestClass {
        @Effect( action )
        testFn() {
        }

        @Effect( action )
        testFn2() {
        }
      }

      return new TestClass();
    };

    const testClass: any = create();
    expect( create ).not.toThrow();
    expect( testClass.effectHandlers ).toEqual( { [ action.ACTION_TYPE ]: [ 'testFn', 'testFn2' ] } );

  } );
} );
