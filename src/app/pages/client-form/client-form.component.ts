import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { filter, map, Subject, takeUntil } from 'rxjs';

import { IFormState } from './client-form.model';
import { ClientFormService } from '../../services/client-form.service';
import { CountriesRequestService } from '../../services/countries.request.service';

const STEPS = [
  {
    label: 'Client Information',
    state: 'client',
    link: '/client-form/client',
    icon: 'person',
  },
  {
    label: 'Address',
    state: 'address',
    link: '/client-form/address',
    icon: 'home',
  },
  {
    label: 'Identity Verification',
    state: 'identity',
    link: '/client-form/identity',
    icon: 'fingerprint',
  },
];

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;

  selectedStepIndex = 0;
  steps = STEPS;
  activeRoute: string = 'client';
  formState: IFormState = {
    client: new FormGroup<any>(''),
    address: new FormGroup<any>(''),
    identity: new FormGroup<any>(''),
  };
  activeForm: FormGroup<any> | null | undefined;

  unsubscribeActiveForm$: Subject<boolean> = new Subject<boolean>();
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private formDataService: ClientFormService,
    private countriesRequestService: CountriesRequestService,
  ) {
    this.router.events.pipe(
      takeUntil(this.unsubscribe$),
      filter(event => event && event instanceof NavigationEnd)
    ).subscribe( (e: any) => {
      const len = e.url.split('/').length;
      this.activeRoute = e.url.split('/')[len - 1];
      const index = this.steps.findIndex(res => res.state === this.activeRoute);
      this.selectedStepIndex = index !== -1 ? index : 0;
      this.setActiveFormState();
    });
  }

  ngOnInit(): void {
    this.getCountries();
    this.formDataService.formData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: IFormState) => {
        this.formState = res;
        this.setActiveFormState();
      });
  }

  setActiveFormState(): void {
    this.unsubscribeActiveForm$.next(true);
    this.unsubscribeActiveForm$.complete();
    if (this.formState && this.formState[this.activeRoute]) {
      this.activeForm = this.formState[this.activeRoute];
      this.cd.detectChanges();
    }
    this.activeForm?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        sessionStorage.setItem(this.activeRoute, JSON.stringify(res));
        sessionStorage.setItem(this.activeRoute + 'Valid', JSON.stringify(this.activeForm?.valid));
      });
  }

  getCountries(): void {
    this.countriesRequestService.getCountries('countries')
      .pipe(map(val => {
        return val.data.map((country: any) => {
          const cities = country.cities.map((city: string) => ({value: city}));
          return {value: country.country, cities};
        });
      })).subscribe(res => this.formDataService.setCountries(res));
  }

  stepChange(e: number): void {
    if (this.activeForm?.invalid && e > this.selectedStepIndex) {
      (<any>Object).values(this.activeForm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }
    if (e === this.steps.length) {
      this.submit();
      return;
    }
    this.selectedStepIndex = e;
    this.router.navigate(['./' + this.steps[this.selectedStepIndex].link]);
  }

  submit() {
    this._snackBar.open('SUCCESS: Client has been created.', 'OK', {
      duration: 3000,
      panelClass: ['success'],
    });
    setTimeout(() => {
      this.router.navigate(['/created-client']);
    }, 1000);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
    this.unsubscribeActiveForm$.next(true);
    this.unsubscribeActiveForm$.complete();
  }
}
