import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, tap } from 'rxjs/operators';
import { combineLatest, NEVER, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MyselfI } from '../domain/jira/myself.interface';
import * as moment from 'moment';
import { WorkLogModel } from '../domain/jira/work-log.model';
import { IssueSearchResultModel } from '../domain/jira/issue-search-result.model';
import { FilterModel } from '../domain/jira/filter.model';
import { IssueI } from '../domain/jira/issue.model';

interface AuthData {
  authentication: string;
  domain: string;
  user: MyselfI | null;
}

@Injectable()
export class JiraService {

  get employee(): MyselfI {
    return this.authInfo.user;
  }

  get employeeKey(): string {
    return this.employee ? this.employee.key : 'undefined';
  }

  private get authInfo(): AuthData {
    const authStoreString = localStorage.getItem( 'auth' );
    if( authStoreString ) {
      return JSON.parse( authStoreString ) as AuthData;
    }
    return { authentication: '', domain: '', user: null };
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  login( domain, username: string, password: string ) {
    const authentication = this.createUsernamePasswordHash( `${username}:${password}` );
    return this.http.get( `${domain}/rest/api/2/search?jql=key = MXT-1440`, {
      headers: this.authHeaders( authentication )
    } )
      .pipe(
        tap( ( user: MyselfI ) => this.storeAuthData( {
            authentication,
            domain,
            user
          } )
        ) )
      .pipe(
        mergeMap( () => this.getEmployeeInfo() )
      );
  }

  getEmployeeInfo() {
    return this.get( `myself` ).pipe(
      tap( ( user: MyselfI ) => {
        this.storeAuthData( {
          ...this.authInfo,
          user
        } );
      } )
    );
  }

  getCurrentEmployeeHours( date: Date ): Observable<Array<{ issueKey: string, issue: IssueI, logs: Array<WorkLogModel>, totalTimeSpendSeconds: number }>> {
    return this.getIssuesByJql( `worklogDate = ${moment( date ).format( 'YYYY-MM-DD' )} and worklogAuthor = currentUser()` )
      .pipe(
        map( ( result: { issues: Array<{ key: string }> } ) => result.issues )
      ).pipe(
        mergeMap(
          ( keys: Array<any> ) => {
            return combineLatest( keys.map( issue => {
              return this.getIssueWorkLog( issue.key, date ).pipe(
                map( ( resp: any ) => resp.worklogs ),
                map( ( worklogs: Array<any> ) => worklogs.filter( worklog => worklog.author.key === this.employeeKey ) ),
                map( ownLogs => ownLogs.filter( worklog => moment( worklog.started ).isSame( date, 'day' ) ) ),
                map( ( logs: Array<{ timeSpent: string, timeSpentSeconds: number }> ) => ({
                  issueKey: issue.key,
                  issue,
                  logs,
                  totalTimeSpendSeconds: logs.reduce( ( previousValue, currentValue ) => previousValue + currentValue.timeSpentSeconds, 0 )
                }) )
              );
            } ) );
          }
        )
      );
  }


  logWork( ticket: string, workLogModel: WorkLogModel ): Observable<any> {
    if( workLogModel.started ) {
      workLogModel.started = workLogModel.started.replace( 'Z', '+0000' );
    }
    return this.post( `issue/${ticket}/worklog?adjustEstimate=auto`, workLogModel );
  }

  removeWorkLog( issue: string, log: WorkLogModel ) {
    return this.delete( `issue/${issue}/worklog/${log.id}?adjustEstimate=auto` );
  }


  getIssuesByFilterId( filterId: number ): Observable<IssueSearchResultModel> {
    return this.getFilterById( filterId ).pipe( mergeMap( filter => this.getIssuesByJql( filter.jql ) ) );
  }

  getIssuesByJql( jql: string ): Observable<IssueSearchResultModel> {
    return this.get<IssueSearchResultModel>( `search?jql=${jql}` );
  }

  getLogsByDate( date: Date ): Observable<Array<{ key: string, issue: IssueI, workLogs: Array<WorkLogModel>, totalTimeSpendSeconds: number }>> {
    const employee = this.employee.key;
    const dateStr = date.toISOString().slice( 0, 10 );
    return this.get<IssueSearchResultModel>( `timesheet/user?startDate=${dateStr}&endDate=${dateStr}&targetKey=${employee}`,
      undefined,
      '/rest/com.deniz.jira.worklog/1.0/' ).pipe( map( ( resp: any ) => {
      const { projects } = resp;
      return projects
        .reduce( ( acc, curr ) => [ ...acc, ...curr.issues ], [] )
        .map( issue => {
          return {
            ...issue,
            totalTimeSpendSeconds: issue.workLogs.reduce( ( acc, curr ) => acc + curr.timeSpent, 0 )
          };
        } )
        .filter( issue => issue.totalTimeSpendSeconds > 0 );
    } ) );
  }

  getIssuesByKeys( ticketKeys: Array<string> ): Observable<IssueSearchResultModel> {
    return this.getIssuesByJql( `key in (${ticketKeys.map( key => `"${key}"` ).join( ',' )})` );
  }

  getFilterById( filterId: number ): Observable<FilterModel> {
    return this.get<FilterModel>( `filter/${filterId}` );
  }

  getFavoriteFilters() {
    return this.get<Array<FilterModel>>( `filter/favourite` );
  }

  getIssueWorkLog( issueId: string, date: Date ) {
    return this.get( `issue/${issueId}/worklog?startedAfter=${moment( date ).startOf( 'day' ).format( 'x' )}` );
  }


  private authHeaders( authentication = this.authInfo.authentication ) {
    let headers = new HttpHeaders();
    headers = headers.set( 'Authorization', `Basic ${authentication}` );
    return headers;
  }

  private get<T>( path: string, params?: HttpParams, basePath: string = '/rest/api/2/' ): Observable<T> {
    const { domain } = this.authInfo;

    const options = {
      params,
      headers: this.authHeaders()
    };
    if( this.authInfo.authentication.length ) {
      return this.http.get<T>( `${domain}${basePath}${path}`, options ) as Observable<T>;
    } else {
      this.router.navigate( [ '' ] );
      return NEVER;
    }
  }

  private put( path, body ) {
    const { domain } = this.authInfo;

    const options = {
      headers: this.authHeaders()
    };

    return this.http.put( `${domain}/rest/api/2/${path}`, body, options );
  }

  private delete( path ) {
    const { domain } = this.authInfo;

    const options = {
      headers: this.authHeaders()
    };

    return this.http.delete( `${domain}/rest/api/2/${path}`, options );
  }

  private post( path, body ) {
    const { domain } = this.authInfo;
    const headers = this.authHeaders();
    headers.append( 'X-Atlassian-Token', 'nocheck' );
    headers.append( 'Origin', 'localhost' );

    const options = {
      headers
    };

    return this.http.post( `${domain}/rest/api/2/${path}`, body, options );
  }

  private storeAuthData( authData: AuthData ) {
    localStorage.setItem( 'auth', JSON.stringify( authData ) );
  }


  private createUsernamePasswordHash( str: string ) {
    return btoa( encodeURIComponent( str ).replace( /%([0-9A-F]{2})/g,
      function toSolidBytes( match, p1 ) {
        return String.fromCharCode( Number( '0x' + p1 ) );
      } ) );
  }

}
