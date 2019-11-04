import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesBySearchComponent } from './issues-by-search.component';

describe('IssuesBySearchComponent', () => {
  let component: IssuesBySearchComponent;
  let fixture: ComponentFixture<IssuesBySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesBySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesBySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
