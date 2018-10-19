import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDetailsSheetComponent } from './time-details-sheet.component';

describe('TimeDetailsSheetComponent', () => {
  let component: TimeDetailsSheetComponent;
  let fixture: ComponentFixture<TimeDetailsSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeDetailsSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeDetailsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
