import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { AccessoryLibraryComponent } from './accessory-library.component';
import { AccessoryListComponent } from './accessory-list/accessory-list.component';
import { AccessoryEditComponent } from './accessory-edit/accessory-edit.component';

const routes: Routes = [
  {
    path: '', component: AccessoryLibraryComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: AccessoryListComponent },
      { path: 'edit/:accessory_id', component: AccessoryEditComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessoryLibraryRoutingModule {
}
