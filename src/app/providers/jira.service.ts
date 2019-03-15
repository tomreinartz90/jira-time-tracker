import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {combineAll, mergeMap, tap, map} from 'rxjs/operators';
import {NEVER, Observable, combineLatest} from 'rxjs';
import {Router} from '@angular/router';
import {MyselfI} from '../domain/jira/myself.interface';
import {promise} from 'selenium-webdriver';
import * as moment from 'moment';
import {WorkLogModel} from "../domain/jira/work-log.model";
import {IssueSearchResultModel} from "../domain/jira/issue-search-result.model";
import {FilterModel} from "../domain/jira/filter.model";
import {IssueI} from "../domain/jira/issue.model";

interface AuthData {
  authentication: string;
  domain: string;
  user: MyselfI | null;
}

@Injectable()
export class JiraService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  get employee(): MyselfI {
    return this.authInfo.user;
  }

  get employeeKey(): string {
    return this.employee ? this.employee.key : 'undefined';
  }

  private get authInfo(): AuthData {
    const authStoreString = localStorage.getItem('auth');
    if (authStoreString) {
      return JSON.parse(authStoreString) as AuthData;
    }
    return {authentication: '', domain: '', user: null};
  }

  private authHeaders(authentication = this.authInfo.authentication) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Basic ${authentication}`);
    return headers;
  }

  private get<T>(path: string, params?: HttpParams): Observable<T> {
    const {domain} = this.authInfo;

    const options = {
      params,
      headers: this.authHeaders()
    };
    if (this.authInfo.authentication.length) {
      return this.http.get<T>(`${domain}/rest/api/2/${path}`, options) as Observable<T>;
    } else {
      this.router.navigate(['']);
      return NEVER;
    }
  }

  private put(path, body) {
    const {domain} = this.authInfo;

    const options = {
      headers: this.authHeaders()
    };

    return this.http.put(`https://${domain}/rest/api/2/${path}`, body, options);
  }

  private delete(path) {
    const {domain} = this.authInfo;

    const options = {
      headers: this.authHeaders()
    };

    return this.http.delete(`https://${domain}/rest/api/2/${path}`, options);
  }

  private post(path, body) {
    const {domain} = this.authInfo;
    const headers = this.authHeaders();
    headers.append('X-Atlassian-Token', 'nocheck');
    headers.append('Origin', 'localhost');

    const options = {
      headers
    };

    return this.http.post(`${domain}/rest/api/2/${path}`, body, options);
  }

  private storeAuthData(authData: AuthData) {
    localStorage.setItem('auth', JSON.stringify(authData));
  }

  login(domain, username: string, password: string) {
    let authentication = this.createUsernamePasswordHash(`${username}:${password}`);
    return this.http.get(`${domain}/rest/api/2/search?jql=key = MXT-1440`, {
      headers: this.authHeaders(authentication)
    })
      .pipe(
        tap((user: MyselfI) => this.storeAuthData({
            authentication,
            domain,
            user: user
          })
        ))
      .pipe(
        mergeMap(() => this.getEmployeeInfo())
      );
  }

  getEmployeeInfo() {
    return this.get(`myself`).pipe(
      tap((user: MyselfI) => {
        this.storeAuthData({
          ...this.authInfo,
          user
        });
      })
    );
  }

  getCurrentEmployeeHours(date: Date): Observable<Array<{ issueKey: string, issue: IssueI, logs: WorkLogModel[], totalTimeSpendSeconds: number }>> {
    return this.getIssuesByJql(`worklogDate = ${moment(date).format('YYYY-MM-DD')} and worklogAuthor = currentUser()`)
      .pipe(
        map((result: { issues: Array<{ key: string }> }) => result.issues)
      ).pipe(
        mergeMap(
          (keys: Array<any>) => {
            return combineLatest(keys.map(issue => {
              return this.getIssueWorkLog(issue.key).pipe(
                map((resp: any) => resp.worklogs),
                map((worklogs: any[]) => worklogs.filter(worklog => worklog.author.key === this.employeeKey)),
                map(ownLogs => ownLogs.filter(worklog => moment(worklog.started).isSame(date, 'day'))),
                map((logs: { timeSpent: string, timeSpentSeconds: number }[]) => ({
                  issueKey: issue.key,
                  issue: issue,
                  logs: logs,
                  totalTimeSpendSeconds: logs.reduce((previousValue, currentValue) => previousValue + currentValue.timeSpentSeconds, 0)
                }))
              );
            }));
          }
        )
      );
  }


  logWork(ticket: string, workLogModel: WorkLogModel): Observable<any> {
    if(workLogModel.started){
      workLogModel.started = workLogModel.started.replace('Z', '+0000');
    }
    return this.post(`issue/${ticket}/worklog?adjustEstimate=auto`, workLogModel);
  }

  getIssuesByFilterId(filterId: number): Observable<IssueSearchResultModel> {
    return this.getFilterById(filterId).pipe(mergeMap(filter => this.getIssuesByJql(filter.jql)));
  }

  getIssuesByJql(jql: string): Observable<IssueSearchResultModel> {
    return this.get<IssueSearchResultModel>(`search?jql=${jql}`);
  }

  getIssuesByKeys(ticketKeys: Array<string>): Observable<IssueSearchResultModel> {
    return this.getIssuesByJql(`key in (${ticketKeys.map(key => `"${key}"`).join(',')})`);
  }

  getFilterById(filterId: number): Observable<FilterModel> {
    return this.get<FilterModel>(`filter/${filterId}`);
  }

  getIssueWorkLog(issueId: string) {
    return this.get(`issue/${issueId}/worklog`);
  }


  private createUsernamePasswordHash(str: string) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(Number('0x' + p1));
      }));
  }

}
