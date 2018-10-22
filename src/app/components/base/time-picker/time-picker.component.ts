import {Component, forwardRef, Input, OnChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DateUtil} from '../../../utils/date.util';
import {BaseInput} from '../base-input/base-input';

@Component( {
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef( () => TimePickerComponent ),
    multi: true
  }]
} )
export class TimePickerComponent extends BaseInput implements OnChanges, ControlValueAccessor {


  @Input()
  placeholder: string;

  @Input()
  public timeDate: Date = new Date();

  options: Array<{ value: string, date: Date }> = [];

  @Input()
  public minDate: Date;

  @Input()
  public maxDate: Date;

  writeValue( obj: Date ): void {
    this.timeDate = obj;
    super.writeValue( DateUtil.getTimeForInput( obj ) );
  }

  ngOnChanges() {
    //todo: handle change
  }

  protected getId( option: any ): string {
    return '';
  }

  protected getName( option: any ): string {
    return '';
  }

  handleBlur() {
    const timeDate = DateUtil.timeStringToDate( this.formControl.value, this.timeDate ) || this.timeDate;
    super.writeValue( DateUtil.getTimeForInput( timeDate ) );
    this.onChange( timeDate );
  }


}
