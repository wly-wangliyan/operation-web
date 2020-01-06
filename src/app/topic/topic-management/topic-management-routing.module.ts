import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { TopicManagementComponent } from './topic-management.component';
import { TopicListComponent } from './topic-list/topic-list.component';

const routes: Routes = [{
    path: '', component: TopicManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'topic-list', pathMatch: 'full'},
        {path: 'topic-list', component: TopicListComponent},
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TopicManagementRoutingModule {
}
