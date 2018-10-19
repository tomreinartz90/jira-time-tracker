import {BaseModel} from './base.model';
import {BaseEmployeeModel} from './employee.model';
import {ProjectModel} from './project.model';
import {ProjectServiceModel} from './project-service.model';
import {ServiceTypeModel} from './service-type.model';
import {CustomFieldModel} from './custom-field.model';
import {ApprovalStatusModel} from './approval-status.model';
import {LeaveStatusModel} from './leave-status.model';
import {DateUtil} from '../utils/date.util';

export class HourModel extends BaseModel<HourModel> {
  id: string;
  employee: BaseEmployeeModel = new BaseEmployeeModel();
  project: ProjectModel = new ProjectModel();
  projectservice: ProjectServiceModel = new ProjectServiceModel();
  type: ServiceTypeModel = new ServiceTypeModel();
  tariff: number;
  created_at: string;
  updated_at: string;
  locked: boolean;
  hours: number;
  start_date: Date;
  end_date: Date;
  is_time_defined: boolean;
  note: string;
  custom_fields: CustomFieldModel[] = [];
  source: string;
  approvalstatus: ApprovalStatusModel = new ApprovalStatusModel();
  status: string;
  leave_status: LeaveStatusModel = new LeaveStatusModel();
  leave_id: string;

  static fromJSON( payload: any ) {
    const obj: HourModel = super.fromJSON( payload );
    obj.start_date = DateUtil.stringToDateIgnoreTimeZone(payload.start_date);
    obj.end_date = DateUtil.stringToDateIgnoreTimeZone(payload.end_date);
    obj.employee = BaseEmployeeModel.fromJSON( payload.employee );
    obj.project = ProjectModel.fromJSON( payload.project );
    obj.projectservice = ProjectServiceModel.fromJSON( payload.projectservice );
    obj.type = ServiceTypeModel.fromJSON( payload.type );
    obj.custom_fields = payload.custom_fields.map( item => CustomFieldModel.fromJSON( item ) );
    obj.approvalstatus = ApprovalStatusModel.fromJSON( payload.approvalstatus );
    obj.leave_status = LeaveStatusModel.fromJSON( payload.project );

    return obj;
  }

  toUpdateJSON() {
    return {
      employee_id: this.employee.id,
      project_id: this.project.id,
      projectservice_id: this.projectservice.id,
      type_id: this.type.id,
      approvalstatus_id: this.approvalstatus.id,
      hours: (this.end_date.getTime() - this.start_date.getTime()) / 60 / 60 / 1000,
      start_date: DateUtil.dateToStringIgnoreTimeZone(this.start_date),
      end_date: DateUtil.dateToStringIgnoreTimeZone(this.end_date),
      is_time_defined: this.is_time_defined,
      note: this.note,
      // custom_fields: this.custom_fields, //disabled for now as api does not handle this correctly
      source: this.source
    };
  }
}

