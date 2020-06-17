import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityBusinessComponent } from './activity-business.component';
import { ActivityBusinessListComponent } from './activity-business-list/activity-business-list.component';
import { ActivityBusinessRoutingModule } from './activity-business-routing.module';
import { NzButtonModule, NzCheckboxModule, NzDatePickerModule, NzRadioModule, NzTableModule } from 'ng-zorro-antd';
import { ShareModule } from '../../../../share/share.module';
import { ActivityBusinessEditComponent } from './activity-business-edit/activity-business-edit.component';
import { BusinessEditComponent } from './components/business-edit/business-edit.component';
import { BusinessChooseComponent } from './components/business-choose/business-choose.component';



@NgModule({
  declarations: [ActivityBusinessComponent, ActivityBusinessListComponent, ActivityBusinessEditComponent, BusinessEditComponent, BusinessChooseComponent],
    imports: [
        CommonModule,
        ActivityBusinessRoutingModule,
        NzTableModule,
        ShareModule,
        NzDatePickerModule,
        NzButtonModule,
        NzRadioModule,
        NzCheckboxModule,
    ]
})
export class ActivityBusinessModule { }
