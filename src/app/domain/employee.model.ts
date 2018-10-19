import { BaseModel } from './base.model';

export class BaseEmployeeModel extends BaseModel<BaseEmployeeModel> {
  id: string;
  name: string;
}
