import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ServiceFeesManagementRoutingModule } from './service-fees-management-routing.module';
import { ServiceFeesManagementComponent } from './service-fees-management.component';
import { ServiceFeesListComponent } from './service-fees-list/service-fees-list.component';
import { ServiceFeesManagementService } from './service-fees-management.service';
import { RescueFeesEditComponent } from './rescue-fees-edit/rescue-fees-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    ServiceFeesManagementRoutingModule,
  ],
  declarations: [
    ServiceFeesManagementComponent,
    ServiceFeesListComponent,
    RescueFeesEditComponent,
  ],
  providers: [
    ServiceFeesManagementService,
  ]
})
export class ServiceFeesManagementModule {
}
