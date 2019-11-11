import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { ActivityConfigRoutingModule } from './activity-config-routing.module';
import { ActivityConfigComponent } from './activity-config.component';
import { ConfigListComponent } from './config-list/config-list.component';


@NgModule({
  declarations: [ActivityConfigComponent, ConfigListComponent],
  imports: [
    ShareModule,
    CommonModule,
    ActivityConfigRoutingModule
  ]
})
export class ActivityConfigModule { }
