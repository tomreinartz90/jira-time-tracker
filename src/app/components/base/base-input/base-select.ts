import { BaseInput } from './base-input';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export abstract class BaseSelect extends BaseInput implements OnDestroy {

  subs: Array<Subscription> = [];

  protected valueChangedSinceFocus = false;

  protected abstract _filterOptions( value: string ): Array<any>;

  protected abstract getName( option: any ): string;

  protected abstract getId( option: any ): string;


  protected constructor() {
    super();
    this.subs.push(
      this.formControl.valueChanges.subscribe( val => {
        this.valueChangedSinceFocus = this.formControl.dirty;
      } )
    );
  }

  ngOnDestroy() {
    this.subs.forEach( sub => {
      sub.unsubscribe();
    } );
  }

  private updateSelectedOption( selectedOption: any ) {
    if ( selectedOption ) {
      this.onChange( this.getId( selectedOption ) );
      this.formControl.patchValue( this.getName( selectedOption ) );
    } else {
      this.onChange( null );
      this.formControl.patchValue( '' );
    }
  }

  handleBlur() {
    this.valueChangedSinceFocus = false;
    const state = this.formControl.value;
    if ( state ) {
      const selectedOption = this._filterOptions( state )[0];
      this.updateSelectedOption( selectedOption );
    } else {
      this.updateSelectedOption( this._filterOptions( null )[0] );
    }
    this.formControl.markAsPristine();
  }
}
