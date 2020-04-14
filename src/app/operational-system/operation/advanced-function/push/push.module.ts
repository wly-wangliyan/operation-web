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
@NgModule({
  declarations: [PushListComponent, PushComponent],
  imports: [
    CommonModule,
    PushRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzRadioModule,
    NzCheckboxModule
  ]
})
export class PushModule { }
