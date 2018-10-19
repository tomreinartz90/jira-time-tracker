import {Component, Input} from '@angular/core';

@Component({
    selector: 'seed-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent {

    @Input()
    groupedHours: { [key: string]: Array<any> } = {};

    @Input()
    days: Array<any> = [];

    constructor() {
    }

}
