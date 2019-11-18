import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementSettingRoutingModule } from './management-setting-routing.module';
import { ManagementSettingComponent } from './management-setting.component';
import { MainModule } from '../main/main.module';

@NgModule({
  declarations: [ManagementSettingComponent],
  imports: [
    CommonModule,
    ManagementSettingRoutingModule,
    MainModule
  ]
})
export class ManagementSettingModule { }
