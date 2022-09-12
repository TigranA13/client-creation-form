import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { IAddressFormData, ISelectData } from '../client-form.model';
import { ClientFormService } from '../../../services/client-form.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, OnDestroy {
  addressData: IAddressFormData | undefined;
  countries: ISelectData[] = [];
  filteredOptionsCountries: Observable<ISelectData[]> | undefined;
  cities: ISelectData[] = [];
  filteredOptionsCities: Observable<ISelectData[]> | undefined;
  addressForm!: FormGroup;
  isLoading: boolean = false;
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private formDataService: ClientFormService,
  ) {
    this.formDataService.countries
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.getCountries(res);
      });
  }

  ngOnInit(): void {
    this.setupForm();
    this.filteredOptionsCountries = this.addressForm?.get('country')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountries(value || '')),
    );
    this.filteredOptionsCities = this.addressForm?.get('city')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value || '')),
    );
  }

  setupForm() {
    const jsonData = sessionStorage.getItem('address');
    this.addressData = jsonData && JSON.parse(jsonData);

    this.addressForm = this.fb.group({
      country: [this.addressData ? this.addressData.country : '', Validators.required],
      city: [this.addressData ? this.addressData.city : '', Validators.required],
      area: [this.addressData ? this.addressData.area : ''],
      street: [this.addressData ? this.addressData.street : ''],
      house: [this.addressData ? this.addressData.house : ''],
      index: [this.addressData ? this.addressData.index : '', [Validators.pattern(/^\d+$/)]],
    });
    this.addressData?.country && this.getCities(this.addressData.country);
    this.formDataService.setFormData('address', this.addressForm);

    this.addressForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.formDataService.setFormData('address', this.addressForm);
      });
    this.addressForm.get('country')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (!res) {
          this.cities = [];
          this.addressForm?.get('city')?.setValue('');
        }
      });
  }

  selectCountry(e: MatAutocompleteSelectedEvent): void {
    if (e) {
      this.cities = [];
      this.addressForm?.get('city')?.setValue('');
      this.getCities(e.option.value);
    }
  }

  getCountries(data: ISelectData[]) {
    this.countries = data;

    this.addressForm?.get('country')?.updateValueAndValidity({emitEvent: true});
    const selectedCountry = this.addressForm?.get('country')?.value;
    selectedCountry && this.getCities(selectedCountry);
  }

  getCities(value: string): void {
    const country = this.countries.find(val => val.value === value);

    this.cities = country?.cities || [];
    this.addressForm.get('city')?.updateValueAndValidity({emitEvent: true});
  }

  clearCountry(): void {
    this.addressForm.get('country')?.setValue('');
    this.addressForm.get('city')?.setValue('');
    this.addressForm.get('city')?.markAsUntouched();
  }

  private _filterCountries(value: string): ISelectData[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  private _filterCities(value: string): ISelectData[] {
    const filterValue = value.toLowerCase();

    return this.cities.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
