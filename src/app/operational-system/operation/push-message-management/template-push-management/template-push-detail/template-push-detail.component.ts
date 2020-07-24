import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import {
    SendRecordEntity,
    SendType,
    UserCategory,
    TemplatePushManagementEntity,
    TemplatePushManagementService, DateUnlimited
} from '../template-push-management.service';
import { DateFormatHelper, TimeItem } from '../../../../../../utils/date-format-helper';

@Component({
    selector: 'app-application-push-detail',
    templateUrl: './template-push-detail.component.html',
    styleUrls: ['./template-push-detail.component.css']
})
export class TemplatePushDetailComponent implements OnInit {
    @ViewChild('remarkPromptDiv', {static: true}) public remarkPromptDiv: ElementRef;
    public templatePushDetail: TemplatePushManagementEntity = new TemplatePushManagementEntity();
    public SendType = SendType;
    public UserCategory = UserCategory;
    public DateUnlimited = DateUnlimited;
    public sendRecordList: Array<SendRecordEntity> = [];
    public remark = '';
    public time = new TimeItem();
    public checkOptions = [
        {label: '周一', value: 1, checked: false},
        {label: '周二', value: 2, checked: false},
        {label: '周三', value: 3, checked: false},
        {label: '周四', value: 4, checked: false},
        {label: '周五', value: 5, checked: false},
        {label: '周六', value: 6, checked: false},
        {label: '周日', value: 7, checked: false}
    ];
    private template_message_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.route.paramMap.subscribe(map => {
            this.template_message_id = map.get('template_message_id');
        });
    }

    public ngOnInit() {
        this.requestTemplatePushDetail();
    }

    /*
     * 修改备注信息
   * */
    public onUpdateRemarkClick() {
        $(this.remarkPromptDiv.nativeElement).modal('show');
    }

    /**
     * 编辑备注
     */
    public onEditRemarkFormSubmit() {
        const params = this.templatePushDetail.clone();
        params.remark = this.remark;
        this.templatePushManagementService.requestAddTemplatePushData(params, this.template_message_id).subscribe(data => {
            $(this.remarkPromptDiv.nativeElement).modal('hide');
            this.globalService.promptBox.open('保存成功！', () => {
                this.requestTemplatePushDetail();
            });
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 请求详情
     */
    private requestTemplatePushDetail() {
        const httpList = [];
        httpList.push(this.templatePushManagementService.requestTemplatePushDetailData(this.template_message_id));
        // httpList.push(this.templatePushManagementService.requestTemplatePushRecordListData(this.template_message_id));
        forkJoin(httpList).subscribe(results => {
            this.templatePushDetail = results[0].clone;
            const weekdays = this.templatePushDetail.weekday.split(',');
            this.checkOptions.forEach(item => {
                if (weekdays.indexOf(item.value.toString()) > -1) {
                    item.checked = true;
                }
            });
            this.time = results[1].send_time && results[1].send_time.time ?
                DateFormatHelper.getMinuteOrTime(results[1].send_time.time, 'mm')
                : new TimeItem();
            this.sendRecordList = results[1];
            this.remark = this.templatePushDetail.clone().remark;
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}
