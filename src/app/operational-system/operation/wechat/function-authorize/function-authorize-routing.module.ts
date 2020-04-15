import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { FunctionAuthorizeListComponent } from './function-authorize-list/function-authorize-list.component';
import { FunctionAuthorizeComponent } from './function-authorize.component';

const routes: Routes = [
  {
    path: '', component: FunctionAuthorizeComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: FunctionAuthorizeListComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionAuthorizeRoutingModule { }
