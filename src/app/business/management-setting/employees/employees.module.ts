import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeesComponent } from './employees.component';

@NgModule({
  declarations: [EmployeesComponent, EmployeeListComponent],
  imports: [
    ShareModule,
    CommonModule,
    EmployeesRoutingModule
  ]
})
export class EmployeesModule { }
