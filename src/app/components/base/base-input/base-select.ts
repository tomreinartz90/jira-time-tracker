import { BaseInput } from './base-input';

export abstract class BaseSelect extends BaseInput {

  private lastState = null;

  protected abstract _filterOptions( value: string ): Array<any>

  protected abstract getName( option: any ): string

  protected abstract getId( option: any ): string


  handleBlur() {
    const state = this.formControl.value;
    if ( state && state !== this.lastState ) {
      this.lastState = state;
      const selectedOption = this._filterOptions( state ).find( option => this.getName( option ).toLowerCase().includes( state.toLowerCase() ) );
      if ( selectedOption ) {
        this.onChange( this.getId( selectedOption ) );
        this.formControl.patchValue( this.getName( selectedOption ) );
      }
    }
  }
}
