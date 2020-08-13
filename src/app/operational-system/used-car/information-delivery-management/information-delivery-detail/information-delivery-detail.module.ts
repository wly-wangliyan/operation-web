import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationDeliveryDetailComponent } from './information-delivery-detail.component';
import { ShareModule } from '../../../../share/share.module';
import { NzButtonModule, NzCheckboxModule, NzDatePickerModule, NzRadioModule, NzSpinModule } from 'ng-zorro-antd';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';


@NgModule({
    declarations: [
        InformationDeliveryDetailComponent,
    ],
    imports: [
        CommonModule,
        ShareModule,
        NzButtonModule,
        NzDatePickerModule,
        NzRadioModule,
        NzCheckboxModule,
        NzSpinModule,
        NzInputModule,
        NzTreeModule,
        NzAnchorModule,
    ]
})
export class InformationDeliveryDetailModule {
}
