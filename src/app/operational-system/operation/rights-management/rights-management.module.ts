import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RightsManagementRoutingModule } from './rights-management-routing.module';
import { RightsManagementComponent } from './rights-management.component';


@NgModule({
  declarations: [RightsManagementComponent],
  imports: [
    CommonModule,
    RightsManagementRoutingModule
  ]
})
export class RightsManagementModule { }
