import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { TagManagementComponent } from './tag-management.component';
import { TagListComponent } from './tag-list/tag-list.component';



const routes: Routes = [{
  path: '', component: TagManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    {path: '', redirectTo: 'tag-list', pathMatch: 'full'},
    {path: 'tag-list', component: TagListComponent},
    {path: '**', redirectTo: 'tag-list', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagManagementRoutingModule { }
