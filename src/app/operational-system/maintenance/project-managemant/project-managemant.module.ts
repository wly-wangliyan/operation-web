import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { ProjectManagemantRoutingModule } from './project-managemant-routing.module';
import { ProjectManagemantComponent } from './project-managemant.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  declarations: [
    ProjectManagemantComponent,
    ProjectListComponent],
  imports: [
    ShareModule,
    CommonModule,
    ProjectManagemantRoutingModule,
    NzTableModule,
    NzButtonModule,
  ]
})
export class ProjectManagemantModule { }
