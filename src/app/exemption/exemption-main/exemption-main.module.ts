import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../../operational-system/main/main.module';
import { ExemptionMainRoutingModule } from './exemption-main-routing.module';
import { ExemptionMainComponent } from './exemption-main.component';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  declarations: [ExemptionMainComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ExemptionMainRoutingModule,
    MainModule,
    ColorPickerModule
  ]
})
export class ExemptionMainModule { }
