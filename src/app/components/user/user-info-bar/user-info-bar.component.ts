import { Component, OnInit } from '@angular/core';
import { SimplicateService } from '../../../providers/simplicate.service';

@Component( {
  selector: 'app-user-info-bar',
  templateUrl: './user-info-bar.component.html',
  styleUrls: ['./user-info-bar.component.scss']
} )
export class UserInfoBarComponent implements OnInit {
  public employee: any;

  constructor( private simplicate: SimplicateService ) {
  }

  ngOnInit() {
    this.simplicate.getEmployeeInfo().subscribe( employee => {
      this.employee = employee;
    } );
  }

}
