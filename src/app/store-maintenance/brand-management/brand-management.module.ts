import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { BrandManagementRoutingModule } from './brand-management-routing.module';
import { BrandManagementComponent } from './brand-management.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { BrandManagementHttpService } from './brand-management-http.service';
import { BrandEditComponent } from './brand-list/brand-edit/brand-edit.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    NzTableModule,
    CommonModule,
    ShareModule,
    BrandManagementRoutingModule,
    NzButtonModule
  ],
  declarations: [
    BrandManagementComponent,
    BrandListComponent,
    BrandEditComponent,
  ],
  providers: [
    BrandManagementHttpService,
  ]
})
export class BrandManagementModule {
}
