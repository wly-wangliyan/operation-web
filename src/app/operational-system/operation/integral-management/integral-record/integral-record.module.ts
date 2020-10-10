import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegralRecordComponent } from './integral-record.component';
import { IntegralRecordRoutingModule } from './integral-record-routing.module';
import { ShareModule } from '../../../../share/share.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { RecordListComponent } from './record-list/record-list.component';


@NgModule({
    declarations: [IntegralRecordComponent, RecordListComponent],
    imports: [
        CommonModule,
        ShareModule,
        NzTableModule,
        NzButtonModule,
        NzDatePickerModule,
        IntegralRecordRoutingModule,
    ]
})
export class IntegralRecordModule {
}
