import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionActivitiesComponent } from './distribution-activities.component';
import { DistributionActivityListComponent } from './distribution-activity-list/distribution-activity-list.component';
import { DistributionActivityEditComponent } from './distribution-activity-edit/distribution-activity-edit.component';
import { ShareModule } from '../../../../share/share.module';
import { NzButtonModule, NzDatePickerModule, NzRadioModule, NzSpinModule, NzSwitchModule, NzTableModule } from 'ng-zorro-antd';
import { DistributionActivitiesRoutingModule } from './distribution-activities-routing.module';
import { DistributionActivityInfoComponent } from './distribution-activity-info/distribution-activity-info.component';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { DetailListComponent } from './components/detail-list/detail-list.component';
import { SelectBusinessComponent } from './components/select-business/select-business.component';



@NgModule({
  declarations: [DistributionActivitiesComponent, DistributionActivityListComponent, DistributionActivityEditComponent, DistributionActivityInfoComponent, BusinessListComponent, DetailListComponent, SelectBusinessComponent],
  imports: [
    ShareModule,
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzSwitchModule,
    NzSpinModule,
    NzDatePickerModule,
    NzRadioModule,
    DistributionActivitiesRoutingModule
  ]
})
export class DistributionActivitiesModule { }
