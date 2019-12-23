
import {take} from 'rxjs/operators';
import { ActionService } from './action.service';

describe( 'Action service', () => {
  it( 'should have the option to dispatch and subscript to an action', ( done ) => {
    ActionService.onActions$().pipe(take( 1 )).subscribe( value => {
      expect( value ).toEqual( { type: 'TEST_ACTION', payload: [ 'TEST_PAYLOAD' ] } );
      done();
    } );

    ActionService.pushAction( 'TEST_ACTION', [ 'TEST_PAYLOAD' ] );
  } );

  it( 'Should have the option to subscribe only to specific action types', ( done ) => {
    ActionService.onAction( 'TEST_ACTION3' ).pipe(take( 1 )).subscribe( value => {
      expect( value.payload ).toEqual( [ 'TEST_PAYLOAD3' ] );
      done();
    } );

    ActionService.pushAction( 'TEST_ACTION1', [ 'TEST_PAYLOAD1' ] );
    ActionService.pushAction( 'TEST_ACTION2', [ 'TEST_PAYLOAD2' ] );
    ActionService.pushAction( 'TEST_ACTION3', [ 'TEST_PAYLOAD3' ] );
  } );


  it( 'When subscribing to a specific action without a type it should throw', () => {
    expect( ActionService.onAction ).toThrow();
  } );

} );

