import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationDeliveryManagementComponent } from './information-delivery-management.component';
import { InformationDeliveryListComponent } from './information-delivery-list/information-delivery-list.component';
import { InformationDeliveryDetailComponent } from './information-delivery-detail/information-delivery-detail.component';
import { InformationDeliveryEditComponent } from './information-delivery-edit/information-delivery-edit.component';
import { InformationDeliveryManagementRoutingModule } from './information-delivery-management-routing.module';
import { ShareModule } from '../../../share/share.module';
import {
    NzButtonModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzRadioModule,
    NzSpinModule,
    NzSwitchModule,
    NzTableModule
} from 'ng-zorro-antd';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SelectBrandComponent } from './components/select-brand/select-brand.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { ImageExampleComponent } from './components/image-example/image-example.component';
import { SelectTagComponent } from './components/select-tag/select-tag.component';
import { SelectMerchantComponent } from './components/select-merchant/select-merchant.component';


@NgModule({
    declarations: [
        InformationDeliveryManagementComponent,
        InformationDeliveryListComponent,
        InformationDeliveryDetailComponent,
        InformationDeliveryEditComponent,
        SelectBrandComponent,
        ImageExampleComponent,
        SelectTagComponent,
        SelectMerchantComponent,
        SelectMerchantComponent
    ],
    imports: [
        CommonModule,
        ShareModule,
        NzTableModule,
        NzButtonModule,
        NzDatePickerModule,
        NzSwitchModule,
        NzRadioModule,
        NzCheckboxModule,
        NzSpinModule,
        NzInputModule,
        NzTreeModule,
        NzAnchorModule,
        InformationDeliveryManagementRoutingModule,
    ]
})
export class InformationDeliveryManagementModule {
}
