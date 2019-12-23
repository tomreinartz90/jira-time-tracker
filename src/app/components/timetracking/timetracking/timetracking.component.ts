import { Component, HostBinding } from '@angular/core';
import { JiraTimeTrackerActions } from '../../../store/jira-time-tracker.actions';
import { JiraTimeTrackerSelectors } from '../../../store/jira-time-tracker.selectors';
import { JiraTimeTrackerState, JiraTimeTrackerStore } from '../../../store/jira-time-tracker.store';
import { StoreAware, StoreAwareComponent } from '../../../../state-management';

@Component( {
  selector: 'app-timetracking',
  templateUrl: './timetracking.component.html',
  styleUrls: [ './timetracking.component.scss' ]
} )
@StoreAware()
export class TimetrackingComponent extends StoreAwareComponent {
  loading: boolean;

  @HostBinding( 'class.active' )
  active = true;

  state: JiraTimeTrackerState;

  constructor( protected store: JiraTimeTrackerStore,  ) {
    super();
  }

  ngOnInit() {
    this.setActiveDate( new Date() );
  }

  get totalTimeSpend() {
    return JiraTimeTrackerSelectors.totalTimeSpend( this.state );
  }

  get issues() {
    return this.state.issues;
  }

  get showWorkLogForm() {
    return this.state.addWorkingHours;
  }

  get activeDate() {
    return this.state.activeDate;
  }

  setActiveDate( date: Date ) {
    JiraTimeTrackerActions.changeDate( date );
  }

  showAddHours( show: boolean ) {
    JiraTimeTrackerActions.addWorkingHours( show );
  }

  refresh() {
    JiraTimeTrackerActions.refreshIssues();
  }



}
