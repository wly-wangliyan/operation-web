import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerManagementRoutingModule } from './banner-management-routing.module';
import { BannerManagementComponent } from '../banner-management/banner-management.component';
import { BannerListComponent } from '../banner-management/banner-list/banner-list.component';

@NgModule({
  declarations: [BannerManagementComponent, BannerListComponent],
  imports: [
    CommonModule,
    BannerManagementRoutingModule
  ]
})
export class BannerManagementModule { }
