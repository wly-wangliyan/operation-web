import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { UsedCarComponent } from './used-car.component';


const routes: Routes = [
    {
        path: '', component: UsedCarComponent,
        canActivate: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'company-management', pathMatch: 'full'},
            {
                path: 'company-management', /** 企业管理 */
                loadChildren: () => import('../used-car/company-management/company-management.module').then(m => m.CompanyManagementModule),
                canLoad: [AuthGuardService]
            }, {
                path: 'information-delivery-management', /** 信息发布 */
                loadChildren: () => import('../used-car/information-delivery-management/information-delivery-management.module').then(m => m.InformationDeliveryManagementModule),
                canLoad: [AuthGuardService]
            }, {
                path: 'tag-management', /** 标签管理 */
                loadChildren: () => import('../used-car/tag-management/tag-management.module').then(m => m.TagManagementModule),
                canLoad: [AuthGuardService]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsedCarRoutingModule {
}
