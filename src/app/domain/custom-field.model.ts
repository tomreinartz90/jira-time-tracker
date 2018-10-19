import { BaseModel } from './base.model';

export class CustomFieldModel extends BaseModel<CustomFieldModel> {
  id: string;
  name: string;
  label: string;
  render_type: string;
  position: number;
  value_type: string;
  options: any[];
}
