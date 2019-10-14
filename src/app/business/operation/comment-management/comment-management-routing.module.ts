import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { CommentManagementComponent } from './comment-management.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { CommentCreateComponent } from './comment-create/comment-create.component';
import { CommentSettingComponent } from './comment-setting/comment-setting.component';

const routes: Routes = [{
  path: '', component: CommentManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'comment-list', pathMatch: 'full' },
    { path: 'comment-list', component: CommentListComponent },
    { path: 'comment-detail', component: CommentDetailComponent },
    { path: 'comment-create', component: CommentCreateComponent },
    { path: 'comment-setting', component: CommentSettingComponent },
    { path: '**', redirectTo: 'comment-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentManagementRoutingModule {
}
