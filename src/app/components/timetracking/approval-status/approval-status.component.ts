import { Component, Input, OnChanges } from '@angular/core';
import { SimplicateService } from '../../../providers/simplicate.service';

@Component( {
  selector: 'app-approval-status',
  templateUrl: './approval-status.component.html',
  styleUrls: ['./approval-status.component.scss']
} )
export class ApprovalStatusComponent implements OnChanges {
  @Input()
  date: Date;

  status: any = null;


  loading = true;

  constructor( private simplicateService: SimplicateService ) { }

  ngOnChanges() {
    this.loading = true;
    this.simplicateService.getCurrentEmployeeApprovalStatussus( this.date, this.date )
      .subscribe( ( status ) => {
          this.status = status ? status[0] : null;
          this.loading = false;
          console.log( this );
        }
      );
  }

  approve() {
    this.simplicateService.submitCurrentEmployeeHours( this.date, this.date )
      .subscribe( () => {
        this.ngOnChanges();
      } );
  }
}
