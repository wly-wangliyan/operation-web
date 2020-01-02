import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { AccessoryLibraryRoutingModule } from './accessory-library-routing.module';
import { AccessoryLibraryComponent } from './accessory-library.component';
import { AccessoryListComponent } from './accessory-list/accessory-list.component';
import { AccessoryEditComponent } from './accessory-edit/accessory-edit.component';
import { ChooseProjectComponent } from './accessory-edit/choose-project/choose-project.component';
import { ChooseBrandComponent } from './accessory-edit/choose-brand/choose-brand.component';
import { SelectMultiBrandFirmComponent } from './accessory-list/select-multi-brand-firm/select-multi-brand-firm.component';

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    AccessoryLibraryRoutingModule,
  ],
  declarations: [
    AccessoryLibraryComponent,
    AccessoryListComponent,
    AccessoryEditComponent,
    ChooseProjectComponent,
    ChooseBrandComponent,
    SelectMultiBrandFirmComponent
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class AccessoryLibraryModule {
}
