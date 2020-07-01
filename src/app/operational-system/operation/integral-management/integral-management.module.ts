import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegralManagementRoutingModule } from './integral-management-routing.module';
import { IntegralManagementComponent } from './integral-management.component';


@NgModule({
  declarations: [IntegralManagementComponent],
  imports: [
    CommonModule,
    IntegralManagementRoutingModule
  ]
})
export class IntegralManagementModule { }
