import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyManagementComponent } from './company-management.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyManagementRoutingModule } from './company-management-routing.module';
import { ShareModule } from '../../../share/share.module';
import { NzButtonModule, NzDatePickerModule, NzTableModule } from 'ng-zorro-antd';
import { CompanyEditComponent } from './company-edit/company-edit.component';


@NgModule({
    declarations: [CompanyManagementComponent, CompanyListComponent, CompanyEditComponent],
    imports: [
        ShareModule,
        CommonModule,
        NzTableModule,
        NzTableModule,
        NzButtonModule,
        NzDatePickerModule,
        CompanyManagementRoutingModule
    ]
})
export class CompanyManagementModule {
}
