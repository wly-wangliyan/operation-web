import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { MiniProgramRoutingModule } from './mini-program-routing.module';
import { MiniProgramComponent } from './mini-program.component';


@NgModule({
  declarations: [MiniProgramComponent],
  imports: [
    ShareModule,
    CommonModule,
    MiniProgramRoutingModule
  ]
})
export class MiniProgramModule { }
