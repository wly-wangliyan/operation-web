import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../../operational-system/main/main.module';
import { OrderParkingMainRoutingModule } from './order-parking-main-routing.module';
import { OrderParkingMainComponent } from './order-parking-main.component';
import { ShareModule } from '../../share/share.module';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  declarations: [OrderParkingMainComponent],
  imports: [
    CommonModule,
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
