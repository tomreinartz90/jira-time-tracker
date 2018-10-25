import { Directive, HostListener } from '@angular/core';

@Directive( {
  selector: '[appSelectOnFocus]'
} )
export class SelectOnFocusDirective {

  constructor() { }

  @HostListener( 'focus', ['$event'] )
  onFocus( event: FocusEvent ) {
    console.log( event );
    (<any>event.currentTarget).select();
  }

}
