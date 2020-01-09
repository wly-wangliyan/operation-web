import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { LuckDrawComponent } from './luck-draw.component';
import { LuckDrawListComponent } from './luck-draw-list/luck-draw-list.component';
import { LuckDrawEditComponent } from './luck-draw-edit/luck-draw-edit.component';
import { LuckDrawRecordComponent } from './luck-draw-record/luck-draw-record.component';

const routes: Routes = [{
  path: '', component: LuckDrawComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: LuckDrawListComponent },
    { path: 'add', component: LuckDrawEditComponent },
    { path: 'edit', component: LuckDrawEditComponent },
    { path: 'record', component: LuckDrawRecordComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LuckDrawRoutingModule { }
