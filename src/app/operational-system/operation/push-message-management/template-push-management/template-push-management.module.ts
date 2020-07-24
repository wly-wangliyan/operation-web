import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatePushManagementComponent } from './template-push-management.component';
import { TemplatePushListComponent } from './template-push-list/template-push-list.component';
import { TemplatePushEditComponent } from './template-push-edit/template-push-edit.component';
import { TemplatePushDetailComponent } from './template-push-detail/template-push-detail.component';
import { TemplatePushManagementRoutingModule } from './template-push-management-routing.module';
import { ShareModule } from '../../../../share/share.module';
import {
    NzButtonModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzRadioModule, NzSpinModule,
    NzSwitchModule, NzTableModule,
} from 'ng-zorro-antd';


@NgModule({
    declarations: [
        TemplatePushManagementComponent,
        TemplatePushListComponent,
        TemplatePushEditComponent,
        TemplatePushDetailComponent,
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
        TemplatePushManagementRoutingModule,
    ]
})

export class TemplatePushManagementModule {
}
