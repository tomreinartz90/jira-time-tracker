import { Action } from "../../state-management";
import { JiraTimeTrackerState } from "./jira-time-tracker.store";

export class JiraTimeTrackerActions {
  @Action()
  static changeDate( date: Date ) {
  }

  @Action()
  static refreshIssues() {
  }

  @Action()
  static addWorkingHours( show: boolean ) {
  }

  @Action()
  static updateIssues( issues: JiraTimeTrackerState['issues'] ) {
  }
}