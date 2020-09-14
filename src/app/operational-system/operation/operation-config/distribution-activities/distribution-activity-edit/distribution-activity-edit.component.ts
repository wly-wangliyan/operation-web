import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { DistributionActivitiesParams, DistributionActivitiesService, OnlineTimeType } from '../distribution-activities.service';

@Component({
    selector: 'app-distribution-activity-edit',
    templateUrl: './distribution-activity-edit.component.html',
    styleUrls: ['./distribution-activity-edit.component.css']
})
export class DistributionActivityEditComponent implements OnInit {
    public levelName = '';
    public OnlineTimeType = OnlineTimeType;
    public distributionActivity: DistributionActivitiesParams = new DistributionActivitiesParams();
    private activity_id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private distributionActivitiesService: DistributionActivitiesService) {
        this.route.paramMap.subscribe(map => {
            this.activity_id = map.get('activity_id');
        });
    }

    public ngOnInit() {
        this.levelName = this.activity_id ? '编辑活动' : '新建活动';
        this.distributionActivity = new DistributionActivitiesParams();
        if (this.activity_id) {
            this.requestDistributionActivityDetail();
        }
    }

    // 上架开始时间的禁用部分
    public disabledStartDate = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledFutureStartTime(startValue, this.distributionActivity.end_time);
    };

    // 上架结束时间的禁用部分
    public disabledEndDate = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledFutureEndTime(endValue, this.distributionActivity.start_time);
    };

    // 上线时间的禁用部分
    public disabledOnlineTimeDate = (startValue: Date): boolean => {
        return differenceInCalendarDays(new Date(), startValue) > 0;
    };

    /**
     * 提交
     */
    public onEditFormSubmit() {
        if (this.distributionActivity.start_time && !this.distributionActivity.end_time) {
            this.globalService.promptBox.open('请选择活动结束时间！', null, 2000, null, false);
            return;
        } else if (!this.distributionActivity.start_time && this.distributionActivity.end_time) {
            this.globalService.promptBox.open('请选择活动开始时间！', null, 2000, null, false);
            return;
        } else {
            this.distributionActivitiesService.requestAddDistributionActivitiesData(this.distributionActivity, this.activity_id).subscribe(data => {
                this.globalService.promptBox.open(this.activity_id ? '编辑成功！' : '创建成功', () => {
                    this.goToListPage();
                });
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        }
    }

    public goToListPage() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    /**
     * 查看分销活动详情
     * @private
     */
    private requestDistributionActivityDetail() {
        this.distributionActivitiesService.requestDistributionActivityData(this.activity_id).subscribe(data => {
            this.distributionActivity = new DistributionActivitiesParams(data);
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

}
