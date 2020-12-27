import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { HomeComponent } from './home/home.component';
import { MenuGuardService } from '../../core/menu-guard.service';

const routes: Routes = [{
    path: '', component: MainComponent, canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
    children: [
        {path: '', redirectTo: 'operation', pathMatch: 'full'},
        // { path: 'home', component: HomeComponent },
        {
            path: 'operation',
            loadChildren: () => import('../operation/operation.module').then(m => m.OperationModule),
        },
        {
            path: 'insurance',
            loadChildren: () => import('../insurance/insurance.module').then(m => m.InsuranceModule),
        },
        {
            path: 'maintenance',
            loadChildren: () => import('../maintenance/maintenance.module').then(m => m.MaintenanceModule),
        },
        {
            path: 'ticket',
            loadChildren: () => import('../ticket/ticket.module').then(m => m.TicketModule)
        },
        {
            path: 'mall',
            loadChildren: () => import('../mall/mall.module').then(m => m.MallModule)
        },
        {
            path: 'notice-center',
            loadChildren: () => import('../notice-center/notice-center.module').then(m => m.NoticeCenterModule)
        },
        {
            path: 'management-setting',
            loadChildren: () => import('../management-setting/management-setting.module').then(m => m.ManagementSettingModule)
        }, {
            path: 'used-car',
            loadChildren: () => import('../used-car/used-car.module').then(m => m.UsedCarModule),
            canLoad: [AuthGuardService]
        },
        {path: '**', redirectTo: 'operation', pathMatch: 'full'},
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule {
}
