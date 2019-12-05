import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../../operational-system/main/main.module';
import { OrderParkingMainRoutingModule } from './order-parking-main-routing.module';
import { OrderParkingMainComponent } from './order-parking-main.component';
import { ServiceConfigComponent } from '../service-config/service-config.component';
import { ShareModule } from '../../share/share.module';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { AddCarParkingComponent } from '../service-config/add-car-parking/add-car-parking.component';
import { DetailComponent } from '../service-config/detail/detail.component';
import { EditConfigComponent } from '../service-config/edit-config/edit-config.component';

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  declarations: [OrderParkingMainComponent, ServiceConfigComponent, AddCarParkingComponent,
    DetailComponent,
    EditConfigComponent, ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    OrderParkingMainRoutingModule,
    MainModule,
    ShareModule
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class OrderParkingMainModule { }
