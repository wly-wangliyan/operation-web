import {NgModule} from '@angular/core';
import {ShareModule} from '../../share/share.module';
import {MxParkingRoutingModule} from './mx-parking-routing.module';
import { MxParkingComponent } from './mx-parking.component';
import { FirstPageIconComponent } from './first-page-icon/first-page-icon-list/first-page-icon.component';
import { VersionManagementComponent } from './version-management/version-management-list/version-management.component';
import { FirstPageIconEditComponent } from './first-page-icon/first-page-icon-edit/first-page-icon-edit.component';

@NgModule({
  imports: [
    ShareModule,
    MxParkingRoutingModule,
  ],
  declarations: [
    MxParkingComponent, FirstPageIconComponent, VersionManagementComponent, FirstPageIconEditComponent
  ]
})
export class MxParkingModule {
}
