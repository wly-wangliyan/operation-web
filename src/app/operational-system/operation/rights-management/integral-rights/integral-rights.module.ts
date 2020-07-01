import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { IntegralRightsRoutingModule } from './integral-rights-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { IntegralRightsComponent } from './integral-rights.component';
import { CommonRulesComponent } from './common-rules/common-rules.component';
import { CustomRulesComponent } from './custom-rules/custom-rules.component';


@NgModule({
  declarations: [IntegralRightsComponent, CommonRulesComponent, CustomRulesComponent],
  imports: [
    CommonModule,
    IntegralRightsRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzRadioModule
  ]
})
export class IntegralRightsModule { }
