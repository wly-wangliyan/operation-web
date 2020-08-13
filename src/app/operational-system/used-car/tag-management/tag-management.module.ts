import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagManagementComponent } from './tag-management.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagManagementRoutingModule } from './tag-management-routing.module';
import { ShareModule } from '../../../share/share.module';
import { NzButtonModule, NzDatePickerModule, NzSwitchModule, NzTableModule } from 'ng-zorro-antd';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TagCarListComponent } from './tag-car-list/tag-car-list.component';
import { InformationDeliveryDetailModule } from '../information-delivery-management/information-delivery-detail/information-delivery-detail.module';


@NgModule({
    declarations: [TagManagementComponent, TagListComponent, TagCarListComponent],
    imports: [
        ShareModule,
        CommonModule,
        NzTableModule,
        NzButtonModule,
        NzDatePickerModule,
        NzSwitchModule,
        DragDropModule,
        InformationDeliveryDetailModule,
        TagManagementRoutingModule
    ]
})
export class TagManagementModule {
}
