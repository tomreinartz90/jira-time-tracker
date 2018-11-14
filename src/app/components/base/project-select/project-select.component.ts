import {Component, forwardRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ProjectModel} from '../../../domain/project.model';
import {map, startWith} from 'rxjs/operators';
import {SimplicateService} from '../../../providers/simplicate.service';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseSelect} from '../base-input/base-select';
import {sortBy} from 'lodash';

@Component({
  selector: 'app-project-select',
  templateUrl: './project-select.component.html',
  styleUrls: ['./project-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProjectSelectComponent),
    multi: true
  }]
})
export class ProjectSelectComponent extends BaseSelect implements OnInit {

  filteredProjects: Observable<Array<ProjectModel>>;

  projects: Array<ProjectModel> = [];

  private selectedProjectId: string;

  constructor(private simplicateService: SimplicateService) {
    super();
    this.filteredProjects = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(state => this._filterOptions(this.valueChangedSinceFocus ? state : null))
      );
  }

  ngOnInit() {
    this.subs.push(
      this.simplicateService.getEmployeeProjects().subscribe(projects => {
        this.projects = sortBy(projects, (proj) => proj.cleanName);
        this.writeValue(this.selectedProjectId);
      })
    );
  }

  protected getId(option: ProjectModel): string {
    return option.id;
  }

  protected getName(option: ProjectModel): string {
    return option.name;
  }

  protected _filterOptions(value: string): Array<ProjectModel> {
    if (value) {
      return this.projects.filter(options => options.name.toLowerCase().includes(value.toLowerCase()));
    }
    return this.projects;
  }

  updateSelectedOption(option: any) {
    this.selectedProjectId = this.getId(option);
    return super.updateSelectedOption(option);
  }

  writeValue(obj: any): void {
    if (this.projects.length) {
      const project = this.projects.find(proj => proj.id === obj);
      super.writeValue(project && project.name);
    } else {
      this.selectedProjectId = obj;
      super.writeValue(null);
    }
  }

}
