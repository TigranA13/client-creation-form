import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CreatedClientComponent } from './created-client.component';
import { CreatedClientRoutingModule } from './created-client-routing.module';

@NgModule({
  declarations: [
    CreatedClientComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    CreatedClientRoutingModule
  ]
})
export class CreatedClientModule { }
