import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { RecordListComponent } from './record-list/record-list.component';
import { InterfaceDecorationEditComponent } from './interface-decoration-edit/interface-decoration-edit.component';
import { InterfaceDecorationComponent } from './interface-decoration.component';

const routes: Routes = [{
  path: '', component: InterfaceDecorationComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'record-list', pathMatch: 'full' },
    { path: 'record-list', component: RecordListComponent },
    { path: 'edit', component: InterfaceDecorationEditComponent },
    { path: 'edit/:page_id', component: InterfaceDecorationEditComponent },
    { path: '**', redirectTo: 'record-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfaceDecorationRoutingModule { }
