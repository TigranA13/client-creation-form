import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './header/header.component';
import { MainContainerComponent } from './main-container/main-container.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MainContainerComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    MainContainerComponent,
  ]
})
export class LayoutModule { }
