import { BaseModel } from './base.model';

export class LeaveStatusModel extends BaseModel<LeaveStatusModel> {
  id: string;
  label: string;
}
