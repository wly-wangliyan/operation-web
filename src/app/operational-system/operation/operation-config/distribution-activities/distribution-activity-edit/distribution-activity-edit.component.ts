import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { DistributionActivitiesParams, DistributionActivitiesService, OnlineTimeType } from '../distribution-activities.service';
import { DateFormatHelper } from '../../../../../../utils/date-format-helper';

@Component({
    selector: 'app-distribution-activity-edit',
    templateUrl: './distribution-activity-edit.component.html',
    styleUrls: ['./distribution-activity-edit.component.css']
})
export class DistributionActivityEditComponent implements OnInit {
    public levelName = '';
    public OnlineTimeType = OnlineTimeType;
    public loading = true; // 标记loading
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
        } else {
            this.loading = false;
        }
    }

    // 上架开始时间的禁用部分
    public disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.distributionActivity.end_time) {
            return false;
        } else {
            return new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.distributionActivity.end_time).setHours(0, 0, 0, 0);
        }
    };

    // 上架结束时间的禁用部分
    public disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.distributionActivity.start_time) {
            return false;
        } else {
            return new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.distributionActivity.start_time).setHours(0, 0, 0, 0);
        }
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
            const params: DistributionActivitiesParams = JSON.parse(JSON.stringify(this.distributionActivity));
            params.start_time = params.start_time ? ((new Date(params.start_time).setSeconds(0, 0) / 1000)) : '';
            params.end_time = params.end_time ? ((new Date(params.end_time).setSeconds(0, 0) / 1000)) : '';
            params.fixed_time = params.fixed_time ? ((new Date(params.fixed_time).setSeconds(0, 0) / 1000)) : '';
            this.distributionActivitiesService.requestAddDistributionActivitiesData(params, this.activity_id).subscribe(data => {
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
            this.loading = false;
            this.distributionActivity = new DistributionActivitiesParams(data);
        }, err => {
            this.loading = false;
            this.globalService.httpErrorProcess(err);
        });
    }

}
