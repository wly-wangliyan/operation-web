import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        ColorPickerModule
    ],
    declarations: [
        MainComponent,
        HomeComponent
    ]
})
export class MainModule {
}
