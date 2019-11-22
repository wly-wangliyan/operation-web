import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { ThematicActivityRoutingModule } from './thematic-activity-routing.module';
import { ThematicActivityComponent } from './thematic-activity.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { ZPhonePreviewComponent } from './components/z-phone-preview/z-phone-preview.component';

@NgModule({
  declarations: [
    ThematicActivityComponent,
    ListComponent,
    EditComponent,
    DetailComponent,
    ZPhonePreviewComponent],
  imports: [
    ShareModule,
    CommonModule,
    ThematicActivityRoutingModule
  ]
})
export class ThematicActivityModule { }
