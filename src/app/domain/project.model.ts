import { BaseModel } from './base.model';
import { OrganizationModel } from './organization.model';

export class ProjectModel extends BaseModel<ProjectModel> {
  id: string;
  name: string;
  project_number: string;
  organization: OrganizationModel;

  get cleanName() {
    return this.name.replace( /<b.*b>/, '' );
  }
}
