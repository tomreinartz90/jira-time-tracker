import {Component, Input} from '@angular/core';
import {SimplicateService} from '../../../providers/simplicate.service';

@Component( {
  selector: 'app-approval-status',
  templateUrl: './approval-status.component.html',
  styleUrls: ['./approval-status.component.scss']
} )
export class ApprovalStatusComponent {
  @Input()
  date: Date;

  @Input()
  approvalStatus: string = 'EMPTY';

  loading = true;

  constructor( private simplicateService: SimplicateService ) { }

  approve() {
    this.simplicateService.submitCurrentEmployeeHours( this.date, this.date )
      .subscribe(  );
  }
}
