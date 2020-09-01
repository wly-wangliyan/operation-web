import { Component, OnInit } from '@angular/core';
import { MerchantManagementService, SearchParamsEntity } from '../../../../used-car/merchant-management/merchant-management.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';

@Component({
    selector: 'app-distribution-activity-list',
    templateUrl: './distribution-activity-list.component.html',
    styleUrls: ['./distribution-activity-list.component.css', '../distribution-activities.component.css']
})
export class DistributionActivityListComponent implements NzSearchAdapter {
    public ActivityType = ActivityType;
    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数
    public nzSearchAssistant: NzSearchAssistant;

    constructor(private globalService: GlobalService,
                private companyManagementService: MerchantManagementService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.companyManagementService.requestMerchantListData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.companyManagementService.continueMerchantListData(url);
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

export enum ActivityType {
    detail = 'detail',
    business = 'business'
}
