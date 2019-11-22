
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { NoticeManagementRoutingModule } from './notice-management-routing.module';
import { NoticeManagementComponent } from './notice-management.component';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { NoticeEditComponent } from './notice-list/notice-edit/notice-edit.component';

@NgModule({
  declarations: [NoticeManagementComponent, NoticeListComponent, NoticeEditComponent],
  imports: [
    CommonModule,
    NoticeManagementRoutingModule,
    ShareModule,
  ]
})
export class NoticeManagementModule { }
