import {Component, forwardRef, Input, OnChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {SimplicateService} from '../../../providers/simplicate.service';
import {map, startWith} from 'rxjs/operators';
import {BaseInput} from '../base-input/base-input';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-service-type-select',
  templateUrl: './service-type-select.component.html',
  styleUrls: ['./service-type-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ServiceTypeSelectComponent),
    multi: true
  }]
})
export class ServiceTypeSelectComponent extends BaseInput implements OnChanges {

  filteredServices: Observable<Array<any>>;

  types: Array<any> = [];

  private selectedId: string;

  @Input()
  serviceId: string;

  constructor(private simplicateService: SimplicateService) {
    super();

    this.filteredServices = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterOptions(state) : this.types.slice())
      );
  }

  ngOnChanges() {
    this.simplicateService.getServiceDetails(this.serviceId).subscribe(services => {
      const types = services ? services.hour_types : [];
      this.types = types.map(type => type.hourstype);
      this.writeValue(this.selectedId);
    });
  }

  protected _filterOptions(value: string): Array<any> {
    if (value) {
      return this.types.filter(options => options.label.toLowerCase().includes(value.toLowerCase()));
    }
    return this.types;
  }


  writeValue(obj: any): void {
    console.log(obj);
    if (this.types.length) {
      const service = this.types.find(type => type.id === obj);
      super.writeValue(service && service.label);
    } else {
      this.selectedId = obj;
      super.writeValue(null);
    }
  }

  protected getId(option: any): string {
    return option.id;
  }

  protected getName(option: any): string {
    return option.label;
  }
}
