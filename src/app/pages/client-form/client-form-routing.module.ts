import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientFormComponent } from './client-form.component';
import { ClientFormGuard } from './client-form.guard';

const routes: Routes = [
  {
    path: '',
    component: ClientFormComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/client-form/client' },
      {
        path: 'client',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
        data: {title: 'Create Client | Client'},
      },
      {
        path: 'address',
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
        data: {title: 'Create Client | Address'},
        canLoad: [ClientFormGuard],
      },
      {
        path: 'identity',
        loadChildren: () => import('./identity/identity.module').then(m => m.IdentityModule),
        data: {title: 'Create Client | Identity'},
        canLoad: [ClientFormGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/client-form/client',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientFormRoutingModule {
}
