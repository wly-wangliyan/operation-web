import { Component } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';
import { DistributionActivitiesService, SearchParamsActivityDailyEntity } from '../../distribution-activities.service';
import { DisabledTimeHelper } from '../../../../../../../utils/disabled-time-helper';

@Component({
    selector: 'app-business-list',
    templateUrl: './business-list.component.html',
    styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements NzSearchAdapter {
    public start_time: any = '';
    public end_time: any = '';
    public searchParams: SearchParamsActivityDailyEntity = new SearchParamsActivityDailyEntity(); // 条件筛选参数
    public nzSearchAssistant: NzSearchAssistant;
    private activity_id = '';
    private merchant_id = '';

    constructor(private globalService: GlobalService,
                private distributionActivitiesService: DistributionActivitiesService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        // this.nzSearchAssistant.submitSearch(true);
    }

    // 上架开始时间的禁用部分
    public disabledStartDate = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledFutureStartTime(startValue, this.end_time);
    };

    // 上架结束时间的禁用部分
    public disabledEndDate = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledFutureEndTime(endValue, this.start_time);
    };


    /**
     * 打开
     */
    public open(activity_id: string, merchant_id: string) {
        this.activity_id = activity_id;
        this.merchant_id = merchant_id;
        this.searchParams = new SearchParamsActivityDailyEntity();
        this.nzSearchAssistant.nzData = [];
        // this.selectedMerchant = selectedMerchant.clone();
        timer(0).subscribe(() => {
            $('#businessListModal').modal();
            this.nzSearchAssistant.submitSearch(true);
        });
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.distributionActivitiesService.requestActivityBusinessDailyData(this.searchParams, this.activity_id, this.merchant_id);
    }

    public continueSearch(url: string): any {
        return this.distributionActivitiesService.continueActivityBusinessDailyData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
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
