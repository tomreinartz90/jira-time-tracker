import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekdayselectorComponent } from './weekdayselector.component';

describe('WeekdayselectorComponent', () => {
  let component: WeekdayselectorComponent;
  let fixture: ComponentFixture<WeekdayselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekdayselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekdayselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
