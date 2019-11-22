import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { ProjectManagemantRoutingModule } from './project-managemant-routing.module';
import { ProjectManagemantComponent } from './project-managemant.component';
import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
  declarations: [
    ProjectManagemantComponent,
    ProjectListComponent],
  imports: [
    ShareModule,
    CommonModule,
    ProjectManagemantRoutingModule
  ]
})
export class ProjectManagemantModule { }
