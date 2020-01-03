import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { CouponJumpRoutingModule } from './coupon-jump-routing.module';
import { CouponJumpComponent } from './coupon-jump.component';
import { CouponJumpListComponent } from './coupon-jump-list/coupon-jump-list.component';
import { CouponJumpHttpService } from './coupon-jump-http.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    CouponJumpRoutingModule,
    NzTableModule,
    NzButtonModule,
  ],
  declarations: [
    CouponJumpComponent,
    CouponJumpListComponent,
  ],
  providers: [
    CouponJumpHttpService,
  ]
})
export class CouponJumpModule {
}
