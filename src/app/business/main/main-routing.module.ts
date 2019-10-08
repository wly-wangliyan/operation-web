import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '', component: MainComponent, canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
      path: 'operation',
      loadChildren: () => import('../operation/operation.module').then(m => m.OperationModule),
    },
    {
      path: 'insurance',
      loadChildren: () => import('../insurance/insurance.module').then(m => m.InsuranceModule),
    },
    {
      path: 'maintenance',
      loadChildren: () => import('../maintenance/maintenance.module').then(m => m.MaintenanceModule),
    },
    {
      path: 'ticket',
      loadChildren: () => import('../ticket/ticket.module').then(m => m.TicketModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
