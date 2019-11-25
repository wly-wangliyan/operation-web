import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { StoreMaintenanceMainRoutingModule } from './store-maintenance-main-routing.module';
import { StoreMaintenanceMainComponent } from './store-maintenance-main.component';
import { MainModule } from '../../operational-system/main/main.module';

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        ColorPickerModule,
        StoreMaintenanceMainRoutingModule,
        MainModule
    ],
    declarations: [
        StoreMaintenanceMainComponent,
    ]
})
export class StoreMaintenanceMainModule {
}
