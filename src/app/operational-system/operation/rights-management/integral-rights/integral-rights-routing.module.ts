import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegralRightsComponent } from './integral-rights.component';
import { CommonRulesComponent } from './common-rules/common-rules.component';
import { CustomRulesComponent } from './custom-rules/custom-rules.component';
import { EditRuleComponent } from './custom-rules/edit-rule/edit-rule.component';


const routes: Routes = [
  { path: '', redirectTo: 'rights-list', pathMatch: 'full' },
  {
    path: 'rights-list', component: IntegralRightsComponent,
    children: [
      { path: '', redirectTo: 'common-rules', pathMatch: 'full' },
      {
        path: 'common-rules', /** 通用积分规则 */
        component: CommonRulesComponent
      },
      {
        path: 'custom-rules', /** 自定义积分规则 */
        component: CustomRulesComponent
      },
      { path: '**', redirectTo: 'common-rules', pathMatch: 'full' }
    ]
  },
  {
    path: 'add-custom-rule', /** 新建规则 */
    component: EditRuleComponent
  },
  {
    path: 'edit-custom-rule/:rule_id', /** 编辑规则 */
    component: EditRuleComponent
  },
  { path: '**', redirectTo: 'rights-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegralRightsRoutingModule { }
