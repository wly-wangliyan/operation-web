import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { MaintenanceManualRoutingModule } from './maintenance-manual-routing.module';
import { MaintenanceManualComponent } from './maintenance-manual.component';
import { ManualListComponent } from './manual-list/manual-list.component';
import { ManualEditComponent } from './manual-edit/manual-edit.component';


@NgModule({
  declarations: [MaintenanceManualComponent, ManualListComponent, ManualEditComponent],
  imports: [
    CommonModule,
    ShareModule,
    MaintenanceManualRoutingModule
  ]
})
export class MaintenanceManualModule { }
