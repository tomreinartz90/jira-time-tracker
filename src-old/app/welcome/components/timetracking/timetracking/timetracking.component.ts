import {Component, OnInit} from '@angular/core';
import {SimplicateService} from '../../../../services/simplicate.service';
import {DateUtil} from '../../../../utils/date.util';

@Component({
    selector: 'seed-timetracking',
    templateUrl: './timetracking.component.html',
    styleUrls: ['./timetracking.component.scss']
})
export class TimetrackingComponent implements OnInit {
    groupedHours: any;
    hours: any;
    days: string[];

    constructor(private simplicate: SimplicateService) {
    }

    ngOnInit() {
        this.getEmployeeHours();
    }

    getEmployeeHours() {
        this.simplicate.getCurrentEmployeeHours(new Date(), new Date()).subscribe(resp => {
                this.hours = resp;
                this.groupedHours = DateUtil.groupByDateDay(resp, (item) => item.start_date);
                this.days = Object.keys(this.groupedHours).sort();
                console.log(this);
            }
        );
    }

}
