import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkLogModel } from "../../../domain/jira/work-log.model";
import { IssueI } from "../../../domain/jira/issue.model";
import { JiraService } from "../../../providers/jira.service";
import { JiraTimeTrackerActions } from "../../../store/jira-time-tracker.actions";

@Component( {
  selector: 'app-worklog-entry-details',
  templateUrl: './worklog-entry-details.component.html',
  styleUrls: [ './worklog-entry-details.component.scss' ]
} )
export class WorklogEntryDetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<WorklogEntryDetailsComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: { issueKey: string, issue: IssueI, logs: WorkLogModel[], totalTimeSpendSeconds: number },
    public jiraService: JiraService ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeLog( log: WorkLogModel ) {
    this.jiraService.removeWorkLog( this.data.issueKey, log ).subscribe( () => {
        JiraTimeTrackerActions.refreshIssues();
        this.onNoClick();
      }
    )
  }

}
