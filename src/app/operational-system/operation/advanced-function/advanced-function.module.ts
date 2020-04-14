import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancedFunctionRoutingModule } from './advanced-function-routing.module';
import { AdvancedFunctionComponent } from './advanced-function.component';


@NgModule({
  declarations: [AdvancedFunctionComponent],
  imports: [
    CommonModule,
    AdvancedFunctionRoutingModule
  ]
})
export class AdvancedFunctionModule { }
