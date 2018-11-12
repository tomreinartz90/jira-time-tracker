import { BaseInput } from './base-input';
import { Subject, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { debounceTime, filter } from 'rxjs/operators';

export abstract class BaseSelect extends BaseInput implements OnDestroy {

  subs: Array<Subscription> = [];

  protected valueChangedSinceFocus = false;

  protected onBlur: Subject<string> = new Subject();

  protected abstract _filterOptions( value: string ): Array<any>;

  protected abstract getName( option: any ): string;

  protected abstract getId( option: any ): string;


  protected constructor() {
    super();
    this.subs.push(
      this.formControl.valueChanges.subscribe( val => {
        this.valueChangedSinceFocus = this.formControl.dirty;
      } ),
      this.onBlur.pipe(
        debounceTime( 100 ),
        filter( state => state === this.formControl.value )
      ).subscribe( ( state ) => this.handleSelect( state ) )
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

  handleSelect( option ) {
    const selectedOption = this._filterOptions( option )[0];
    this.updateSelectedOption( selectedOption );
  }

  handleBlur() {
    this.valueChangedSinceFocus = false;
    const state = this.formControl.value;
    this.onBlur.next( state );
    this.formControl.markAsPristine();
  }

}
