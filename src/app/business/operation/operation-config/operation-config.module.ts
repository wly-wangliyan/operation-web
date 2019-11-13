import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationConfigRoutingModule } from './operation-config-routing.module';
import { OperationConfigComponent } from './operation-config.component';

@NgModule({
  declarations: [OperationConfigComponent],
  imports: [
    CommonModule,
    OperationConfigRoutingModule
  ]
})
export class OperationConfigModule { }
