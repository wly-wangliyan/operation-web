import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationDeliveryManagementRoutingModule } from './information-delivery-management-routing.module';
import { InformationDeliveryManagementComponent } from './information-delivery-management.component';
import { InformationDeliveryDetailComponent } from './information-delivery-detail/information-delivery-detail.component';
import { InformationDeliveryEditComponent } from './information-delivery-edit/information-delivery-edit.component';
import { InformationDeliveryListComponent } from './information-delivery-list/information-delivery-list.component';
import { ShareModule } from '../../../../share/share.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InformationDeliveryModule } from '../../information-delivery.module';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
    declarations: [
        InformationDeliveryManagementComponent,
        InformationDeliveryDetailComponent,
        InformationDeliveryEditComponent,
        InformationDeliveryListComponent
    ],
    imports: [
        CommonModule,
        ShareModule,
        InformationDeliveryManagementRoutingModule,
        NgZorroAntdModule,
        DragDropModule,
        InformationDeliveryModule
    ]
})
export class InformationDeliveryManagementModule {
}
