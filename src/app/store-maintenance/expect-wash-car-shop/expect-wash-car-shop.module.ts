import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpectWashCarShopComponent } from './expect-wash-car-shop.component';
import { ExpectWashCarShopListComponent } from './expect-wash-car-shop-list/expect-wash-car-shop-list.component';
import { ExpectWashCarShopRoutingModule } from './expect-wash-car-shop-routing.module';
import { ShareModule } from '../../share/share.module';
import { NzButtonModule, NzDatePickerModule, NzTableModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [ExpectWashCarShopComponent, ExpectWashCarShopListComponent],
  imports: [
    CommonModule,
    ExpectWashCarShopRoutingModule,
    ShareModule,
    NzDatePickerModule,
    NzTableModule,
    NzButtonModule
  ]
})
export class ExpectWashCarShopModule { }
