import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { TopicComponent } from './topic.component';

const routes: Routes = [{
    path: '', component: TopicComponent,
    children: [
        {path: '', redirectTo: 'topic', pathMatch: 'full'},
        {
            path: 'topic',
            loadChildren: './topic-main/topic-main.module#TopicMainRoutingModule',
            canActivate: [AuthGuardService, RouteMonitorService]
        },
        {path: '**', redirectTo: 'topic', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class TopicRoutingModule {
}
