import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitySettingsRoutingModule } from './activity-settings-routing.module';
import { ActivitySettingsComponent } from './activity-settings.component';
import { ActivitySettingsListComponent } from './activity-settings-list/activity-settings-list.component';
import { WashCarEditComponent } from './activity-settings-list/wash-car-edit/wash-car-edit.component';
import { ShareModule } from '../../share/share.module';
import { NzButtonModule, NzCheckboxModule, NzFormModule, NzGridModule, NzRadioModule } from 'ng-zorro-antd';
import { ServiceFeesManagementRoutingModule } from '../service-fees-management/service-fees-management-routing.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { StoreShareModule } from '../share/store-share.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { ActivitySettingsService } from './activity-settings.service';

const uploadToken: UploadConfig = {
    img_config: {
        reportProcess: true,
        url: `${environment.STORAGE_DOMAIN}/storages/images`,
        source: 'activity'
    }
};


@NgModule({
    declarations: [ActivitySettingsComponent, ActivitySettingsListComponent, WashCarEditComponent],
    imports: [
        CommonModule,
        ActivitySettingsRoutingModule,
        ShareModule,
        NzRadioModule,
        NzFormModule,
        NzButtonModule,
        NzGridModule,
        NzTabsModule,
        NzTableModule,
        NzInputModule,
        NzSwitchModule,
        NzSpinModule,
        StoreShareModule,
        NzDatePickerModule,
        NzCheckboxModule
    ],
    providers: [
        {
            provide: UPLOAD_TOKEN,
            useValue: uploadToken
        },
        UploadService,
        ActivitySettingsService
    ]
})
export class ActivitySettingsModule {
}
