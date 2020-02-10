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
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { StoreShareModule } from '../share/store-share.module';
import { from } from 'rxjs';

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
    NzFormModule,
    NzTableModule,
    NzSwitchModule,
    NzInputModule,
    NzGridModule,
    NzAnchorModule,
    NzTreeModule,
    NzButtonModule,
    StoreShareModule,
    NzSpinModule
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
