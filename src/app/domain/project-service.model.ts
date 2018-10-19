import { BaseModel } from './base.model';

export class ProjectServiceModel extends BaseModel<ProjectServiceModel> {
  id: string;
  name: string;
  default_service_id: string;
  revenue_group_id: string;

  get cleanName() {
    return this.name.replace( /<b.*b>/, '' );
  }
}
