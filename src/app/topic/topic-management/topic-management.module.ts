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
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { EditTopicComponent } from './edit-topic/edit-topic.component';
import { ViewTopicComponent } from './view-topic/view-topic.component';

@NgModule({
    imports: [
        CommonModule,
        NzFormModule,
        NzTableModule,
        NzDatePickerModule,
        NzButtonModule,
        NzSpinModule,
        NzTabsModule,
        NzSwitchModule,
        ShareModule,
        TopicManagementRoutingModule,
    ],
    declarations: [
        TopicManagementComponent,
        TopicListComponent,
        EditTopicComponent,
        ViewTopicComponent,
    ],
    providers: [
        TopicManagementHttpService,
    ]
})
export class TopicManagementModule {
}
