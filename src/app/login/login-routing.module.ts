import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { LoginComponent } from './login.component';

const routes: Routes = [
    {
        path: 'login', component: LoginComponent,
        canActivate: [AuthGuardService, RouteMonitorService]
    },
    {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {
}
