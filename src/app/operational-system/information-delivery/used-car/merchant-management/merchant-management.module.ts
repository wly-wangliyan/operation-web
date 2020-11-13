import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
import { MerchantManagementRoutingModule } from './merchant-management-routing.module';
import { ShareModule } from '../../../../share/share.module';
import { NzButtonModule, NzTableModule, NzSpinModule } from 'ng-zorro-antd';
import { MerchantEditComponent } from './merchant-edit/merchant-edit.component';
import { MerchantManagementComponent } from './merchant-management.component';


@NgModule({
    declarations: [MerchantManagementComponent, MerchantListComponent, MerchantEditComponent],
    imports: [
        ShareModule,
        CommonModule,
        NzTableModule,
        NzButtonModule,
        NzSpinModule,
        MerchantManagementRoutingModule
    ]
})
export class MerchantManagementModule {
}
