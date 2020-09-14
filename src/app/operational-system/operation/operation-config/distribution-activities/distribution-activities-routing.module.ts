import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { DistributionActivitiesComponent } from './distribution-activities.component';
import { DistributionActivityListComponent } from './distribution-activity-list/distribution-activity-list.component';
import { DistributionActivityEditComponent } from './distribution-activity-edit/distribution-activity-edit.component';
import { DistributionActivityInfoComponent } from './distribution-activity-info/distribution-activity-info.component';

const routes: Routes = [{
    path: '', component: DistributionActivitiesComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'activity-list', pathMatch: 'full'},
        {path: 'activity-list', component: DistributionActivityListComponent},
        {path: 'activity-create', component: DistributionActivityEditComponent},
        {path: 'activity-edit/:activity_id', component: DistributionActivityEditComponent},
        {path: 'activity-detail/:activity_id/:activity_type', component: DistributionActivityInfoComponent},
        {path: '**', redirectTo: 'activity-list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DistributionActivitiesRoutingModule {
}
