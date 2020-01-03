import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordListComponent } from './record-list/record-list.component';
import { ShareModule } from '../../../../share/share.module';
import { InterfaceDecorationEditComponent } from './interface-decoration-edit/interface-decoration-edit.component';
import { InterfaceDecorationComponent } from './interface-decoration.component';
import { InterfaceDecorationRoutingModule } from './interface-decoration-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
@NgModule({
  declarations: [InterfaceDecorationComponent,
    RecordListComponent,
    InterfaceDecorationEditComponent
  ],
  imports: [
    ShareModule,
    CommonModule,
    InterfaceDecorationRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzRadioModule,
    NzCarouselModule
  ]
})
export class InterfaceDecorationModule { }
