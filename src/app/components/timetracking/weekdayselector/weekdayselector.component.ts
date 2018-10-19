import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-weekdayselector',
    templateUrl: './weekdayselector.component.html',
    styleUrls: ['./weekdayselector.component.scss']
})
export class WeekdayselectorComponent implements OnInit {

    @Input()
    groupedHours: Array<any> = [];

    @Input()
    days: Array<any> = [];

    constructor() {
    }

    ngOnInit() {
    }

}
