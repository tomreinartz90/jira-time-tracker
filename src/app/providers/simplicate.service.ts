import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {filter, map, mergeMap, tap} from 'rxjs/operators';
import {HourModel} from '../domain/hour.model';
import {interval, NEVER, Observable, of, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ProjectModel} from '../domain/project.model';
import {ProjectServiceModel} from '../domain/project-service.model';

interface AuthData {
  authentication_key: string;
  authentication_secret: string;
  domain: string;
  employeeId: string;
}

@Injectable()
export class SimplicateService {

  onUpdateHour: Subject<boolean> = new Subject();
  onUpdateTimer: Subject<string> = new Subject();
  onUpdateApprovalStatus: Subject<boolean> = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.runTimer();
  }

  get employee(): { id: string } {
    return {
      id: this.authInfo.employeeId
    };
  }

  private get authInfo(): AuthData {
    const authStoreString = localStorage.getItem( 'auth' );
    if ( authStoreString ) {

      return JSON.parse( authStoreString ) as AuthData;
    }
    return { authentication_key: '', authentication_secret: '', domain: '', employeeId: '' };
  }

  private get authHeaders() {
    let headers = new HttpHeaders();
    const { authentication_key, authentication_secret } = this.authInfo;
    headers = headers.set( 'authentication-key', authentication_key );
    headers = headers.set( 'authentication-secret', authentication_secret );
    return headers;
  }

  private get<T>( path: string, params?: HttpParams ): Observable<T> {
    const { domain } = this.authInfo;

    const options = {
      params,
      headers: this.authHeaders
    };
    if ( this.authInfo.authentication_key.length ) {
      return this.http.get<T>( `https://${domain}.simplicate.nl/${path}`, options ) as Observable<T>;
    } else {
      this.router.navigate( [''] );
      return NEVER;
    }
  }

  private put( path, body ) {
    const { domain } = this.authInfo;

    const options = {
      headers: this.authHeaders
    };

    return this.http.put( `https://${domain}.simplicate.nl/${path}`, body, options );
  }

  private delete( path ) {
    const { domain } = this.authInfo;

    const options = {
      headers: this.authHeaders
    };

    return this.http.delete( `https://${domain}.simplicate.nl/${path}`, options );
  }

  private post( path, body ) {
    const { domain } = this.authInfo;

    const options = {
      headers: this.authHeaders
    };

    return this.http.post( `https://${domain}.simplicate.nl/${path}`, body, options );
  }

  private storeAuthData( authData: AuthData ) {
    localStorage.setItem( 'auth', JSON.stringify( authData ) );
  }

  login( domain: string, email: string, password: string ) {
    let headers = new HttpHeaders();
    headers = headers.set( 'x-from', 'de28ad8a7c5795264160cb4e86b64731' );

    return this.http.post( `https://${domain}.simplicate.nl/api/v2/users/login`, {
        'email': email,
        'password': password,
        'os': 'extension'
      },
      { headers }
    ).pipe(
      tap( ( result: any ) => {
        this.storeAuthData( { ...result.data.keys, employeeId: result.data.user.employee_id, domain } );
      } )
    );
  }

  private runTimer() {
    interval( 1000 * 30 ).pipe(
      map( () => this.getActiveTimer() ),
      filter( ( timer ) => !!timer ),
      mergeMap( ( timer ) => this.getHourById( timer ) ),
      map( ( hour ) => {
        const now = new Date();
        hour.end_date.setUTCHours( now.getHours(), now.getMinutes(), now.getSeconds() );
        return hour;
      } ),
      mergeMap( ( hour ) => this.updateEmployeeHours( hour ) ),
      tap( ( resp: any ) => this.updateActiveTimer( resp.data.id ) )
    ).subscribe();
  }


  getEmployeeInfo( employeeId = this.employee.id ) {
    let params = new HttpParams();
    params = params.set( 'offset', '0' );
    params = params.set( 'limit', '1' );
    params = params.set( 'metadata', 'count,total_count' );
    params = params.set( 'query', `\`id\` = "${employeeId}"` );
    return this.get( 'api/v2/hrm/employee', params )
      .pipe(
        map( ( resp: any ) => resp.data[0] )
      );
  }


  /**
   * get the registered hours of the current employee between a specific start and end date;
   * @param startDate
   * @param endDate
   */
  getCurrentEmployeeHours( startDate: Date, endDate: Date = new Date( startDate.getTime() + 86400000 ) ): Observable<Array<HourModel>> {
    const { id } = this.employee;
    let params = new HttpParams();
    params = params.set( 'q[employee.id]', `${id}` );
    if ( startDate ) {
      params = params.set( 'q[start_date][ge]', `${startDate.toISOString().slice( 0, 10 )}` );
      params = params.set( 'q[start_date][le]', `${endDate.toISOString().slice( 0, 10 )}` );
    }
    params = params.set( 'mode', 'day' );
    return this.get<Array<HourModel>>( `api/v2/hours/hours`, params )
      .pipe(
        map( ( resp: any ) => resp.data ),
        map( ( resp: Array<any> ) => resp.map(
          item => HourModel.fromJSON( item )
        ) )
      );
  }

  getCurrentEmployeeApprovalStatussus( startDate: Date, endDate: Date = new Date( startDate.getTime() + 86400000 ) ) {
    const { id } = this.employee;
    let params = new HttpParams();
    params = params.set( 'q[employee.id]', `${id}` );
    if ( startDate ) {
      params = params.set( 'q[date][ge]', `${startDate.toISOString().slice( 0, 10 )}` );
      params = params.set( 'q[date][le]', `${endDate.toISOString().slice( 0, 10 )}` );
    }
    params = params.set( 'mode', 'day' );
    return this.get<any>( `api/v2/hours/approval`, params ).pipe(
      map( ( resp: any ) => resp.data )
    );
  }

  submitCurrentEmployeeHours( startDate: Date, endDate: Date = new Date( startDate.getTime() ) ) {
    const postBody = {
      employee_id: this.employee.id,
      start_date: startDate.toISOString().slice( 0, 10 ),
      end_date: endDate.toISOString().slice( 0, 10 )
    };
    return this.post( 'api/v2/hours/submit', postBody ).pipe(
      tap( ( resp: any ) => this.onUpdateApprovalStatus.next( true ) )
    );
  }

  getHourById( id: string ) {
    return this.get<HourModel>( `api/v2/hours/hours/${id}` )
      .pipe(
        map( ( resp: any ) => resp.data ),
        map( ( resp: any ) => HourModel.fromJSON( resp ) )
      );
  }

  addNewEmployeeHours( item: HourModel ) {
    const update = item.toUpdateJSON();
    return this.post( `api/v2/hours/hours`, update ).pipe(
      tap( () => this.onUpdateHour.next( true ) )
    );
  }

  updateEmployeeHours( item: HourModel ) {
    const update = item.toUpdateJSON();
    return this.put( `api/v2/hours/hours/${item.id}`, update ).pipe(
      tap( () => this.onUpdateHour.next( true ) )
    );
  }

  deleteEmployeeHours( id: string ) {
    return this.delete( `api/v2/hours/hours/${id}` ).pipe(
      tap( () => this.onUpdateHour.next( true ) )
    );
  }

  getEmployeeProjects( employeeId: string = this.employee.id ) {
    let params = new HttpParams();
    params = params.set( 'q[employee_id]', employeeId );
    params = params.set( 'q[mileage]', new Date().toISOString() );
    return this.get<Array<ProjectModel>>( 'api/v2/hours/projects', params ).pipe(
      map( ( resp: any ) => resp.data ),
      map( ( projects: Array<any> ) => projects.map( project => ProjectModel.fromJSON( project ) ) )
    );
  }

  getProjectSerices( projectId: string, startDate:Date = new Date() ) {
    let params = new HttpParams();
    params = params.set( 'q[project_id]', projectId );
    params = params.set( 'q[mileage]', '0' );
    params = params.set( 'q[start_date]', startDate.toISOString() );

    if ( !projectId ) {
      return of( [] );
    }

    return this.get<Array<ProjectServiceModel>>( 'api/v2/hours/projectservices', params ).pipe(
      map( ( resp: any ) => resp.data ),
      map( ( services: Array<any> ) => services.map( project => ProjectServiceModel.fromJSON( project ) ) )
    );
  }

  getServiceDetails( serviceId: string ) {
    return this.get( `api/v2/projects/service/${serviceId}` ).pipe(
      map( ( resp: any ) => resp.data )
    );
  }

  getActiveTimer() {
    return localStorage.getItem( 'timer' );
  }

  setActiveTimer( timer: HourModel ) {
    return this.addNewEmployeeHours( timer ).pipe(
      tap( ( resp: any ) => {
        this.updateActiveTimer( resp.data.id );
      } )
    );
  }

  updateActiveTimer( timerId: string ) {
    if ( timerId ) {
      localStorage.setItem( 'timer', timerId );
    } else {
      localStorage.removeItem( 'timer' );
    }

    this.onUpdateTimer.next( timerId );
  }

  clearTimer() {
    this.updateActiveTimer( null );
  }
}
