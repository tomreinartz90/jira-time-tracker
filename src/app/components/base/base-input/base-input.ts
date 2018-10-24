import { ControlValueAccessor, FormControl } from '@angular/forms';

export abstract class BaseInput implements ControlValueAccessor {

  formControl = new FormControl();

  onChange: Function;

  registerOnChange( fn: Function ): void {
    this.onChange = fn;
  }

  registerOnTouched( fn: any ): void {
  }

  setDisabledState( isDisabled: boolean ): void {
    if ( isDisabled ) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  writeValue( obj: any ): void {
    if ( this.formControl.value !== obj ) {
      this.formControl.setValue( obj );
    }
  }

}
