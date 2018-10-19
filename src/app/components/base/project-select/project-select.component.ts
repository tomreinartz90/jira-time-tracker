import {Component, forwardRef, OnInit} from '@angular/core';
import {BaseInput} from '../base-input/base-input';
import {Observable} from 'rxjs';
import {ProjectModel} from '../../../domain/project.model';
import {map, startWith} from 'rxjs/operators';
import {SimplicateService} from '../../../providers/simplicate.service';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

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
export class ProjectSelectComponent extends BaseInput implements OnInit {

  filteredProjects: Observable<Array<ProjectModel>>;

  projects: Array<ProjectModel> = [];

  private selectedProjectId: string;

  constructor(private simplicateService: SimplicateService) {
    super();
    this.filteredProjects = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterOptions(state) : this.projects.slice())
      );
  }

  ngOnInit() {
    this.simplicateService.getEmployeeProjects().subscribe(projects => {
      this.projects = projects;
      this.writeValue(this.selectedProjectId);
    });
  }

  protected getId(option: ProjectModel): string {
    return option.id;
  }

  protected getName(option: ProjectModel): string {
    return option.cleanName;
  }

  protected _filterOptions(value: string): Array<ProjectModel> {
    return this.projects.filter(options => options.name.toLowerCase().includes(value.toLowerCase()));
  }


  writeValue(obj: any): void {
    if (this.projects.length) {
      const project = this.projects.find(proj => proj.id === obj);
      super.writeValue(project && project.cleanName);
    } else {
      this.selectedProjectId = obj;
      super.writeValue(null);
    }
  }

}
