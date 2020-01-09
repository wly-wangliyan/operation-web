import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuckDrawComponent } from './luck-draw.component';
import { LuckDrawRoutingModule } from './luck-draw-routing.module';
import { ShareModule } from '../../../../share/share.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LuckDrawListComponent } from './luck-draw-list/luck-draw-list.component';
import { LuckDrawEditComponent } from './luck-draw-edit/luck-draw-edit.component';
import { LuckDrawRecordComponent } from './luck-draw-record/luck-draw-record.component';
import { NzCheckboxModule, NzDatePickerModule, NzRadioModule, NzSwitchModule } from 'ng-zorro-antd';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PrizeCreateComponent } from './luck-draw-edit/prize-create/prize-create.component';
import { ChooseCommodityComponent } from './luck-draw-edit/prize-create/choose-commodity/choose-commodity.component';

@NgModule({
  declarations: [
      LuckDrawComponent,
      LuckDrawListComponent,
      LuckDrawEditComponent,
      LuckDrawRecordComponent,
      PrizeCreateComponent,
      ChooseCommodityComponent,
  ],
    imports: [
        CommonModule,
        ShareModule,
        NzTableModule,
        NzButtonModule,
        LuckDrawRoutingModule,
        NzSwitchModule,
        NzRadioModule,
        NzDatePickerModule,
        NzCheckboxModule,
        NzIconModule,
    ]
})
export class LuckDrawModule { }
