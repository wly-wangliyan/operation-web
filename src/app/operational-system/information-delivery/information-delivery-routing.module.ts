import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { MenuGuardService } from '../../core/menu-guard.service';
import { HomeComponent } from '../main/home/home.component';
import { InformationDeliveryComponent } from './information-delivery.component';


const routes: Routes = [
    {
        path: '', component: InformationDeliveryComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
        children: [
            {path: 'home', component: HomeComponent},
            {
                path: 'used-car', /** 二手车 */
                loadChildren: () => import('./used-car/used-car.module').then(m => m.UsedCarModule),
                canLoad: [AuthGuardService]
            }, {
                path: 'parking-space-sell', /** 车辆租售 */
                loadChildren: () => import('./parking-space-sell/parking-space-sell.module').then(m => m.ParkingSpaceSellModule),
                canLoad: [AuthGuardService]
            },
            {path: '**', redirectTo: 'home', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformationDeliveryRoutingModule {
}
