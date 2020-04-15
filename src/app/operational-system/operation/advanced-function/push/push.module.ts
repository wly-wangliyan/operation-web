import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { PushRoutingModule } from './push-routing.module';
import { PushListComponent } from './push-list/push-list.component';
import { PushComponent } from './push.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AddPushComponent } from './add-push/add-push.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
@NgModule({
  declarations: [PushListComponent, PushComponent, AddPushComponent],
  imports: [
    CommonModule,
    PushRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzRadioModule,
    NzCheckboxModule,
    NzSpinModule,
    NzDatePickerModule
  ]
})
export class PushModule { }
