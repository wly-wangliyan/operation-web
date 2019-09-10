import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductLibraryComponent } from './product-library.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCreateComponent } from './product-create/product-create.component';

const routes: Routes = [
  {
    path: '', component: ProductLibraryComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ProductListComponent },
      { path: 'create', component: ProductCreateComponent },
      { path: 'edit/:product_id', component: ProductCreateComponent },
      { path: 'detail/:product_id', component: ProductDetailComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductLibraryRoutingModule { }
