import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientModule } from './client/client.module';
import { ClientFormRoutingModule } from './client-form-routing.module';
import { AddressModule } from './address/address.module';
import { IdentityModule } from './identity/identity.module';
import { ClientFormComponent } from './client-form.component';
import { StepperContainerComponent } from '../../components/stepper/stepper-container.component';

@NgModule({
  declarations: [
    ClientFormComponent,
    StepperContainerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    CdkStepperModule,
    MatStepperModule,
    MatSnackBarModule,
    ClientModule,
    AddressModule,
    IdentityModule,
    ClientFormRoutingModule,
  ]
})
export class ClientFormModule { }
