import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { TopicManagementComponent } from './topic-management.component';
import { TopicListComponent } from './topic-list/topic-list.component';
import { EditTopicComponent } from './edit-topic/edit-topic.component';
import { ViewTopicComponent } from './view-topic/view-topic.component';

const routes: Routes = [{
    path: '', component: TopicManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        { path: '', redirectTo: 'topic-list', pathMatch: 'full' },
        { path: 'topic-list', component: TopicListComponent },
        { path: 'add-topic', component: EditTopicComponent },
        { path: 'edit-topic/:topic_id', component: EditTopicComponent },
        { path: 'view-topic/:topic_id', component: ViewTopicComponent }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TopicManagementRoutingModule {
}
