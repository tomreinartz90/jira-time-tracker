import { skip, take } from 'rxjs/operators';
import { GlobalStateService } from "./global-state.service";

describe( 'Global state service', () => {
  beforeEach( () => {
    //clear state for every test run;
    const keys = Object.keys( GlobalStateService.snapshot );
    keys.forEach( key => {
      GlobalStateService.deleteSlice( key );
    } )
  } );

  it( 'should have a global state variable that is shared among all instances', () => {
    expect( GlobalStateService.snapshot ).toEqual( {} );
    expect( GlobalStateService.snapshot ).toEqual( GlobalStateService.snapshot );
  } );

  it( 'Should throw when trying to set state without an object', () => {
    // @ts-ignore
    expect( () => GlobalStateService.setState( null ) ).toThrow();
    expect( () => GlobalStateService.setState( 2 as any ) ).toThrow();
    expect( () => GlobalStateService.setState( false as any ) ).toThrow();
    expect( () => GlobalStateService.setState( true as any ) ).toThrow();
    expect( () => GlobalStateService.setState( 'TEST' as any ) ).toThrow();
  } );


  it( 'Should have the option to update the global state with an object', ( done ) => {
    const testState = { 'TEST': { key: 'value' } };
    GlobalStateService.setState( testState );
    GlobalStateService.globalState$().pipe( take( 1 ) ).subscribe( state => {
      expect( state ).toEqual( testState );
      done();
    } )
  } );

  it( 'Should have the option to update a specific slice of state with an object', ( done ) => {
    const testState = { key: 'value' };
    GlobalStateService.setSliceOfState( 'TEST2', testState );
    GlobalStateService.sliceOfState$( 'TEST2' ).pipe( take( 1 ) ).subscribe( state => {
      expect( state ).toEqual( testState );
      done();
    } )
  } );

  it( 'Should contain the current state of a slice when you first subscribe to the store', () => {
    const testState = { key: 'value' };
    GlobalStateService.setSliceOfState( 'TEST2', testState );

    GlobalStateService.sliceOfState$( 'TEST2' ).pipe( take( 1 ) ).subscribe( state => {
      expect( state ).toEqual( testState )
    } )
  } );

  it( 'Should be able to delete a specific slice of the state', (done) => {
    const testState = { 'TEST': { key: 'value' } };
    GlobalStateService.setSliceOfState( 'TEST', { key: 'value' } );
    GlobalStateService.setSliceOfState( 'TEST2', testState );

    GlobalStateService.globalState$().pipe( skip( 1 ), take( 1 ), ).subscribe( state => {
      expect( state ).toEqual( testState );
      done();
    } );

    GlobalStateService.deleteSlice( 'TEST2' );
  } )

} );

