import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { ISelectData } from '../client-form.model';
import { ClientFormService } from '../../../services/client-form.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent implements OnInit, OnDestroy {
  docTypes: ISelectData[] = [
    {value: 'Passport'},
    {value: 'Birth Certificate'},
    {value: 'Driving License'},
  ];
  identityForm!: FormGroup;
  fileName = '';
  maxDate = new Date();
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private formDataService: ClientFormService,
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    const jsonData = sessionStorage.getItem('identity');
    const data = jsonData && JSON.parse(jsonData);
    this.fileName = data?.fileUploader;

    this.identityForm  = this.fb.group({
      docType: [data ? data.docType : '', Validators.required],
      series: [data ? data.series : ''],
      number: [data ? data.number : '', [Validators.required, Validators.pattern(/^\d+$/)]],
      issuedBy: [data ? data.issuedBy : ''],
      dateOfIssue: [data ? data.dateOfIssue : '', Validators.required],
      fileUploader: [data ? data.fileUploader : ''],
      fileLink: [''],
    });
    this.formDataService.setFormData('identity', this.identityForm);
    this.identityForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.formDataService.setFormData('identity', this.identityForm);
      });
  }

  onDocTypeChange() {
    this.identityForm.patchValue({
      series: '',
      number: '',
      issuedBy: '',
      dateOfIssue: '',
      fileUploader: '',
      fileLink: '',
    });
    this.fileName = '';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.identityForm.get('fileUploader')?.setValue(this.fileName);
      const formData = new FormData();
      formData.append("file", file, file.name);

      this.http.post(environment.fileApiUrl, formData).subscribe((res: any) => {
        this.identityForm.get('fileLink')?.setValue(res?.link);
      });
    }
    return;
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
