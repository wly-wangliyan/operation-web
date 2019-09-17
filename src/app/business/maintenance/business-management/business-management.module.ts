import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { BusinessManagementRoutingModule } from './business-management-routing.module';
import { BusinessManagementComponent } from './business-management.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessEditComponent } from './business-edit/business-edit.component';
import { OperationConfigurationComponent } from './operation-configuration/operation-configuration.component';
import { OperationConfigurationDetailComponent } from './operation-configuration/operation-configuration-detail/operation-configuration-detail.component';
import { OperationConfigurationEditComponent } from './operation-configuration/operation-configuration-edit/operation-configuration-edit.component';
import { ChooseAccessoryComponent } from './operation-configuration/operation-configuration-edit/choose-accessory/choose-accessory.component';
import { CreateAccessoryComponent } from './operation-configuration/operation-configuration-edit/create-accessory/create-accessory.component';

@NgModule({
  declarations: [
    BusinessManagementComponent,
    BusinessListComponent,
    BusinessEditComponent,
    OperationConfigurationComponent,
    OperationConfigurationDetailComponent,
    OperationConfigurationEditComponent,
    ChooseAccessoryComponent,
    CreateAccessoryComponent],
  imports: [
    ShareModule,
    CommonModule,
    BusinessManagementRoutingModule
  ]
})
export class BusinessManagementModule { }
