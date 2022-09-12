import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { ISelectData } from '../client-form.model';
import { ClientFormService } from '../../../services/client-form.service';

const GENDERS = [
  {value: 'Male'},
  {value: 'Female'},
  {value: 'Other'},
];
const CLIENT_GROUP = [
  {value: 'VIP Clients'},
  {value: 'Loyal Clients'},
  {value: 'New Clients'},
];
const COORDINATORS = [
  {value: 'Jhones'},
  {value: 'Colinwood'},
  {value: 'Smith'},
];

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {
  genders: ISelectData[] = GENDERS;
  clientGroup: ISelectData[] = CLIENT_GROUP;
  coordinators: ISelectData[] = COORDINATORS;
  clientForm!: FormGroup;
  maxDate = new Date();
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private formDataService: ClientFormService,
  ) {}

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm() {
    const jsonData = sessionStorage.getItem('client');
    const data = jsonData && JSON.parse(jsonData);

    this.clientForm = this.fb.group({
      firstName: [ data ? data.firstName: '', Validators.required],
      middleName: [data ? data.middleName : ''],
      lastName: [data ? data.lastName : '', Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : '', Validators.required],
      gender: [data ? data.gender : '', Validators.required],
      phoneNumber: [data ? data.phoneNumber : '', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],
      clientGroup: [data ? data.clientGroup : '', Validators.required],
      coordinator: [data ? data.coordinator : ''],
      sendSMS: [data ? data.sendSMS : ''],
    });
    this.formDataService.setFormData('client', this.clientForm);

    this.clientForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.formDataService.setFormData('client', this.clientForm);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
