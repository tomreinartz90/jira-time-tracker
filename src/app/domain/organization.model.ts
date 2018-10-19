import { BaseModel } from './base.model';

export interface OrganizationModel extends BaseModel<OrganizationModel> {
  id: string;
  name: string;
}
