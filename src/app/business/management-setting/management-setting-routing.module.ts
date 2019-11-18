import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { AuthGuardService } from '../../core/auth-guard.service';
import { ManagementSettingComponent } from './management-setting.component';
import { HomeComponent } from '../main/home/home.component';
import { MenuGuardService } from '../../core/menu-guard.service';

const routes: Routes = [{
  path: '', component: ManagementSettingComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
  children: [
    /*{ path: '', redirectTo: 'employees', pathMatch: 'full' },*/
    {path: 'home', component: HomeComponent},
    {
      path: 'employees', /** 用户管理 */
      loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule),
      canLoad: [AuthGuardService]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementSettingRoutingModule { }
