import {CalculatorState} from "./calculator.service";

export class CalculatorSelectors {
  static currentValue(state: CalculatorState) {
    return state.currentValue
  }
}
