import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-button',
  templateUrl: './confirm-button.component.html',
  styleUrls: ['./confirm-button.component.scss']
})
export class ConfirmButtonComponent implements OnInit {

  @Output()
  confirm: EventEmitter<boolean> = new EventEmitter();

  clicked = 0;
  messages = ['are you sure', 'confirm'];

  constructor() {
  }

  ngOnInit() {
  }

  onClick() {
    this.clicked = this.clicked + 1;
    if (this.clicked > 2) {
      this.confirm.emit(true);
    }
  }

  onMouseLeave() {
    this.clicked = 0;
  }

  get message() {
    return this.messages[this.clicked - 1];
  }

}
