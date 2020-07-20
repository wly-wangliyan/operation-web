import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateManagementComponent } from './template-management.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateManagementRoutingModule } from './template-management-routing.module';
import { ShareModule } from '../../../../share/share.module';
import { NzButtonModule, NzDatePickerModule, NzTableModule } from 'ng-zorro-antd';


@NgModule({
    declarations: [
        TemplateManagementComponent,
        TemplateListComponent
    ],
    imports: [
        ShareModule,
        CommonModule,
        NzTableModule,
        NzTableModule,
        NzButtonModule,
        NzDatePickerModule,
        TemplateManagementRoutingModule,
    ]
})
export class TemplateManagementModule {
}
