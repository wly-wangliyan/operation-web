
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { NoticeManagementRoutingModule } from './notice-management-routing.module';
import { NoticeManagementComponent } from './notice-management.component';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { NoticeEditComponent } from './notice-list/notice-edit/notice-edit.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { DisplayPlacePipe } from './notice-management.pipe';
@NgModule({
  declarations: [NoticeManagementComponent, NoticeListComponent, NoticeEditComponent, DisplayPlacePipe],
  imports: [
    CommonModule,
    NoticeManagementRoutingModule,
    ShareModule,
    NzFormModule,
    NzTableModule,
    NzButtonModule,
    NzBackTopModule,
    NzTabsModule,
    NzSwitchModule,
    NzRadioModule
  ]
})
export class NoticeManagementModule { }
