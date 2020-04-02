import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { BannersComponent } from './banners.component';
import { BannerListComponent } from './banner-list/banner-list.component';
import { BannerConfigListComponent } from './banner-config-list/banner-config-list.component';
import { BannerContentListComponent } from './banner-content-list/banner-content-list.component';


const routes: Routes = [{
  path: '', component: BannersComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'banner-list', pathMatch: 'full' },
    { path: 'banner-list', component: BannerListComponent },
    { path: 'banner-config-list', component: BannerConfigListComponent },
    { path: 'banner-content-list/:banner_id', component: BannerContentListComponent },
    { path: '**', redirectTo: 'banner-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannersRoutingModule { }
