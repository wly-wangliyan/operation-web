import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { IntegralRightsRoutingModule } from './integral-rights-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { IntegralRightsComponent } from './integral-rights.component';
import { CommonRulesComponent } from './common-rules/common-rules.component';
import { CustomRulesComponent } from './custom-rules/custom-rules.component';
import { ValidDateConfigModalComponent } from './common-rules/valid-date-config-modal/valid-date-config-modal.component';
import { LimitConfigModalComponent } from './common-rules/limit-config-modal/limit-config-modal.component';
import { DatePickerModule } from '../../../../share/components/date-picker/date-picker.module';
import { EditRuleComponent } from './custom-rules/edit-rule/edit-rule.component';
import { IssueTimeModalComponent } from './common-rules/issue-time-modal/issue-time-modal.component';


@NgModule({
  declarations: [
    IntegralRightsComponent,
    CommonRulesComponent,
    CustomRulesComponent,
    ValidDateConfigModalComponent,
    LimitConfigModalComponent,
    EditRuleComponent,
    IssueTimeModalComponent],
  imports: [
    CommonModule,
    IntegralRightsRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzRadioModule,
    NzDatePickerModule,
    DatePickerModule
  ]
})
export class IntegralRightsModule { }
