import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WashCarTypePipe } from './pipes/wash-car-type.pipe';
import { ExpenseStatusPipe } from './pipes/expense-status.pipe';
import { WashCarCouponTypePipe } from './pipes/wash-car-coupon-type.pipe';

@NgModule({
  declarations: [
    WashCarTypePipe,
    ExpenseStatusPipe,
    WashCarCouponTypePipe
  ],
  exports: [
    WashCarTypePipe,
    ExpenseStatusPipe,
    WashCarCouponTypePipe
  ],
  imports: [
    CommonModule
  ]
})
export class StoreShareModule { }
