import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { AuthGuardService } from '../../core/auth-guard.service';
import { OperationComponent } from './operation.component';

const routes: Routes = [{
    path: '', component: OperationComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'parking', pathMatch: 'full'},
        {
            path: 'parking',
            loadChildren: () => import('./mx-parking/mx-parking.module').then(m => m.MxParkingModule),
            canLoad: [AuthGuardService]
        },
        {
            path: 'comment',
            loadChildren: () => import('./comment-management/comment-management.module').then(m => m.CommentManagementModule),
            canLoad: [AuthGuardService]
        },
        {
            path: 'mini-program',
            loadChildren: () => import('./mini-program/mini-program.module').then(m => m.MiniProgramModule),
            canLoad: [AuthGuardService]
        },
        {
            path: 'other-operation-config',
            loadChildren: () => import('./other-operation-config/other-operation-config.module').then(m => m.OtherOperationConfigModule),
            canLoad: [AuthGuardService]
        },
        {path: '**', redirectTo: 'parking', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OperationRoutingModule {
}
