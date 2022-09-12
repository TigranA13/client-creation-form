import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IAddressFormData, IClientFormData, IIdentityFormData } from '../client-form/client-form.model';

@Component({
  selector: 'app-created-client',
  templateUrl: './created-client.component.html',
  styleUrls: ['./created-client.component.scss']
})
export class CreatedClientComponent implements OnInit {
  data!: {client: IClientFormData, address: IAddressFormData, identity: IIdentityFormData};

  constructor(private router: Router) { }

  ngOnInit(): void {
    const clientData = sessionStorage.getItem('client');
    const addressData = sessionStorage.getItem('address');
    const identityData = sessionStorage.getItem('identity');

    if (clientData && addressData && identityData) {
      this.data = {
        client: JSON.parse(clientData),
        address: JSON.parse(addressData),
        identity: JSON.parse(identityData)
      };
    }
  }

  deleteClient() {
    sessionStorage.clear();
    this.router.navigate(['/client-form/client']);
  }
}
