import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceConfigRoutingModule } from './service-config-routing.module';
import { ServiceConfigComponent } from './service-config.component';
import { ServiceConfigEditComponent } from './service-config-edit/service-config-edit.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ShareModule } from '../../share/share.module';
@NgModule({
  declarations: [ServiceConfigComponent, ServiceConfigEditComponent],
  imports: [
    CommonModule,
    ServiceConfigRoutingModule,
    ShareModule,
    NzSpinModule,
    NzSwitchModule,
    NzButtonModule
  ]
})
export class ServiceConfigModule { }
