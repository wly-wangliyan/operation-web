import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { UserIntegralRoutingModule } from './user-integral-routing.module';
import { UserIntegralComponent } from './user-integral.component';
import { UserListComponent } from './user-list/user-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [UserIntegralComponent, UserListComponent],
  imports: [
    CommonModule,
    UserIntegralRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule
  ]
})
export class UserIntegralModule { }
