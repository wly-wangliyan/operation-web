import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { OtherOperationConfigRoutingModule } from './other-operation-config-routing.module';
import { OtherOperationConfigComponent } from './other-operation-config.component';

@NgModule({
    imports: [
        CommonModule,
        ShareModule,
        OtherOperationConfigRoutingModule,
    ],
    declarations: [
        OtherOperationConfigComponent,
    ]
})
export class OtherOperationConfigModule {
}
