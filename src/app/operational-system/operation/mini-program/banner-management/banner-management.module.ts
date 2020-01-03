import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { BannerManagementRoutingModule } from './banner-management-routing.module';
import { BannerManagementComponent } from '../banner-management/banner-management.component';
import { BannerListComponent } from '../banner-management/banner-list/banner-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { BannerDetailComponent } from './banner-detail/banner-detail.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
@NgModule({
  declarations: [BannerManagementComponent, BannerListComponent, BannerEditComponent, BannerDetailComponent],
  imports: [
    CommonModule,
    BannerManagementRoutingModule,
    ShareModule,
    DragDropModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTableModule,
    NzButtonModule,
    NzSwitchModule
  ]
})
export class BannerManagementModule { }
