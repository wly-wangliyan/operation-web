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
import { FormIconMagicComponent } from './interface-decoration-edit/form-icon-magic/form-icon-magic.component';
import { FormSingleRowBroadcastComponent } from './interface-decoration-edit/form-single-row-broadcast/form-single-row-broadcast.component';
import { FormLeftRightLayout1Component } from './interface-decoration-edit/form-left-right-layout1/form-left-right-layout1.component';
import { FormLeftRightLayout2Component } from './interface-decoration-edit/form-left-right-layout2/form-left-right-layout2.component';
import { FormSingleLineScrollComponent } from './interface-decoration-edit/form-single-line-scroll/form-single-line-scroll.component';
@NgModule({
  declarations: [InterfaceDecorationComponent,
    RecordListComponent,
    InterfaceDecorationEditComponent,
    FormIconMagicComponent,
    FormSingleRowBroadcastComponent,
    FormLeftRightLayout1Component,
    FormLeftRightLayout2Component,
    FormSingleLineScrollComponent
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
