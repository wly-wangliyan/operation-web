import { Component, ViewChild } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import {
    DistributionActivitiesService,
    SearchParamsDistributionActivitiesEntity,
    DistributionActivityEntity
} from '../distribution-activities.service';
import {
    OnlineStatus
} from 'src/app/operational-system/used-car/information-delivery-management/information-delivery-management.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { SelectBusinessComponent } from '../components/select-business/select-business.component';

@Component({
    selector: 'app-distribution-activity-list',
    templateUrl: './distribution-activity-list.component.html',
    styleUrls: ['./distribution-activity-list.component.css', '../distribution-activities.component.css']
})
export class DistributionActivityListComponent implements NzSearchAdapter {
    public ActivityType = ActivityType;
    public searchParams: SearchParamsDistributionActivitiesEntity = new SearchParamsDistributionActivitiesEntity(); // 条件筛选参数
    public nzSearchAssistant: NzSearchAssistant;
    public OnlineStatus = OnlineStatus;
    @ViewChild('selectBusinessComponent', {static: true}) public selectBusinessComponent: SelectBusinessComponent;

    constructor(private globalService: GlobalService,
                private distributionActivitiesService: DistributionActivitiesService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    /**
     * 启停
     * @param distributionActivity
     */
    public onSwitchChange(distributionActivity: DistributionActivityEntity) {
        const swicth = distributionActivity.online_status === OnlineStatus.off ? OnlineStatus.on : OnlineStatus.off;
        this.globalService.confirmationBox.open('提示', swicth === OnlineStatus.off ? '是否下线当前活动？' : '是否上线当前活动', () => {
            this.globalService.confirmationBox.close();
            this.distributionActivitiesService.requestDistributionActivityOnlineStatusData(distributionActivity.activity_id, swicth).subscribe(res => {
                if (distributionActivity.online_status === OnlineStatus.off) {
                    this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
                } else {
                    this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
                }
                this.nzSearchAssistant.submitSearch(true);
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    if (err.status === 422) {
                        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                        for (const content of error.errors) {
                            if (content.field === 'online_status' && content.code === 'not_allowed') {
                                this.globalService.promptBox.open('待审核或者已驳回不可上线', null, 2000, null, false);
                                return;
                            }
                        }
                    }
                }
            });
        }, '确定');
    }

    /**
     * 删除分销活动
     * @param distribution_activity_id
     */
    public onClickDelete(distribution_activity_id: string) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.distributionActivitiesService.requestDeleteDistributionActivitiesData(distribution_activity_id).subscribe(res => {
                this.nzSearchAssistant.submitSearch(true);
                this.globalService.promptBox.open('删除成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                }
            });
        }, '确定');
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.distributionActivitiesService.requestDistributionActivitiesData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.distributionActivitiesService.continueDistributionActivitiesData(url);
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
