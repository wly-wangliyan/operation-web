
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { WorkFeesManagementRoutingModule } from './work-fees-management-routing.module';
import { WorkFeesManagementComponent } from './work-fees-management.component';
import { WorkFeesListComponent } from './work-fees-list/work-fees-list.component';
import { WorkFeesManagementService } from './work-fees-management.service';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    WorkFeesManagementRoutingModule,
  ],
  declarations: [
    WorkFeesManagementComponent,
    WorkFeesListComponent,
  ],
  providers: [
    WorkFeesManagementService,
  ]
})
export class WorkFeesManagementModule {
}
