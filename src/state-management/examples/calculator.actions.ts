import { Action } from '../decorators/action.decorator';

export class CalculatorActions {
  @Action()
  static add( payload: { amount: number } ) {
  }

  @Action()
  static remove( payload: { amount: number } ) {
  }

  @Action()
  static addRemaining() {
  }

  @Action()
  static addUntil( payload: { untilAmount: number } ) {
  }
}

