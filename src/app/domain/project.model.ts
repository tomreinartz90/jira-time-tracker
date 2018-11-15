import { BaseModel } from './base.model';
import { OrganizationModel } from './organization.model';
import { StringUtil } from '../utils/string.util';

export class ProjectModel extends BaseModel<ProjectModel> {
  id: string;
  name: string;
  project_number: string;
  project_name?: string;
  organization: OrganizationModel;


  get cleanName() {
    if(this.project_name) {
      return this.project_name.replace(`(${this.project_number})`, '').trim();
    }

    return StringUtil.clean(this.name);
  }
}
