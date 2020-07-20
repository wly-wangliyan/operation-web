import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushMessageManagementComponent } from './push-message-management.component';
import { PushMessageManagementRoutingModule } from './push-message-management-routing.module';


@NgModule({
    declarations: [PushMessageManagementComponent],
    imports: [
        CommonModule,
        PushMessageManagementRoutingModule,
    ]
})
export class PushMessageManagementModule {
}
