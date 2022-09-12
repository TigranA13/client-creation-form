import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesRequestService {

  constructor(private httpClient: HttpClient) {}

  getCountries(endpoint: string): Observable<any> {
    return this.httpClient.get(environment.countryListApiURL + endpoint);
  }

  getCities(endpoint: string, body: {country: string}): Observable<any> {
    return this.httpClient.post(environment.countryListApiURL + endpoint, body);
  }
}
