import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/client-form/client',
  },
  {
    path: 'client-form', loadChildren: () => import('./pages/client-form/client-form.module').then(m => m.ClientFormModule),
    data: {title: 'Create Client'},
  },
  {
    path: 'created-client', loadChildren: () => import('./pages/created-client/created-client.module').then(m => m.CreatedClientModule),
    data: {title: 'Created Client'},
  },
  {
    path: '**',
    redirectTo: '/client-form',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
