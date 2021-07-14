import { StoreAware } from '../decorators/store-aware.decorator';
import { CalculatorService, CalculatorState } from './calculator.service';
import { Directive } from "@angular/core";

@Directive()
@StoreAware()
export class CalculatorComponent {
  state: CalculatorState;

  constructor(private calculator: CalculatorService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
