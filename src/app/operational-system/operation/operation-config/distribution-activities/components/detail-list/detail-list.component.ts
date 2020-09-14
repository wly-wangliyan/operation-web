import { Component } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../../share/nz-search-assistant';
import {
    MerchantManagementEntity,
    MerchantManagementService,
    SearchParamsEntity
} from '../../../../../used-car/merchant-management/merchant-management.service';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';
import { DistributionActivitiesService, SearchParamsActivityDailyEntity } from '../../distribution-activities.service';

@Component({
    selector: 'app-detail-list',
    templateUrl: './detail-list.component.html',
    styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent implements NzSearchAdapter {

    public searchParams: SearchParamsActivityDailyEntity = new SearchParamsActivityDailyEntity(); // 条件筛选参数
    public nzSearchAssistant: NzSearchAssistant;
    private activity_id = '';

    constructor(private globalService: GlobalService,
                private distributionActivitiesService: DistributionActivitiesService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        // this.nzSearchAssistant.submitSearch(true);
    }


    /**
     * 打开
     */
    public open(activity_id: string) {
        this.activity_id = activity_id;
        this.searchParams = new SearchParamsActivityDailyEntity();
        this.nzSearchAssistant.nzData = [];
        // this.selectedMerchant = selectedMerchant.clone();
        timer(0).subscribe(() => {
            $('#detailListModal').modal();
            this.nzSearchAssistant.submitSearch(true);
        });
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.distributionActivitiesService.requestActivityDailyData(this.searchParams, this.activity_id);
    }

    public continueSearch(url: string): any {
        return this.distributionActivitiesService.continueActivityDailyData(url);
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
