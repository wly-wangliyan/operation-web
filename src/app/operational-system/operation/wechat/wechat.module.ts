import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WechatRoutingModule } from './wechat-routing.module';
import { WechatComponent } from './wechat.component';


@NgModule({
  declarations: [WechatComponent],
  imports: [
    CommonModule,
    WechatRoutingModule
  ]
})
export class WechatModule { }
