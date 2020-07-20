import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';

@Component({
    selector: 'app-application-push-edit',
    templateUrl: './template-push-edit.component.html',
    styleUrls: ['./template-push-edit.component.css']
})
export class TemplatePushEditComponent implements OnInit {
    public levelName = '新建';
    public start_time = null;
    public end_time = null;
    public checkOptionsOne = [
        {label: '周一', value: 1, checked: false},
        {label: '周二', value: 2, checked: false},
        {label: '周三', value: 3, checked: false},
        {label: '周四', value: 4, checked: false},
        {label: '周五', value: 5, checked: false},
        {label: '周六', value: 6, checked: false},
        {label: '周日', value: 7, checked: false}
    ];
    private push_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router) {
        this.route.paramMap.subscribe(map => {
            this.push_id = map.get('push_plan_id');
        });
    }

    ngOnInit() {
        this.levelName = this.push_id ? '编辑' : '新建';
    }

    // 上架开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(startValue, new Date()) > 0;
    };

    public updateSingleChecked() {

    }
}
