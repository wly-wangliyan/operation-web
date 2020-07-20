import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateManagementComponent } from './template-management.component';


const routes: Routes = [{
    path: '', component: TemplateManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'template-list', pathMatch: 'full'},
        {path: 'template-list', component: TemplateListComponent},
        {path: '**', redirectTo: 'template-list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplateManagementRoutingModule {
}
