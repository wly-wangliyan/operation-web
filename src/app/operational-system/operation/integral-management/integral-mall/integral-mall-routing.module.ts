import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { IntegralMallComponent } from './integral-mall.component';


const routes: Routes = [
  {
    path: '', component: IntegralMallComponent,
    canActivate: [AuthGuardService, RouteMonitorService],
    children: [

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegralMallRoutingModule { }
