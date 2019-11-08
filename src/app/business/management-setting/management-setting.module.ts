import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementSettingRoutingModule } from './management-setting-routing.module';
import { ManagementSettingComponent } from './management-setting.component';

@NgModule({
  declarations: [ManagementSettingComponent],
  imports: [
    CommonModule,
    ManagementSettingRoutingModule
  ]
})
export class ManagementSettingModule { }
