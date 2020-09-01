import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';

@Component({
    selector: 'app-distribution-activity-edit',
    templateUrl: './distribution-activity-edit.component.html',
    styleUrls: ['./distribution-activity-edit.component.css']
})
export class DistributionActivityEditComponent implements OnInit {
    public start_date: any = '';
    public end_date: any = '';
    public online_time: any = '';
    public levelName = '';
    public online_time_radio = null;
    public OnlineTimeType = OnlineTimeType;
    private activity_id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService) {
        this.route.paramMap.subscribe(map => {
            this.activity_id = map.get('activity_id');
        });
    }

    ngOnInit() {
        this.levelName = this.activity_id ? '编辑活动' : '新建活动';
    }

    // 上架开始时间的禁用部分
    public disabledStartDate = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.end_date);
    };

    // 上架结束时间的禁用部分
    public disabledEndDate = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.start_date);
    };

    // 上线时间的禁用部分
    public disabledOnlineTimeDate = (startValue: Date): boolean => {
        return differenceInCalendarDays(new Date(), startValue) > 0;
    };

    public onChangeOnlineTime() {
        this.online_time = '';
    }

    public onEditFormSubmit() {

    }

    public goToListPage() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}

enum OnlineTimeType {
    now = 1,
    timing = 2,
}
