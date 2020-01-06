import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { VehicleManagementRoutingModule } from './project-management-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  imports: [
    NzTableModule,
    NzSwitchModule,
    CommonModule,
    ShareModule,
    VehicleManagementRoutingModule
  ],
  declarations: [
    ProjectManagementComponent,
    ProjectListComponent,
    ProjectEditComponent
  ],
  providers: [
  ]
})
export class ProjectManagementModule { }
