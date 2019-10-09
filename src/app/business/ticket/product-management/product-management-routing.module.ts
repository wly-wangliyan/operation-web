import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { ProductManagementComponent } from './product-management.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RoutePreventService } from '../../../core/route-prevent.service';

const routes: Routes = [{
  path: '', component: ProductManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'create', pathMatch: 'full' },
    { path: 'list', component: ProductListComponent },
    { path: 'create', component: ProductCreateComponent, canDeactivate: [RoutePreventService] },
    { path: 'edit', component: ProductEditComponent, canDeactivate: [RoutePreventService] },
    { path: 'detail', component: ProductDetailComponent, canDeactivate: [RoutePreventService] },
    { path: '**', redirectTo: 'create', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagementRoutingModule { }