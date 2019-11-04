import { interval as observableInterval, of as observableOf } from 'rxjs';

import { mergeMap, takeWhile, tap } from 'rxjs/operators';
import { StoreService } from "../store.service";
import { CalculatorActions } from "./calculator.actions";
import { Effect, Reducer } from "../index";

export interface CalculatorState {
  currentValue: number;
}

export class CalculatorService extends StoreService<CalculatorState> {
  constructor( initialValue: number = 0 ) {
    super( { currentValue: initialValue }, 'calculator-store' )
  }

  @Reducer( CalculatorActions.add )
  onAdd( { amount = 1 } = {}, state: CalculatorState ) {
    const { currentValue } = state;
    return { currentValue: currentValue + amount }
  }

  @Reducer( CalculatorActions.remove )
  onRemove( { amount = 1 } = {}, state: CalculatorState ) {
    const { currentValue } = state;
    return { currentValue: currentValue - amount }
  }

  @Effect( CalculatorActions.addRemaining )
  onAddRemaining( payload: any, state: CalculatorState ) {
    return observableOf( null ).pipe(
      tap( () =>
        CalculatorActions.add( { amount: 10 } )
      ),
      tap( () =>
        CalculatorActions.add( { amount: 36 } )
      ), )
  }

  @Effect( CalculatorActions.addUntil )
  onAddUntil( { untilAmount = 1 } = {}, state: CalculatorState ) {
    const interval$ = observableInterval( 1 );
    return interval$.pipe(
      mergeMap( this.stateSnapshot$ ),
      takeWhile( state => {
        return state.currentValue < untilAmount
      } ),
      tap( () =>
        CalculatorActions.add( { amount: 1 } )
      ), )
  }
}
