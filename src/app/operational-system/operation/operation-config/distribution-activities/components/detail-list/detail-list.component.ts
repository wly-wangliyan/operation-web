import { Component } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';
import {
    DistributionActivitiesService,
    SearchParamsActivityBusinessListEntity,
} from '../../distribution-activities.service';

@Component({
    selector: 'app-detail-list',
    templateUrl: './detail-list.component.html',
    styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent implements NzSearchAdapter {

    public searchParams: SearchParamsActivityBusinessListEntity = new SearchParamsActivityBusinessListEntity(); // 条件筛选参数
    public nzSearchAssistant: NzSearchAssistant;
    private activity_id = '';
    private daily_click_id = '';

    constructor(private globalService: GlobalService,
                private distributionActivitiesService: DistributionActivitiesService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
    }


    /**
     * 打开
     */
    public open(activity_id: string, daily_click_id: string) {
        this.activity_id = activity_id;
        this.daily_click_id = daily_click_id;
        this.searchParams = new SearchParamsActivityBusinessListEntity();
        this.nzSearchAssistant.nzData = [];
        timer(0).subscribe(() => {
            $('#detailListModal').modal();
            this.nzSearchAssistant.submitSearch(true);
        });
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.distributionActivitiesService.requestActivityDailyBusinessData(this.activity_id, this.daily_click_id, this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.distributionActivitiesService.continueActivityDailyBusinessData(url);
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
