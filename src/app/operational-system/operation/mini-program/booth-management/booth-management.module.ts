import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ShareModule } from '../../../../share/share.module';
import { BoothManagementRoutingModule } from './booth-management-routing.module';
import { BoothManagementComponent } from './booth-management.component';
import { BoothConfigListComponent } from './booth-config-list/booth-config-list.component';
import { BoothConfigEditComponent } from './booth-config-edit/booth-config-edit.component';
import { BoothContentListComponent } from './booth-content-list/booth-content-list.component';
import { BoothContentEditComponent } from './booth-content-edit/booth-content-edit.component';
import { BoothListComponent } from './booth-list/booth-list.component';
import { BoothTypePipe } from './pipes/booth-type.pipe';
import { FormatPipe } from './pipes/format.pipe';
import { LinkTypePipe } from './pipes/link-type.pipe';
import { BoothContentDetailComponent } from './booth-content-detail/booth-content-detail.component';


@NgModule({
  declarations: [
    BoothManagementComponent,
    BoothConfigListComponent,
    BoothConfigEditComponent,
    BoothContentListComponent,
    BoothContentEditComponent,
    BoothListComponent,
    BoothTypePipe,
    FormatPipe,
    LinkTypePipe,
    BoothContentDetailComponent
  ],
  imports: [
    CommonModule,
    BoothManagementRoutingModule,
    ShareModule,
    DragDropModule,
    NzTableModule,
    NzButtonModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzCheckboxModule
  ]
})
export class BoothManagementModule { }
