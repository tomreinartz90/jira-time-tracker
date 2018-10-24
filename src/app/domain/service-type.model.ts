import { BaseModel } from './base.model';
import { VatClassModel } from './vat-class.model';

export class ServiceTypeModel extends BaseModel<ServiceTypeModel> {
  id: string;
  type: string;
  vatclass: VatClassModel;
  label: string;
  tariff: string;

  get cleanLabel() {
    return this.label.replace( /<?.b>/g, '' ).trim();
  }
}
