import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ServiceConfigRoutingModule } from './service-config-routing.module';
import { ServiceConfigComponent } from './service-config.component';
import { ServiceConfigListComponent } from './service-config-list/service-config-list.component';
import { ServiceConfigDetailComponent } from './service-config-detail/service-config-detail.component';
import { AddCarParkingComponent } from './service-config-list/add-car-parking/add-car-parking.component';
import { DetailComponent } from './service-config-list/detail/detail.component';


@NgModule({
  declarations: [ServiceConfigComponent, ServiceConfigListComponent, ServiceConfigDetailComponent,
    AddCarParkingComponent, DetailComponent],
  imports: [
    ShareModule,
    CommonModule,
    ServiceConfigRoutingModule
  ]
})
export class ServiceConfigModule { }
