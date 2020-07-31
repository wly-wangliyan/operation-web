import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { MxParkingComponent } from './mx-parking.component';
import { FirstPageIconComponent } from './first-page-icon/first-page-icon-list/first-page-icon.component';
import { AppListComponent } from './version-management/app-list/app-list.component';
import { VersionListComponent } from './version-management/version-list/version-list.component';
import { FirstPageIconListChildrenComponent } from './first-page-icon/first-page-icon-list-children/first-page-icon-list-children.component';

const routes: Routes = [{
    path: '', component: MxParkingComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'first-page-icon', pathMatch: 'full'},
        {path: 'first-page-icon', component: FirstPageIconComponent},
        {path: 'first-page-icon-list/:application_id/:menu_business_key_id', component: FirstPageIconListChildrenComponent},
        {path: 'version-management', component: AppListComponent},
        {path: 'version-management/version-list', component: VersionListComponent},
        {path: '**', redirectTo: 'first-page-icon', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MxParkingRoutingModule {
}
