import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { IntegralMallRoutingModule } from './integral-mall-routing.module';
import { IntegralMallComponent } from './integral-mall.component';
import { StatisticDetailComponent } from './statistic-detail/statistic-detail.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';


@NgModule({
  declarations: [IntegralMallComponent, StatisticDetailComponent],
  imports: [
    CommonModule,
    IntegralMallRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzRadioModule,
    NzSwitchModule,
    NzCheckboxModule
  ]
})
export class IntegralMallModule { }
