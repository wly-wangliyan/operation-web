import { Component, OnInit } from '@angular/core';
import { NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { environment } from '../../../../../../environments/environment';
import { IntegralRecordService, SearchIntegralRecordParams } from '../integral-record.service';

@Component({
    selector: 'app-record-list',
    templateUrl: './record-list.component.html',
    styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit {

    public searchParams: SearchIntegralRecordParams = new SearchIntegralRecordParams();
    public nzSearchAssistant: NzSearchAssistant;
    public exchange_start_time: any = '';
    public exchange_end_time: any = '';
    public order_start_time: any = '';
    public order_end_time: any = '';

    constructor(
        private globalService: GlobalService,
        private integralRecordService: IntegralRecordService) {
    }

    ngOnInit() {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    // // 数据导出
    // public onExport() {
    //     if (this.generateAndCheckParamsValid()) {
    //         let searchUrl = `${environment.EXEMPTION_DOMAIN}/exemption/orders/export?default=1`;
    //         const params = this.searchParams.json();
    //         delete params.page_num;
    //         delete params.page_size;
    //         for (const key in params) {
    //             if (params[key]) {
    //                 searchUrl += `&${key}=${params[key]}`;
    //             }
    //         }
    //         window.open(searchUrl);
    //     }
    // }

    // 开始时间的禁用部分
    public disabledExchangeStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.exchange_end_time);
    };

    // 结束时间的禁用部分
    public disabledExchangeEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.exchange_start_time);
    };

    // 开始时间的禁用部分
    public disabledOrderStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.order_end_time);
    };

    // 结束时间的禁用部分
    public disabledOrderEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.order_start_time);
    };

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.integralRecordService.requestIntegralRecordList(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.integralRecordService.continueIntegralRecordList(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        const cTime = new Date().getTime() / 1000;
        const sTime = this.exchange_start_time ? ((new Date(this.exchange_start_time).setSeconds(0, 0) / 1000)) : 0;
        const eTime = this.exchange_end_time ? ((new Date(this.exchange_end_time).setSeconds(0, 0) / 1000)) : cTime;
        if (sTime > eTime) {
            this.globalService.promptBox.open('兑换时间的开始时间应小于等于结束时间！', null, 2000, null, false);
            return false;
        }
        const sOrderTime = this.order_start_time ? ((new Date(this.order_start_time).setSeconds(0, 0) / 1000)) : 0;
        const eOrderTime = this.order_end_time ? ((new Date(this.order_end_time).setSeconds(0, 0) / 1000)) : cTime;
        if (sOrderTime > eOrderTime) {
            this.globalService.promptBox.open('下单时间的开始时间应小于等于结束时间！', null, 2000, null, false);
            return false;
        }
        this.searchParams.exchange_section = `${sTime},${eTime}`;
        this.searchParams.order_section = `${sOrderTime},${eOrderTime}`;
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(): any {
    }

}
