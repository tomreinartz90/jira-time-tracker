import {Headers, Http, RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable()
export class SimplicateService {

    constructor(private http: Http) {
    }

    private get employee(): { id: string } {
        return {
            id: '18d74df85341b7e06d44e34a3f0f8c3d',
        };
    }

    private get authInfo(): { authKey: string, authSecret: string, domain: string } {
        return {
            authKey: 'SnKKldwtIjjcjwlPqNKplPBXVrfqnyb6',
            authSecret: 'LLGWP3gncpqlMB12fChqhJe30kjeIkak',
            domain: 'dotcontrol'
        };
    }

    private get authHeaders() {
        const headers = new Headers();
        const {authKey, authSecret} = this.authInfo;
        headers.set('authentication-key', authKey);
        headers.set('authentication-secret', authSecret);
        return headers;
    }

    private get(path: string, params?: URLSearchParams) {
        const {domain} = this.authInfo;

        const options: RequestOptionsArgs = {
            params,
            headers: this.authHeaders
        };

        console.log(params.toString())

        return this.http.get(`https://${domain}.simplicate.nl/${path}`, options)
            .pipe(
                map((resp: any) => resp.json()
                )
            );
    }

    getCurrentEmployeeStats() {
        const params = new URLSearchParams();
        params.set('date', new Date().toISOString());
        params.set('mode', 'day');
        return this.get('hours/hours/GetCurrentEmployeeStat');
    }

    getEmployeeInfo(employeeId = this.employee.id) {
        const params = new URLSearchParams();
        params.set('offset', '0');
        params.set('limit', '1');
        params.set('metadata', 'count,total_count');
        params.set('query', `\`id\` = "employee:${employeeId}"`);
        return this.get('api/v2/hrm/employee', params)
            .pipe(
                map((resp: any) => resp.data[0])
            );
    }


    /**
     * get the registered hours of the current employee between a specific start and end date;
     * @param startDate
     * @param endDate
     */
    getCurrentEmployeeHours(startDate: Date, endDate: Date) {
        const {id} = this.employee;
        const params = new URLSearchParams();
        params.set('q[employee.id]', `employee:${id}`);
        params.set('mode', 'day');
        return this.get(`api/v2/hours/hours`, params).pipe(map((resp: any) => resp.data));
    }

    addNewEmployeeHours() {

    }

    updateEmployeeHours() {

    }

    getEmployeeProjects(employeeId: string = this.employee.id) {
        const params = new URLSearchParams();
        params.set('q[employee_id]', employeeId);
        params.set('q[mileage]', new Date().toISOString());
        return this.get('api/v2/hours/projects', params);
    }

    getProjectSerice(projectId: string) {
        const params = new URLSearchParams();
        params.set('q[project_id]', projectId);
        params.set('q[mileage]', '0');
        params.set('q[start_date]', new Date().toISOString());
        return this.get('api/v2/hours/projectservices', params);
    }

    getServiceDetails(serviceId: string) {
        const params = new URLSearchParams();
        params.set('offset', '0');
        params.set('limit', '1');
        params.set('query', `\`id\`="service:${serviceId}"`);
        params.set('metadata', 'count,total_count');
        return this.get('api/v2/projects/service', params);
    }


}
