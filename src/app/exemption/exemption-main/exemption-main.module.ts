import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../../operational-system/main/main.module';
import { ExemptionMainRoutingModule } from './exemption-main-routing.module';
import { ExemptionMainComponent } from './exemption-main.component';
import { ServiceConfigComponent } from '../service-config/service-config.component';
import { ShareModule } from '../../share/share.module';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  declarations: [ExemptionMainComponent, ServiceConfigComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExemptionMainRoutingModule,
    MainModule,
    ShareModule,
    NzSwitchModule,
    NzSpinModule,
    NzButtonModule
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class ExemptionMainModule { }
