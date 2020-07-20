import { Component } from '@angular/core';
import {
    IntegralMallHttpService,
    SearchIntegralCommodityParams
} from '../../../integral-management/integral-mall/integral-mall-http.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { differenceInCalendarDays } from 'date-fns';

@Component({
    selector: 'app-application-push-list',
    templateUrl: './template-push-list.component.html',
    styleUrls: ['./template-push-list.component.css', '../../push-message-management.component.css']
})
export class TemplatePushListComponent implements NzSearchAdapter {

    public searchParams: SearchIntegralCommodityParams = new SearchIntegralCommodityParams(); // 条件筛选参数
    public start_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;

    constructor(private globalService: GlobalService,
                private integralMallHttpService: IntegralMallHttpService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    // 上架开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(startValue, new Date()) > 0;
    };

    public onDeleteClick(commodity_id: string) {
        this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
            this.globalService.confirmationBox.close();
            this.integralMallHttpService.requestDeleteCommodityData(commodity_id)
                .subscribe(res => {
                    this.nzSearchAssistant.submitSearch(true);
                    this.globalService.promptBox.open('删除成功');
                }, err => {
                    if (!this.globalService.httpErrorProcess(err)) {
                        this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                    }
                });
        });
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.integralMallHttpService.requestIntegralCommodityListData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.integralMallHttpService.continueIntegralCommodityData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        // const cTime = new Date().getTime() / 1000;
        // const sTime = this.start_time ? ((new Date(this.start_time).setSeconds(0, 0) / 1000)) : 0;
        // const eTime = this.end_time ? ((new Date(this.end_time).setSeconds(0, 0) / 1000)) : cTime;
        // if (sTime > eTime) {
        //     this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
        //     return false;
        // }
        // this.searchParams.section = `${sTime},${eTime}`;
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
