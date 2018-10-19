import {Component, forwardRef, Input, OnChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import {DateUtil} from '../../../utils/date.util';
import {BaseInput} from '../base-input/base-input';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true,
  }]
})
export class TimePickerComponent extends BaseInput implements OnChanges, ControlValueAccessor {

  filteredTimes: Observable<Array<{ value: string, date: Date }>>;

  @Input()
  placeholder: string;

  @Input()
  timeDate: Date = new Date();

  options: Array<{ value: string, date: Date }> = [];

  @Input()
  minDate: Date;

  @Input()
  maxDate: Date;

  constructor() {
    super();
    this.filteredTimes = this.formControl.valueChanges
      .pipe(
        startWith(''),
        tap(state => {
          const selectedOption = this._filterOptions(state).find(option => option.value === state)
          if (selectedOption) {
            this.onChange(selectedOption.date);
          }
        }),
        map(state => state ? this._filterOptions(state) : this.options.slice()),
      );
  }

  ngOnChanges() {
    this.createOptions();
  }

  createOptions() {
    const hours = Array.from(Array(24).keys());
    const minuteParts = Array.from(Array(12).keys());
    const options = [];
    hours.forEach(hour => {
      minuteParts.forEach(part => {
        const _minutes = part * 5;
        const _hour = hour + 1;
        const datePart = new Date();
        datePart.setHours(_hour);
        datePart.setMinutes(_minutes);
        datePart.setSeconds(0);
        options.push({date: datePart, value: `${_hour < 10 ? '0' : ''}${_hour}:${_minutes < 10 ? '0' : ''}${_minutes}`});
      });
    });
    // todo: add filters for min and max date;
    this.options = options;
  }


  protected _filterOptions(value: string): Array<{ value: string, date: Date }> {
    // remove leading 0 when searching;
    const filterValue = value.startsWith('0') ? value.slice(1) : value;
    const removeSpecialChars = (val: string) => (val.replace(/\D/g, ''));
    return this.options.filter(options => removeSpecialChars(options.value).includes(removeSpecialChars(filterValue)));
  }


  writeValue(obj: Date): void {
    this.timeDate = obj;
    super.writeValue(DateUtil.getTimeForInput(obj));
  }

  protected getId(option: any): string {
    return '';
  }

  protected getName(option: any): string {
    return '';
  }


}
