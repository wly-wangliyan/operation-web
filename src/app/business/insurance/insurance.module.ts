import { NgModule } from '@angular/core';
import { ShareModule } from '../../share/share.module';
import { InsuranceRoutingModule } from './insurance-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { BrokerageCompanyManagementComponent } from './brokerage-company-management/brokerage-company-management.component';
import { InsuranceCompanyManagementComponent } from './insurance-company-management/insurance-company-management.component';
import { InsuranceComponent } from './insurance.component';
import { InsuranceCompanyListComponent } from './insurance-company-management/insurance-company-list/insurance-company-list.component';
import { InsuranceCompanyEditComponent } from './insurance-company-management/insurance-company-edit/insurance-company-edit.component';
import { BrokerageCompanyListComponent } from './brokerage-company-management/brokerage-company-list/brokerage-company-list.component';
import { BrokerageCompanyEditComponent } from './brokerage-company-management/brokerage-company-edit/brokerage-company-edit.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const uploadToken: UploadConfig = {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park'
};

@NgModule({
    imports: [
        ShareModule,
        InsuranceRoutingModule,
        DragDropModule,
        HttpClientModule,
    ],
    declarations: [
        InsuranceComponent,
        InsuranceCompanyManagementComponent,
        BrokerageCompanyManagementComponent,
        InsuranceCompanyListComponent,
        InsuranceCompanyEditComponent,
        BrokerageCompanyListComponent,
        BrokerageCompanyEditComponent
    ],
    providers: [{
        provide: UPLOAD_TOKEN,
        useValue: uploadToken
    },
        UploadService]
})
export class InsuranceModule {
}
