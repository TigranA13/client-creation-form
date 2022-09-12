import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { IFormState, ISelectData } from '../pages/client-form/client-form.model';

@Injectable({
  providedIn: 'root',
})
export class ClientFormService {
  countries: BehaviorSubject<ISelectData[]> = new BehaviorSubject<ISelectData[]>([]);
  formData: BehaviorSubject<IFormState> = new BehaviorSubject<IFormState>({
    client: null,
    address: null,
    identity: null,
  });

  constructor() {}

  setFormData(key: string, value: FormGroup): void {
    const data = {...this.formData.value, [key]: value};

    this.formData.next(data);
  }

  setCountries(value: ISelectData[]): void {
    this.countries?.next(value);
  }
}
