import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegralRightsComponent } from './integral-rights.component';
import { CommonRulesComponent } from './common-rules/common-rules.component';
import { CustomRulesComponent } from './custom-rules/custom-rules.component';


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
  { path: '**', redirectTo: 'rights-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegralRightsRoutingModule { }
