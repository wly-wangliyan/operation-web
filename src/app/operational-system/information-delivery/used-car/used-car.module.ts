import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsedCarComponent } from './used-car.component';
import { UsedCarRoutingModule } from './used-car-routing.module';


@NgModule({
    declarations: [UsedCarComponent],
    imports: [
        CommonModule,
        UsedCarRoutingModule,
    ]
})
export class UsedCarModule {
}
