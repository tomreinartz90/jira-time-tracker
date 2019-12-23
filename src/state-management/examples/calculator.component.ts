import { StoreAware } from '../decorators/store-aware.decorator';
import { CalculatorService, CalculatorState } from './calculator.service';

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
