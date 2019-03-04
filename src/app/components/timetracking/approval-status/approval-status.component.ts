import {Component, Input} from '@angular/core';
import {JiraService} from '../../../providers/jira.service';

@Component( {
  selector: 'app-approval-status',
  templateUrl: './approval-status.component.html',
  styleUrls: ['./approval-status.component.scss']
} )
export class ApprovalStatusComponent {
  @Input()
  date: Date;

  @Input()
  approvalStatus = 'EMPTY';

  constructor( private simplicateService: JiraService ) { }

  approve() {
    this.simplicateService.submitCurrentEmployeeHours( this.date, this.date )
      .subscribe(  );
  }
}
