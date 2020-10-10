import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { IntegralRecordComponent } from './integral-record.component';
import { RecordListComponent } from './record-list/record-list.component';


const routes: Routes = [
    {
        path: '', component: IntegralRecordComponent,
        canActivate: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: RecordListComponent},
            {path: '**', redirectTo: 'list', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IntegralRecordRoutingModule {
}
