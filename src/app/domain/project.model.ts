import { BaseModel } from './base.model';
import { OrganizationModel } from './organization.model';

export class ProjectModel extends BaseModel<ProjectModel> {
  id: string;
  name: string;
  project_number: string;
  project_name?: string;
  organization: OrganizationModel;


  get cleanName() {
    return this.project_name || this.name
      .replace( /<?.b>/g, '' )
      .replace( '\'', ' - ' )
      .replace( '\'', '' )
      .trim();
  }
}
