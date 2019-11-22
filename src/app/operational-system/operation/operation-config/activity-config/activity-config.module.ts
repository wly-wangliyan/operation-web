import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { ActivityConfigRoutingModule } from './activity-config-routing.module';
import { ActivityConfigComponent } from './activity-config.component';
import { ConfigListComponent } from './config-list/config-list.component';
import { ConfigEditComponent } from './config-edit/config-edit.component';

@NgModule({
  declarations: [ActivityConfigComponent, ConfigListComponent, ConfigEditComponent],
  imports: [
    ShareModule,
    CommonModule,
    ActivityConfigRoutingModule
  ]
})
export class ActivityConfigModule { }
