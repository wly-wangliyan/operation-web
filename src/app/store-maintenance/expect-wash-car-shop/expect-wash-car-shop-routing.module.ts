import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { ExpectWashCarShopComponent } from './expect-wash-car-shop.component';
import { ExpectWashCarShopListComponent } from './expect-wash-car-shop-list/expect-wash-car-shop-list.component';

const routes: Routes = [
  {
    path: '', component: ExpectWashCarShopComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ExpectWashCarShopListComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpectWashCarShopRoutingModule { }
