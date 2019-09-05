import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/core/auth-guard.service';
import { RouteMonitorService } from 'src/app/core/route-monitor.service';
import { ProjectManagemantComponent } from './project-managemant.component';
import { ProjectListComponent } from './project-list/project-list.component';



const routes: Routes = [
  {
    path: '', component: ProjectManagemantComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ProjectListComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagemantRoutingModule { }
