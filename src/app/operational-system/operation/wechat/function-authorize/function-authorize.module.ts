import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionAuthorizeComponent } from './function-authorize.component';
import { FunctionAuthorizeListComponent } from './function-authorize-list/function-authorize-list.component';
import { FunctionAuthorizeRoutingModule } from './function-authorize-routing.module';
import { NzTableModule } from 'ng-zorro-antd';
import { ShareModule } from '../../../../share/share.module';



@NgModule({
  declarations: [FunctionAuthorizeComponent, FunctionAuthorizeListComponent],
    imports: [
        CommonModule,
        FunctionAuthorizeRoutingModule,
        NzTableModule,
        ShareModule
    ]
})
export class FunctionAuthorizeModule { }
