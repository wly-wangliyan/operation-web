import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordListComponent } from './record-list/record-list.component';
import { ShareModule } from '../../../../share/share.module';
import { InterfaceDecorationEditComponent } from './interface-decoration-edit/interface-decoration-edit.component';
import { InterfaceDecorationComponent } from './interface-decoration.component';
import { InterfaceDecorationRoutingModule } from './interface-decoration-routing.module';

@NgModule({
  declarations: [InterfaceDecorationComponent,
                 RecordListComponent,
                 InterfaceDecorationEditComponent
  ],
  imports: [
    ShareModule,
    CommonModule,
    InterfaceDecorationRoutingModule
  ]
})
export class InterfaceDecorationModule { }
