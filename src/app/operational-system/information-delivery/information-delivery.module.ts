import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationDeliveryRoutingModule } from './information-delivery-routing.module';
import { MainModule } from '../main/main.module';
import { InformationDeliveryComponent } from './information-delivery.component';
import { SelectTagComponent } from './used-car/information-delivery-management/components/select-tag/select-tag.component';
import { ShareModule } from '../../share/share.module';
import { NzButtonModule, NzCheckboxModule } from 'ng-zorro-antd';


@NgModule({
    declarations: [InformationDeliveryComponent, SelectTagComponent],
    imports: [
        CommonModule,
        InformationDeliveryRoutingModule,
        MainModule,
        ShareModule,
        NzButtonModule,
        NzCheckboxModule,
    ],
    exports: [
        SelectTagComponent
    ]
})
export class InformationDeliveryModule {
}
