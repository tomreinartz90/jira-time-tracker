import {Component, OnInit} from '@angular/core';
import {SimplicateService} from '../../../providers/simplicate.service';
import {DateUtil} from '../../../utils/date.util';
import {mergeMap, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-timetracking',
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
    this.simplicate.onUpdateHour.pipe(
      startWith(true),
      mergeMap(() => (this.simplicate.getCurrentEmployeeHours(new Date())))
    ).subscribe(resp => {
        this.hours = resp;
        this.groupedHours = DateUtil.groupByDateDay(resp, (item) => item.start_date);
        this.days = Object.keys(this.groupedHours).sort();
        console.log(this);
      }
    );
  }

}
