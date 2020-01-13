import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'topic-management',
    loadChildren: () => import('./topic-management/topic-management.module').then(m => m.TopicManagementModule),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**', redirectTo: 'home', pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule {
}
