import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from './main.component';
import {AuthGuardService} from '../../core/auth-guard.service';
import {RouteMonitorService} from '../../core/route-monitor.service';
import {HomeComponent} from './home/home.component';

const routes: Routes = [{
  path: '', component: MainComponent, canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {
      path: 'parking',
      loadChildren: () => import('../mx-parking/mx-parking.module').then(m => m.MxParkingModule),
    },
    {
      path: 'insurance',
      loadChildren: () => import('../insurance/insurance.module').then(m => m.InsuranceModule),
    },
    {
      path: 'maintenance',
      loadChildren: () => import('../maintenance/maintenance.module').then(m => m.MaintenanceModule),
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
