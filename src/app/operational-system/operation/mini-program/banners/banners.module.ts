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
import { BannerConfigListComponent } from './banner-config-list/banner-config-list.component';
@NgModule({
  declarations: [BannersComponent, BannerListComponent, BannerConfigListComponent],
  imports: [
    CommonModule,
    BannersRoutingModule,
    ShareModule,
    DragDropModule,
    NzTableModule,
    NzButtonModule,
    NzSwitchModule
  ]
})
export class BannersModule { }
