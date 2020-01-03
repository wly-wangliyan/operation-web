import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeesComponent } from './employees.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  declarations: [EmployeesComponent, EmployeeListComponent],
  imports: [
    ShareModule,
    CommonModule,
    EmployeesRoutingModule,
    NzTableModule,
    NzButtonModule,
  ]
})
export class EmployeesModule { }
