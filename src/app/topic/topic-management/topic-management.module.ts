import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TopicManagementRoutingModule } from './topic-management-routing.module';
import { TopicManagementComponent } from './topic-management.component';
import { TopicManagementHttpService } from './topic-management-http.service';
import { TopicListComponent } from './topic-list/topic-list.component';

@NgModule({
    imports: [
        CommonModule,
        NzTableModule,
        NzDatePickerModule,
        NzButtonModule,
        NzSpinModule,
        ShareModule,
        TopicManagementRoutingModule,
    ],
    declarations: [
        TopicManagementComponent,
        TopicListComponent,
    ],
    providers: [
        TopicManagementHttpService,
    ]
})
export class TopicManagementModule {
}
