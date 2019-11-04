import { JiraTimeTrackerState } from "./jira-time-tracker.store";

export class JiraTimeTrackerSelectors {
  static totalTimeSpend( state: JiraTimeTrackerState ) {
    if ( state.issues ) {
      return state.issues.reduce( ( previousValue, currentValue ) => previousValue + currentValue.totalTimeSpendSeconds, 0 )
    }
    return 0;
  }
}