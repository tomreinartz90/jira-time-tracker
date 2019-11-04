import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogEntryDetailsComponent } from './worklog-entry-details.component';

describe('WorklogEntryDetailsComponent', () => {
  let component: WorklogEntryDetailsComponent;
  let fixture: ComponentFixture<WorklogEntryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorklogEntryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorklogEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
