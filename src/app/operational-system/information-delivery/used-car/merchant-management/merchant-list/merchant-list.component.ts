import { Component } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { MerchantManagementService, SearchParamsEntity } from '../merchant-management.service';

@Component({
    selector: 'app-merchant-list',
    templateUrl: './merchant-list.component.html',
    styleUrls: ['./merchant-list.component.css', '../../used-car.component.css']
})
export class MerchantListComponent implements NzSearchAdapter {
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
