import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component( {
  selector: 'app-weekdayselector',
  templateUrl: './weekdayselector.component.html',
  styleUrls: ['./weekdayselector.component.scss']
} )
export class WeekdayselectorComponent implements OnInit {

  @Input()
  activeDate: Date;

  @Output()
  activeDateChange = new EventEmitter<Date>();

  constructor() {
  }

  ngOnInit() {
  }

}
