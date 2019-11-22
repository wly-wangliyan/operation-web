import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { OperationalSystemComponent } from './operational-system.component';

const routes: Routes = [{
    path: '', component: OperationalSystemComponent,
    children: [
        {path: '', redirectTo: 'main', pathMatch: 'full'},
        {
            path: 'main',
            loadChildren: './main/main.module#MainModule',
            canActivate: [AuthGuardService, RouteMonitorService]
        },
        {path: '**', redirectTo: 'main', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class OperationalSystemRoutingModule {
}
