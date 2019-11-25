import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { AccessoryLibraryRoutingModule } from './accessory-library-routing.module';
import { AccessoryLibraryComponent } from './accessory-library.component';
import { AccessoryListComponent } from './accessory-list/accessory-list.component';
import { AccessoryEditComponent } from './accessory-edit/accessory-edit.component';
import { AccessoryLibraryService } from './accessory-library.service';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    AccessoryLibraryRoutingModule,
  ],
  declarations: [
    AccessoryLibraryComponent,
    AccessoryListComponent,
    AccessoryEditComponent,
  ],
  providers: [
    AccessoryLibraryService,
  ]
})
export class AccessoryLibraryModule {
}
