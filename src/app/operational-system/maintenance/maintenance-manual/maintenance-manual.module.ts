import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { MaintenanceManualRoutingModule } from './maintenance-manual-routing.module';
import { MaintenanceManualComponent } from './maintenance-manual.component';
import { ManualListComponent } from './manual-list/manual-list.component';
import { ManualEditComponent } from './manual-edit/manual-edit.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
@NgModule({
  declarations: [MaintenanceManualComponent, ManualListComponent, ManualEditComponent],
  imports: [
    CommonModule,
    ShareModule,
    MaintenanceManualRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzSpinModule
  ]
})
export class MaintenanceManualModule { }
