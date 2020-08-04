import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyManagementComponent } from './company-management.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyManagementRoutingModule } from './company-management-routing.module';


@NgModule({
    declarations: [CompanyManagementComponent, CompanyListComponent],
    imports: [
        CommonModule,
        CompanyManagementRoutingModule
    ]
})
export class CompanyManagementModule {
}
