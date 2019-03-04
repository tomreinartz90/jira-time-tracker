import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JiraService} from '../../../providers/jira.service';
import {Subscription} from 'rxjs';
import {HourModel} from '../../../domain/hour.model';
import {TrackingServiceService} from '../../../providers/tracking-service.service';
import {UserPrefService} from '../../../providers/user-pref.service';

@Component({
  selector: 'app-time-details-sheet',
  templateUrl: './time-details-sheet.component.html',
  styleUrls: ['./time-details-sheet.component.scss']
})
export class TimeDetailsSheetComponent implements OnDestroy {
  timeForm: FormGroup;

  projectId: string;
  projectserviceId: string;
  startDate: Date;

  const;
  subs: Array<Subscription> = [];
  loading = false;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<TimeDetailsSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { hour: HourModel, isTimer: boolean },
    public fb: FormBuilder,
    private tracking: TrackingServiceService,
    private simplicateService: JiraService,
    private prefs: UserPrefService
  ) {
    this.initForm(data.hour);

  }

  get isActiveTimer() {
    const activeTimer = this.simplicateService.getActiveTimer();

    return this.data.isTimer && activeTimer && this.data.hour.id === activeTimer;
  }

  initForm(data: HourModel) {
    this.timeForm = this.fb.group({
      projectservice: [data.projectservice.id],
      project: [data.project.id, Validators.required],
      type: [data.type.id, Validators.required],
      startTime: [data.start_date, Validators.required],
      endTime: [data.end_date, Validators.required],
      note: [data.note]
    });

    this.projectId = data.project.id;
    this.projectserviceId = data.projectservice.id;
    this.startDate = data.start_date;

    if (!this.data.hour.id) {
      const {usesTimer} = this.prefs.getPreferences();
      this.data.isTimer = usesTimer;
    }

    this.subs.push(
      this.timeForm.controls['project'].valueChanges.subscribe(id => {
        this.projectId = id;
        this.timeForm.controls['projectservice'].setValue(null);
        this.timeForm.controls['type'].setValue(null);
      }),

      this.timeForm.controls['projectservice'].valueChanges.subscribe(id => {
        this.projectserviceId = id;
        this.timeForm.controls['type'].setValue(null);
      }),
    );
  }

  get endDatePastStartTime() {
    const start = this.timeForm.controls['startTime'].value;
    const end = this.timeForm.controls['endTime'].value;
    return start && end && end.getTime() >= start.getTime();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  setIsTimer(isTimer: boolean) {
    this.data.isTimer = isTimer;
    if (isTimer) {
      const end: Date = this.timeForm.controls['endTime'].value;
      const start: Date = this.timeForm.controls['startTime'].value;
      const now = new Date();

      end.setUTCHours(now.getHours(), now.getMinutes(), 0);

      if (start.getTime() > end.getTime()) {
        start.setUTCHours(now.getHours(), now.getMinutes(), 0);
        this.timeForm.controls['startTime'].setValue(start);
      }

      this.timeForm.controls['endTime'].setValue(end);
    }
  }

  delete() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.tracking.trackEvent('timetable', 'delete-hour');

    this.simplicateService.deleteEmployeeHours(this.data.hour.id).subscribe(() => {
      this.bottomSheetRef.dismiss();
    });
  }

  onSubmit(reInit = false) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const {projectservice, project, type, startTime, endTime, note} = this.timeForm.value;
    const payload = HourModel.fromJSON(this.data.hour);
    let action;

    payload.start_date = startTime;
    payload.end_date = endTime;
    payload.note = note;
    payload.project.id = project;
    payload.projectservice.id = projectservice;
    payload.type.id = type;

    // store preference for usesTimer in config
    const prefs = this.prefs.getPreferences();
    prefs.usesTimer = this.data.isTimer;
    this.prefs.setPreferences(prefs);

    if (this.data.isTimer && !this.data.hour.id) {
      payload.end_date = new Date(startTime);
      const date = new Date();
      if (startTime.getTime() < date.getTime()) {
        const hours = date.getHours();
        const minutes = date.getHours();
        payload.end_date.setUTCHours(hours, minutes, 0);
      }
      this.tracking.trackEvent('timetable', 'create-timer-item');
      action = this.simplicateService.setActiveTimer(payload);
    } else if (this.data.hour.id) {
      this.tracking.trackEvent('timetable', 'update-item');
      action = this.simplicateService.updateEmployeeHours(payload);
    } else {
      this.tracking.trackEvent('timetable', 'create-item');
      action = this.simplicateService.addNewEmployeeHours(payload);
    }

    action.subscribe(() => {
      this.bottomSheetRef.dismiss();
    });
  }

  onTimerStop() {
    if (this.loading) {
      return;
    }
    this.simplicateService.clearTimer();
    this.bottomSheetRef.dismiss();
    this.tracking.trackEvent('timetable', 'stop-timer');
  }
}
