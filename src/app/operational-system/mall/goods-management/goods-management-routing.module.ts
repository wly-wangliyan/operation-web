import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { GoodsManagementComponent } from './goods-management.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsCreateComponent } from './goods-create/goods-create.component';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { ClassifyManagementComponent } from './classify-management/classify-management.component';

const routes: Routes = [{
  path: '', component: GoodsManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: GoodsListComponent },
    { path: 'list/create', component: GoodsCreateComponent },
    { path: 'list/edit/:commodity_id', component: GoodsCreateComponent },
    { path: 'list/detail/:commodity_id', component: GoodsDetailComponent },
    { path: 'classify-list', component: ClassifyManagementComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsManagementRoutingModule {
}
