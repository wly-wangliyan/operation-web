import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsedCarComponent } from './used-car.component';
import { UsedCarRoutingModule } from './used-car-routing.module';
import { MainModule } from '../main/main.module';


@NgModule({
    declarations: [UsedCarComponent],
    imports: [
        CommonModule,
        UsedCarRoutingModule,
        MainModule,
    ]
})
export class UsedCarModule {
}
