import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { UsedCarComponent } from './used-car.component';
import { MenuGuardService } from '../../core/menu-guard.service';
import { HomeComponent } from '../main/home/home.component';


const routes: Routes = [
    {
        path: '', component: UsedCarComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
        children: [
            {path: 'home', component: HomeComponent},
            {
                path: 'company-management', /** 企业管理 */
                loadChildren: () => import('./company-management/company-management.module').then(m => m.CompanyManagementModule),
                canLoad: [AuthGuardService]
            }, {
                path: 'information-delivery-management', /** 信息发布 */
                loadChildren: () => import('./information-delivery-management/information-delivery-management.module').then(m => m.InformationDeliveryManagementModule),
                canLoad: [AuthGuardService]
            }, {
                path: 'tag-management', /** 标签管理 */
                loadChildren: () => import('./tag-management/tag-management.module').then(m => m.TagManagementModule),
                canLoad: [AuthGuardService]
            },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsedCarRoutingModule {
}
