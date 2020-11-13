import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSpaceSellComponent } from './parking-space-sell.component';
import { ParkingSpaceSellRoutingModule } from './parking-space-sell-routing.module';
import { TagManagementComponent } from './tag-management/tag-management.component';
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


@NgModule({
    declarations: [ParkingSpaceSellComponent, TagManagementComponent],
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
        ParkingSpaceSellRoutingModule
    ]
})
export class ParkingSpaceSellModule {
}
