import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  @Input()
  startDate: Date = new Date();

  @Input()
  endDate: Date = new Date();

  constructor() { }

  ngOnInit() {
  }

}
