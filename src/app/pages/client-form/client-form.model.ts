import { FormGroup } from '@angular/forms';

export interface ISelectData {
  value: string;
  viewValue?: string;
  cities?: ISelectData[],
}

export interface IClientFormData {
  sendSMS: boolean | number;
  coordinator: string;
  clientGroup: string[] | string;
  phoneNumber: number | string;
  gender: string;
  lastName: string;
  middleName: string;
  firstName: string;
  dateOfBirth: Date | null;
}

export interface IAddressFormData {
  country: string;
  city: string;
  area: string;
  street: string;
  house: string;
  index: number | null;
}

export interface IIdentityFormData {
  docType: string;
  series: string;
  number: number | null;
  issuedBy: string;
  dateOfIssue: Date | null;
  fileUploader: File | null;
  fileLink?: string;
}

export interface IFormState {
  [key: string]: FormGroup | null;
}
