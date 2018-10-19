import { BaseModel } from './base.model';

export class VatClassModel extends BaseModel<VatClassModel> {
  id: string;
  label: string;
  percentage: number;
}
