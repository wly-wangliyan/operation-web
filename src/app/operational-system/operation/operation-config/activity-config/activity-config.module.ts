import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { ActivityConfigRoutingModule } from './activity-config-routing.module';
import { ActivityConfigComponent } from './activity-config.component';
import { ConfigListComponent } from './config-list/config-list.component';
import { ConfigEditComponent } from './config-edit/config-edit.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
@NgModule({
  declarations: [ActivityConfigComponent, ConfigListComponent, ConfigEditComponent],
  imports: [
    ShareModule,
    CommonModule,
    ActivityConfigRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzSpinModule,
    NzSwitchModule,
    NzDatePickerModule
  ]
})
export class ActivityConfigModule { }
