import { NgModule } from '@angular/core';
import { ShareModule } from '../../../share/share.module';
import { MxParkingRoutingModule } from './mx-parking-routing.module';
import { MxParkingComponent } from './mx-parking.component';
import { FirstPageIconComponent } from './first-page-icon/first-page-icon-list/first-page-icon.component';
import { AppListComponent } from './version-management/app-list/app-list.component';
import { FirstPageIconEditComponent } from './first-page-icon/first-page-icon-edit/first-page-icon-edit.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { VersionListComponent } from './version-management/version-list/version-list.component';
import { AppAddComponent } from './version-management/app-add/app-add.component';
import { VersionAddComponent } from './version-management/version-add/version-add.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../../core/upload.service';
import { environment } from '../../../../environments/environment';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FirstPageIconListChildrenComponent } from './first-page-icon/first-page-icon-list-children/first-page-icon-list-children.component';

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  imports: [
    ShareModule,
    MxParkingRoutingModule,
    ColorPickerModule,
    DragDropModule,
    HttpClientModule,
    NzTableModule,
    NzButtonModule
  ],
  declarations: [
    MxParkingComponent, FirstPageIconComponent, AppListComponent, FirstPageIconEditComponent,
    VersionListComponent, AppAddComponent, VersionAddComponent, FirstPageIconListChildrenComponent
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class MxParkingModule {
}
