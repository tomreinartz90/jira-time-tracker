import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableitemComponent } from './timetableitem.component';

describe('TimetableitemComponent', () => {
  let component: TimetableitemComponent;
  let fixture: ComponentFixture<TimetableitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
