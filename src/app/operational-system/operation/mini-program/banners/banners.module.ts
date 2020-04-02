import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { BannersRoutingModule } from './banners-routing.module';
import { BannersComponent } from './banners.component';
import { BannerListComponent } from './banner-list/banner-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { BannerConfigListComponent } from './banner-config-list/banner-config-list.component';
import { BannerContentListComponent } from './banner-content-list/banner-content-list.component';
@NgModule({
  declarations: [BannersComponent, BannerListComponent, BannerConfigListComponent, BannerContentListComponent],
  imports: [
    CommonModule,
    BannersRoutingModule,
    ShareModule,
    DragDropModule,
    NzTableModule,
    NzButtonModule,
    NzSwitchModule,
    NzDatePickerModule
  ]
})
export class BannersModule { }
