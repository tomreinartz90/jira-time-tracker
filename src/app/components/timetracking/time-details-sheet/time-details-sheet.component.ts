import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SimplicateService} from '../../../providers/simplicate.service';
import {Subscription} from 'rxjs';
import {HourModel} from '../../../domain/hour.model';

@Component({
  selector: 'app-time-details-sheet',
  templateUrl: './time-details-sheet.component.html',
  styleUrls: ['./time-details-sheet.component.scss']
})
export class TimeDetailsSheetComponent implements OnInit, OnDestroy {
  timeForm: FormGroup;

  projectId: string;
  projectserviceId: string;

  const;
  subs: Array<Subscription> = [];

  constructor(private bottomSheetRef: MatBottomSheetRef<TimeDetailsSheetComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              fb: FormBuilder,
              private simplicateService: SimplicateService) {

    this.timeForm = fb.group({
      projectservice: [data.projectservice.id],
      project: [data.project.id, Validators.required],
      type: [data.type.id, Validators.required],
      startTime: [data.start_date, Validators.required],
      endTime: [data.end_date, Validators.required],
      note: [data.note, Validators.required]
    });

    this.projectId = data.project.id;
    this.projectserviceId = data.projectservice.id;

    this.subs.push(
      this.timeForm.controls['project'].valueChanges.subscribe(id => {
        console.log('project', id);
        this.projectId = id;
        // this.projectserviceId = null;
        // this.timeForm.controls['projectservice'].setValue(null);
        // this.timeForm.controls['type'].setValue(null);
      }),

      this.timeForm.controls['projectservice'].valueChanges.subscribe(id => {
        console.log('projectservice', id);
        this.projectserviceId = id;
        // this.timeForm.controls['type'].setValue(null);
      })
    );
  }

  ngOnInit() {
    console.log(this.data);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  close(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  onSubmit() {
    const {projectservice, project, type, startTime, endTime, note} = this.timeForm.value;
    const payload = HourModel.fromJSON(this.data);
    let action;
    console.log(startTime, endTime);
    payload.start_date = startTime;
    payload.end_date = endTime;
    payload.note = note;

    if (this.data.id) {
      action = this.simplicateService.updateEmployeeHours(payload);
    } else {
      payload.project.id = project;
      payload.projectservice.id = projectservice;
      payload.type.id = type;
      action = this.simplicateService.addNewEmployeeHours(payload);
    }

    action.subscribe(() => {
      this.bottomSheetRef.dismiss();
    });
  }

}
