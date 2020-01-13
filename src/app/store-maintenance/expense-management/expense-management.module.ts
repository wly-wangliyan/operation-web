import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ExpenseManagementRoutingModule } from './expense-management-routing.module';
import { ExpenseManagementComponent } from './expense-management.component';
import { RecordListComponent } from './record-list/record-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { StoreShareModule } from '../share/store-share.module';

@NgModule({
  declarations: [ExpenseManagementComponent, RecordListComponent],
  imports: [
    CommonModule,
    ExpenseManagementRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    StoreShareModule
  ]
})
export class ExpenseManagementModule { }
