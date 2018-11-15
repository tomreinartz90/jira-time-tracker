import {Component, forwardRef, Input, OnChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SimplicateService} from '../../../providers/simplicate.service';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ProjectServiceModel} from '../../../domain/project-service.model';
import {BaseSelect} from '../base-input/base-select';
import {sortBy} from 'lodash';

@Component( {
  selector: 'app-project-service-select',
  templateUrl: './project-service-select.component.html',
  styleUrls: ['./project-service-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef( () => ProjectServiceSelectComponent ),
    multi: true
  }]
} )
export class ProjectServiceSelectComponent extends BaseSelect implements OnChanges {

  filteredServices: Observable<Array<ProjectServiceModel>>;

  services: Array<ProjectServiceModel> = [];

  private selectedServiceId: string;

  @Input()
  projectId: string;

  @Input()
  startDate: Date;

  constructor( private simplicateService: SimplicateService ) {
    super();

    this.filteredServices = this.formControl.valueChanges
      .pipe(
        startWith( '' ),
        map( state => this._filterOptions( this.valueChangedSinceFocus ? state : null ) )
      );
  }

  ngOnChanges() {
    this.subs.push(
      this.simplicateService.getProjectSerices( this.projectId, this.startDate ).subscribe( services => {
        this.services = sortBy( services, ( proj ) => proj.cleanName );
        this.writeValue( this.selectedServiceId );
      } )
    );
  }

  protected _filterOptions( value: string ): Array<ProjectServiceModel> {
    if ( value ) {
      return this.services.filter( options => options.cleanName.toLowerCase().includes( value.toLowerCase() ) );
    }
    return this.services;
  }

  protected getId( option: ProjectServiceModel ): string {
    return option.id;
  }

  protected getName( option: ProjectServiceModel ): string {
    return option.cleanName;
  }

  writeValue( obj: any ): void {
    if ( this.services.length ) {
      const service = this.services.find( ser => ser.id === obj );
      super.writeValue( service && service.cleanName );
    } else {
      this.selectedServiceId = obj;
      super.writeValue( null );
    }
  }

}
