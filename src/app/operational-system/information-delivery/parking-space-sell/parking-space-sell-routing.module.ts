import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsedCarComponent } from '../used-car/used-car.component';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { MenuGuardService } from '../../../core/menu-guard.service';
import { ParkingSpaceSellComponent } from './parking-space-sell.component';
import { TagManagementComponent } from './tag-management/tag-management.component';


const routes: Routes = [
    {
        path: '', component: ParkingSpaceSellComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
        children: [{
            path: 'information-delivery-management', /** 信息发布 */
            loadChildren: () => import('./information-delivery-management/information-delivery-management.module').then(m => m.InformationDeliveryManagementModule),
            canLoad: [AuthGuardService]
        }, {
            path: 'tag-management', /** 标签管理 */
            component: TagManagementComponent,
        }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ParkingSpaceSellRoutingModule {
}
