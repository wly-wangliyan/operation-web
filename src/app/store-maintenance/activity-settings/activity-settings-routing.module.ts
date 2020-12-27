import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandManagementComponent } from '../brand-management/brand-management.component';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { BrandListComponent } from '../brand-management/brand-list/brand-list.component';
import { ActivitySettingsComponent } from './activity-settings.component';
import { ActivitySettingsListComponent } from './activity-settings-list/activity-settings-list.component';


const routes: Routes = [
  {
    path: '', component: ActivitySettingsComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', component: ActivitySettingsListComponent},
      {path: '**', redirectTo: 'list', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitySettingsRoutingModule { }
