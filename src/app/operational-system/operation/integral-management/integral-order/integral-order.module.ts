import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegralOrderRoutingModule } from './integral-order-routing.module';
import { IntegralOrderComponent } from './integral-order.component';


@NgModule({
  declarations: [IntegralOrderComponent],
  imports: [
    CommonModule,
    IntegralOrderRoutingModule
  ]
})
export class IntegralOrderModule { }
