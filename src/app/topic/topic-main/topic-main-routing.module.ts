import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { MenuGuardService } from '../../core/menu-guard.service';
import { HomeComponent } from '../../operational-system/main/home/home.component';
import { TopicMainComponent } from './topic-main.component';

const routes: Routes = [{
    path: '', component: TopicMainComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
    children: [
        {path: 'home', component: HomeComponent},
        {path: '**', redirectTo: 'home', pathMatch: 'full'},
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TopicMainRoutingModule {
}
