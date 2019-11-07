import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { BannerManagementRoutingModule } from './banner-management-routing.module';
import { BannerManagementComponent } from '../banner-management/banner-management.component';
import { BannerListComponent } from '../banner-management/banner-list/banner-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { BannerDetailComponent } from './banner-detail/banner-detail.component';

@NgModule({
  declarations: [BannerManagementComponent, BannerListComponent, BannerEditComponent, BannerDetailComponent],
  imports: [
    CommonModule,
    BannerManagementRoutingModule,
    ShareModule,
    DragDropModule
  ]
})
export class BannerManagementModule { }
