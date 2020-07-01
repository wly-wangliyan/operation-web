import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { IntegralMallComponent } from './integral-mall.component';
import { StatisticDetailComponent } from './statistic-detail/statistic-detail.component';


const routes: Routes = [
  {
    path: '', component: IntegralMallComponent,
    canActivate: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list', component: StatisticDetailComponent
      },
      {
        path: 'statistic-detail', component: StatisticDetailComponent
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
