import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ServiceConfigRoutingModule } from './service-config-routing.module';
import { ServiceConfigComponent } from './service-config.component';

@NgModule({
  declarations: [ServiceConfigComponent],
  imports: [
    ShareModule,
    CommonModule,
    ServiceConfigRoutingModule
  ]
})
export class ServiceConfigModule { }
