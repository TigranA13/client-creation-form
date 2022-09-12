import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router,
  UrlSegment,
  UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientFormGuard implements CanLoad {

  constructor(private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const path = route?.path;

    if (path === 'address') {
      const validJson = sessionStorage.getItem('clientValid');
      const valid = validJson && JSON.parse(validJson);
      !valid && this.router.navigate(['/client-form/client']);
      return valid;
    }
    if (path === 'identity') {
      const validJson = sessionStorage.getItem('addressValid');
      const valid = validJson && JSON.parse(validJson);
      !valid && this.router.navigate(['/client-form/address']);
      return valid;
    }
    return false;
  }
}
