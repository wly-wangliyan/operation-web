import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { UserIntegralRoutingModule } from './user-integral-routing.module';
import { UserIntegralComponent } from './user-integral.component';
import { UserListComponent } from './user-list/user-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { UserIntegralDetailComponent } from './user-integral-detail/user-integral-detail.component';


@NgModule({
  declarations: [
    UserIntegralComponent,
    UserListComponent,
    UserIntegralDetailComponent],
  imports: [
    CommonModule,
    UserIntegralRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzRadioModule
  ]
})
export class UserIntegralModule { }
