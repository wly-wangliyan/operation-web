import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { NoticeCenterRoutingModule } from './notice-center-routing.module';
import { NoticeCenterComponent } from './notice-center.component';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [NoticeCenterComponent, NoticeListComponent],
  imports: [
    NzTableModule,
    ShareModule,
    CommonModule,
    NoticeCenterRoutingModule
  ]
})
export class NoticeCenterModule { }
