
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { WorkFeesManagementRoutingModule } from './work-fees-management-routing.module';
import { WorkFeesManagementComponent } from './work-fees-management.component';
import { WorkFeesListComponent } from './work-fees-list/work-fees-list.component';
import { WorkFeesManagementService } from './work-fees-management.service';
import { WorkFeesEditComponent } from './work-fees-edit/work-fees-edit.component';
import { ChooseProjectComponent } from './work-fees-edit/choose-project/choose-project.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
@NgModule({
  imports: [
    NzFormModule,
    NzTabsModule,
    NzTableModule,
    NzGridModule,
    CommonModule,
    ShareModule,
    WorkFeesManagementRoutingModule,
  ],
  declarations: [
    WorkFeesManagementComponent,
    WorkFeesListComponent,
    WorkFeesEditComponent,
    ChooseProjectComponent
  ],
  providers: [
    WorkFeesManagementService,
  ]
})
export class WorkFeesManagementModule {
}
