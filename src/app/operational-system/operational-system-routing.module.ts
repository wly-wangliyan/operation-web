import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './core/auth-guard.service';
import { AppComponent } from './app.component';
import { ZPromptBoxComponent } from './share/components/tips/z-prompt-box/z-prompt-box.component';
import { RouteMonitorService } from './core/route-monitor.service';

const routes: Routes = [
    { path: 'login', loadChildren: './business/login/login.module#LoginModule', canActivate: [AuthGuardService] },
    {
        path: '', component: AppComponent, children: [
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: 'main', loadChildren: './business/main/main.module#MainModule', canActivate: [AuthGuardService, RouteMonitorService] },
        { path: '**', redirectTo: 'main', pathMatch: 'full' }
    ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class OperationalSystemRoutingModule {
}
