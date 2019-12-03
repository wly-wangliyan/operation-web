import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushListComponent } from './push-list/push-list.component';
import { PushEditComponent } from './push-edit/push-edit.component';
import { PushDetailComponent } from './push-detail/push-detail.component';
import { ShareModule } from '../../../../share/share.module';
import { PushManagementRoutingModule } from './push-management-routing.module';
import { PushManagementComponent } from './push-management.component';

@NgModule({
  declarations: [
    PushManagementComponent,
    PushListComponent,
    PushEditComponent,
    PushDetailComponent
  ],
  imports: [
    ShareModule,
    CommonModule,
    PushManagementRoutingModule
  ]
})
export class PushManagementModule { }
