import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectServiceSelectComponent } from './project-service-select.component';

describe('ProjectServiceSelectComponent', () => {
  let component: ProjectServiceSelectComponent;
  let fixture: ComponentFixture<ProjectServiceSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectServiceSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectServiceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
