import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-weekdayselector',
  templateUrl: './weekdayselector.component.html',
  styleUrls: ['./weekdayselector.component.scss']
})
export class WeekdayselectorComponent implements OnInit {

  @Input()
  activeDate: Date;

  @Input()
  initials: string;

  @Output()
  activeDateChange = new EventEmitter<Date>();

  constructor() {
  }

  ngOnInit() {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((<any>event.target).nodeName === 'BODY') {
      const {code} = event;
      if (code === 'ArrowRight') {
        this.next();
      } else if (code === 'ArrowLeft') {
        this.prev();
      }
    }
  }

  next() {
    this.activeDateChange.emit(new Date(this.activeDate.getTime() + (60 * 60 * 24 * 1000)));
  }

  prev() {
    this.activeDateChange.emit(new Date(this.activeDate.getTime() - (60 * 60 * 24 * 1000)));
  }

  updateDate(event: Date) {
    this.activeDateChange.emit(new Date(event.getTime() - (event.getTimezoneOffset() * 60000)));
  }

}
