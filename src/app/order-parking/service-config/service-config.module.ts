import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ServiceConfigRoutingModule } from './service-config-routing.module';
import { ServiceConfigComponent } from './service-config.component';
import { ServiceConfigListComponent } from './service-config-list/service-config-list.component';
import { ServiceConfigDetailComponent } from './service-config-detail/service-config-detail.component';
import { AddCarParkingComponent } from './service-config-list/add-car-parking/add-car-parking.component';
import { ServiceConfigEditComponent } from './service-config-edit/service-config-edit.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
@NgModule({
  declarations: [ServiceConfigComponent, ServiceConfigListComponent, ServiceConfigDetailComponent,
    AddCarParkingComponent, ServiceConfigEditComponent],
  imports: [
    ShareModule,
    CommonModule,
    ServiceConfigRoutingModule,
    NzTableModule,
    NzSpinModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule
  ]
})
export class ServiceConfigModule { }
