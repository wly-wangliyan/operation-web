import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityType } from '../distribution-activity-list/distribution-activity-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { DetailListComponent } from '../components/detail-list/detail-list.component';
import { BusinessListComponent } from '../components/business-list/business-list.component';
import { SelectBusinessComponent } from '../components/select-business/select-business.component';
import {
    OnlineTimeType,
    DistributionActivitiesService, DistributionActivityEntity,
    SearchParamsActivityBusinessListEntity,
    SearchParamsActivityDailyEntity
} from '../distribution-activities.service';
import { environment } from '../../../../../../environments/environment';
import { DateFormatHelper } from '../../../../../../utils/date-format-helper';

@Component({
    selector: 'app-distribution-activity-info',
    templateUrl: './distribution-activity-info.component.html',
    styleUrls: ['./distribution-activity-info.component.css']
})
export class DistributionActivityInfoComponent implements OnInit, NzSearchAdapter {
    public ActivityType = ActivityType;
    public tab_index = ActivityType.detail;
    public searchParamsDaily: SearchParamsActivityDailyEntity = new SearchParamsActivityDailyEntity(); // 条件筛选参数
    public searchParamsBusiness: SearchParamsActivityBusinessListEntity = new SearchParamsActivityBusinessListEntity();
    public start_time: any = '';
    public end_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;
    @ViewChild('detailListComponent', {static: false}) public detailListComponent: DetailListComponent;
    @ViewChild('businessListComponent', {static: false}) public businessListComponent: BusinessListComponent;
    @ViewChild('selectBusinessComponent', {static: false}) public selectBusinessComponent: SelectBusinessComponent;
    public distributionActivityDetail: DistributionActivityEntity = new DistributionActivityEntity();
    public OnlineTimeType = OnlineTimeType;
    private activity_id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private distributionActivitiesService: DistributionActivitiesService) {
        this.route.paramMap.subscribe(map => {
            this.activity_id = map.get('activity_id');
            this.tab_index = map.get('activity_type') as any;
        });
        this.nzSearchAssistant = new NzSearchAssistant(this);
    }

    /**
     * 选择商家
     */
    public onClickSelectionBusiness() {
        this.selectBusinessComponent.open(this.activity_id);
    }

    // 开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
    };

    // 结束时间的禁用部分
    public disabledEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
    };

    public ngOnInit() {
        this.onTabChange(this.tab_index);
    }

    /**
     * 明细
     * @param id
     */
    public onClickDetailList(id: string) {
        if (this.tab_index === ActivityType.detail) {
            this.detailListComponent.open(this.activity_id, id);
        } else {
            this.businessListComponent.open(this.activity_id, id);
        }
    }

    /**
     * 浏览|下单数据导出
     * @param type 1 浏览 2 下单
     */
    public onClickExport(type: number) {
        let searchUrl = `${environment.OPERATION_SERVE}/admin/distribution_activities/${this.activity_id}/orders_export?default=1`;
        if (type === 1) {
            searchUrl = `${environment.OPERATION_SERVE}/admin/distribution_activities/${this.activity_id}/view_data_export?default=1`;
        }
        if (this.generateAndCheckParamsValid()) {
            const params = this.searchParamsDaily.json();
            delete params.page_num;
            delete params.page_size;
            for (const key in params) {
                if (params[key]) {
                    searchUrl += `&${key}=${params[key]}`;
                }
            }
            window.open(searchUrl);
        }
    }

    // 下载二维码链接
    public onClickBusinessExport(type: number, merchant_id?: string) {
        let searchUrl = `${environment.OPERATION_SERVE}/admin/distribution_activities/${this.activity_id}/codes_export?default=1`;
        if (type === 2) {
            searchUrl = `${environment.OPERATION_SERVE}/admin/distribution_activities/${this.activity_id}/merchants/${merchant_id}/orders_export?default=1`;
        } else {
            const params = this.searchParamsBusiness.json();
            delete params.page_num;
            delete params.page_size;
            for (const key in params) {
                if (params[key]) {
                    searchUrl += `&${key}=${params[key]}`;
                }
            }
        }
        window.open(searchUrl);
    }

    /**
     * 删除商家
     * @param merchant_id
     */
    public onClickDeleteMerchant(merchant_id: string) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.distributionActivitiesService.requestDeleteActivityMerchantData(this.activity_id, merchant_id).subscribe(res => {
                this.nzSearchAssistant.submitSearch(true);
                this.globalService.promptBox.open('删除成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                }
            });
        }, '确定');
    }

    /**
     * 切换
     * @param activityType
     * @param isClick
     */
    public onTabChange(activityType: ActivityType, isClick = false) {
        this.tab_index = activityType;
        if (isClick) {
            this.router.navigate([`../../../activity-detail/${this.activity_id}/${activityType}`], {relativeTo: this.route});
        }
        if (activityType === ActivityType.detail) {
            this.requestDistributionActivityDetail();
        }
        this.nzSearchAssistant.nzData = [];
        this.searchParamsDaily = new SearchParamsActivityDailyEntity();
        this.searchParamsBusiness = new SearchParamsActivityBusinessListEntity();
        this.start_time = '';
        this.end_time = '';
        this.nzSearchAssistant.submitSearch(true);
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        if (this.tab_index === ActivityType.detail) {
            return this.distributionActivitiesService.requestActivityDailyData(this.searchParamsDaily, this.activity_id);
        } else {
            return this.distributionActivitiesService.requestActivityBusinessListData(this.searchParamsBusiness, this.activity_id);
        }
    }

    public continueSearch(url: string): any {
        if (this.tab_index === ActivityType.detail) {
            return this.distributionActivitiesService.continueActivityDailyData(url);
        } else {
            return this.distributionActivitiesService.continueActivityBusinessListData(url);
        }
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        if (this.tab_index === ActivityType.detail) {
            const cTime = new Date().getTime() / 1000;
            const sTime = this.start_time ? DateFormatHelper.DateToTimeStamp(this.start_time, true) : 0;
            const eTime = this.end_time ? (DateFormatHelper.DateToTimeStamp(this.end_time, false) - 1) : cTime;
            if (sTime > eTime) {
                this.globalService.promptBox.open('开始时间应小于等于结束时间！', null, 2000, null, false);
                return false;
            }
            this.searchParamsDaily.section = `${sTime},${eTime}`;
            return true;
        } else {
            return true;
        }
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(): any {
    }

    /**
     * 查看分销活动详情
     * @private
     */
    private requestDistributionActivityDetail() {
        this.distributionActivitiesService.requestDistributionActivityData(this.activity_id).subscribe(data => {
            this.distributionActivityDetail = data.clone();
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

}
