import { Component, OnInit } from '@angular/core';
import { ActivityType } from '../distribution-activity-list/distribution-activity-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { SearchParamsEntity } from '../../../push-message-management/template-management/template-management.service';
import { TemplatePushManagementService } from '../../../push-message-management/template-push-management/template-push-management.service';

@Component({
    selector: 'app-distribution-activity-info',
    templateUrl: './distribution-activity-info.component.html',
    styleUrls: ['./distribution-activity-info.component.css']
})
export class DistributionActivityInfoComponent implements OnInit, NzSearchAdapter {
    public ActivityType = ActivityType;
    public tab_index = ActivityType.detail;
    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数
    public start_time: any = '';
    public end_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;
    private activity_id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.route.paramMap.subscribe(map => {
            this.activity_id = map.get('activity_id');
            this.tab_index = map.get('activity_type') as any;
        });
        this.nzSearchAssistant = new NzSearchAssistant(this);
    }

    // 开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
    };

    // 结束时间的禁用部分
    public disabledEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
    };

    ngOnInit() {
        this.onTabChange(this.tab_index);
    }

    public onTabChange(activityType: ActivityType, isClick = false) {
        this.tab_index = activityType;
        if (isClick) {
            this.router.navigate([`../../../activity-detail/${this.activity_id}/${activityType}`], {relativeTo: this.route});
        }
        this.nzSearchAssistant.submitSearch(true);
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.templatePushManagementService.requestTemplatePushListData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.templatePushManagementService.continueTemplatePushListData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        const cTime = new Date().getTime() / 1000;
        const sTime = this.start_time ? ((new Date(this.start_time).setSeconds(0, 0) / 1000)) : 0;
        const eTime = this.end_time ? ((new Date(this.end_time).setSeconds(0, 0) / 1000)) : cTime;
        if (sTime > eTime) {
            this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
            return false;
        }
        this.searchParams.section = `${sTime},${eTime}`;
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
