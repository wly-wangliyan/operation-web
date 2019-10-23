import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { ProductManagementComponent } from './product-management.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ExternalPreventService } from '../../../core/external-prevent.service';
import { ThirdProductListComponent } from './third-product-list/third-product-list.component';
import { ThirdProductDetailComponent } from './third-product-detail/third-product-detail.component';

const routes: Routes = [{
  path: '', component: ProductManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: ProductListComponent },
    { path: 'create', component: ProductCreateComponent },
    { path: 'edit/:product_id', component: ProductEditComponent },
    { path: 'detail/:product_id', component: ProductDetailComponent },
    { path: 'third-detail/:product_id/:add_status/:type', component: ThirdProductDetailComponent },
    { path: 'third-product', component: ThirdProductListComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];
// , canDeactivate: [ExternalPreventService]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagementRoutingModule { }
