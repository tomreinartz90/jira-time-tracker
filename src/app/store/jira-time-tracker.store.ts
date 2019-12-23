import { ActionUtil, Effect, Reducer, StoreService } from '../../state-management';
import { IssueI } from '../domain/jira/issue.model';
import { WorkLogModel } from '../domain/jira/work-log.model';
import { JiraService } from '../providers/jira.service';
import { takeUntil, tap } from 'rxjs/operators';
import { JiraTimeTrackerActions } from './jira-time-tracker.actions';
import { Inject } from '@angular/core';

export interface JiraTimeTrackerState {
  issues: { issueKey: string, issue: IssueI, logs: WorkLogModel[], totalTimeSpendSeconds: number }[];
  activeDate: Date;
  loadingIssues: boolean;
  addWorkingHours: boolean;
}

@Inject( '' )
export class JiraTimeTrackerStore extends StoreService<JiraTimeTrackerState> {

  static initialState: JiraTimeTrackerState = {
    activeDate: new Date(),
    issues: [],
    loadingIssues: false,
    addWorkingHours: false,
  };

  constructor( protected jiraService: JiraService ) {
    super( JiraTimeTrackerStore.initialState );
  }

  @Reducer( JiraTimeTrackerActions.changeDate )
  onChangeDate( activeDate: Date, state: JiraTimeTrackerState ) {
    return {
      ...state,
      activeDate,
      issues: [],
      loadingIssues: true
    };
  }

  @Reducer( JiraTimeTrackerActions.updateIssues )
  updateIssues( issues: JiraTimeTrackerState['issues'], state: JiraTimeTrackerState ) {
    return {
      ...state,
      issues,
      loadingIssues: false,
    };
  }

  @Reducer( JiraTimeTrackerActions.addWorkingHours )
  setAddWorkingHours( addWorkingHours: boolean, state: JiraTimeTrackerState ) {
    return {
      ...state,
      addWorkingHours
    };
  }


  @Effect( JiraTimeTrackerActions.refreshIssues )
  @Effect( JiraTimeTrackerActions.changeDate )
  refreshWorkLog( payload: any, state: JiraTimeTrackerState ) {
    return this.jiraService.getCurrentEmployeeHours( state.activeDate )
      .pipe(
        takeUntil( ActionUtil.onFirstAction$(
          JiraTimeTrackerActions.refreshIssues,
          JiraTimeTrackerActions.changeDate
        ) ),
        tap( ( issues ) => JiraTimeTrackerActions.updateIssues( issues ) )
      );
  }
}
