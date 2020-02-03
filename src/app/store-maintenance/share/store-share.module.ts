import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WashCarTypePipe } from './pipes/wash-car-type.pipe';
import { ExpenseStatusPipe } from './pipes/expense-status.pipe';
import { OilTypePipe } from './pipes/oil-type.pipe';
import { WashCarCouponTypePipe } from './pipes/wash-car-coupon-type.pipe';
import { ArrivalOrderStatusPipe } from './pipes/arrival-order-status.pipe';
import { ProjectNamePipe } from './pipes/project-name.pipe';
import { SupplyTypePipe } from './pipes/supply-type.pipe';

@NgModule({
  declarations: [
    WashCarTypePipe,
    ExpenseStatusPipe,
    OilTypePipe,
    WashCarCouponTypePipe,
    ArrivalOrderStatusPipe,
    ProjectNamePipe,
    SupplyTypePipe
  ],
  exports: [
    WashCarTypePipe,
    ExpenseStatusPipe,
    OilTypePipe,
    WashCarCouponTypePipe,
    ArrivalOrderStatusPipe,
    ProjectNamePipe,
    SupplyTypePipe
  ],
  imports: [
    CommonModule
  ]
})
export class StoreShareModule { }
