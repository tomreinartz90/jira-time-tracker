import {ControlValueAccessor, FormControl} from '@angular/forms';

export abstract class BaseInput implements ControlValueAccessor {

  formControl = new FormControl();

  onChange;

  private lastState = null;


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  writeValue(obj: any): void {
    if (this.formControl.value !== obj) {
      this.formControl.setValue(obj);
    }
  }

  protected abstract _filterOptions(value: string): Array<any>

  protected abstract getName(option: any): string

  protected abstract getId(option: any): string

  handleBlur() {
    const state = this.formControl.value;
    if (state && state !== this.lastState) {
      this.lastState = state;
      const selectedOption = this._filterOptions(state).find(option => this.getName(option).toLowerCase().includes(state.toLowerCase()));
      if (selectedOption) {
        this.onChange(this.getId(selectedOption));
        this.formControl.patchValue(this.getName(selectedOption));
      }
    }
  }

}
