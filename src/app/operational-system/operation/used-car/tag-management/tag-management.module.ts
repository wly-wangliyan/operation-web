import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagManagementComponent } from './tag-management.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagManagementRoutingModule } from './tag-management-routing.module';


@NgModule({
    declarations: [TagManagementComponent, TagListComponent, TagEditComponent],
    imports: [
        CommonModule,
        TagManagementRoutingModule
    ]
})
export class TagManagementModule {
}
