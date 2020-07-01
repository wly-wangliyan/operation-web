import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegralMallRoutingModule } from './integral-mall-routing.module';
import { IntegralMallComponent } from './integral-mall.component';


@NgModule({
  declarations: [IntegralMallComponent],
  imports: [
    CommonModule,
    IntegralMallRoutingModule
  ]
})
export class IntegralMallModule { }
