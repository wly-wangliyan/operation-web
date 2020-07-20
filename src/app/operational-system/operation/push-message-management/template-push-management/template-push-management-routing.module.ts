import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { TemplatePushManagementComponent } from './template-push-management.component';
import { TemplatePushListComponent } from './template-push-list/template-push-list.component';
import { TemplatePushEditComponent } from './template-push-edit/template-push-edit.component';
import { TemplatePushDetailComponent } from './template-push-detail/template-push-detail.component';

const routes: Routes = [{
    path: '', component: TemplatePushManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'template-push-list', pathMatch: 'full'},
        {path: 'template-push-list', component: TemplatePushListComponent},
        {path: 'template-push-create', component: TemplatePushEditComponent},
        {path: 'template-push-edit/:push_plan_id', component: TemplatePushEditComponent},
        {path: 'template-push-detail/:push_plan_id', component: TemplatePushDetailComponent},
        {path: '**', redirectTo: 'template-push-list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplatePushManagementRoutingModule {
}
