import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { IntegralMallComponent } from './integral-mall.component';
import { StatisticDetailComponent } from './statistic-detail/statistic-detail.component';
import { CommodityListComponent } from './commodity-list/commodity-list.component';
import { CommodityEditComponent } from './commodity-edit/commodity-edit.component';

const routes: Routes = [
  {
    path: '', component: IntegralMallComponent,
    canActivate: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list', component: CommodityListComponent
      },
      {
        path: 'add', component: CommodityEditComponent
      },
      {
        path: 'edit/:commodity_id/:commodity_type', component: CommodityEditComponent
      },
      {
        path: 'detail/:commodity_id/:commodity_type', component: CommodityEditComponent
      },
      {
        path: 'statistic-detail/:commodity_id', component: StatisticDetailComponent
      },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegralMallRoutingModule { }
