import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { BannerManagementComponent } from '../banner-management/banner-management.component';
import { BannerListComponent } from '../banner-management/banner-list/banner-list.component';


const routes: Routes = [{
  path: '', component: BannerManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'banner-list', pathMatch: 'full' },
    { path: 'banner-list', component: BannerListComponent },
    { path: '**', redirectTo: 'banner-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerManagementRoutingModule { }
