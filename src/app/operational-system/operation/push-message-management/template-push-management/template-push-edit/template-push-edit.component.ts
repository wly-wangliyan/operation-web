import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import {
    DateUnlimited,
    LandingPageType, SendType,
    TemplatePushManagementContentChildEntity,
    TemplatePushManagementContentEntity,
    TemplatePushManagementEntity,
    TemplatePushManagementService, UserCategory
} from '../template-push-management.service';
import { GlobalService } from '../../../../../core/global.service';
import { forkJoin, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import {
    SearchParamsEntity,
    TemplateManagementEntity,
    TemplateManagementService
} from '../../template-management/template-management.service';

@Component({
    selector: 'app-application-push-edit',
    templateUrl: './template-push-edit.component.html',
    styleUrls: ['./template-push-edit.component.css']
})
export class TemplatePushEditComponent implements OnInit {
    public levelName = '新建';
    public start_time = null;
    public end_time = null;
    public templatePushDetail: TemplatePushManagementEntity = new TemplatePushManagementEntity();
    public templateList: Array<TemplateManagementEntity> = [];
    public UserCategory = UserCategory;
    public LandingPageType = LandingPageType;
    public SendType = SendType;
    public WeekdayOperationType = WeekdayOperationType;
    public dateUnlimitedChecked = false;
    public currentTime: Date = null;
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
                private templateManagementService: TemplateManagementService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.route.paramMap.subscribe(map => {
            this.template_message_id = map.get('template_message_id');
        });
    }

    ngOnInit() {
        this.levelName = this.template_message_id ? '编辑' : '新建';
        this.requestTemplateData();
    }

    // 上架开始时间的禁用部分
    public disabledSetTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(startValue, new Date()) > 0;
    };

    // 上架开始时间的禁用部分
    public disabledStartDate = (startValue: Date): boolean => {
        if (differenceInCalendarDays(startValue, new Date()) > 0) {
            return true;
        } else if (!startValue || !this.templatePushDetail.end_date) {
            return false;
        }
        return new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_time).setHours(0, 0, 0, 0);
    };

    // 上架结束时间的禁用部分
    public disabledEndDate = (endValue: Date): boolean => {
        if (differenceInCalendarDays(endValue, new Date()) > 0) {
            return true;
        } else if (!endValue || !this.templatePushDetail.start_date) {
            return false;
        }
        return new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.start_time).setHours(0, 0, 0, 0);
    };

    /**
     * 选择模板标题
     * @param event
     */
    public onChangeTemplateTitle(event) {
        this.templatePushDetail.wx_template_id = event.target.value;
        const findIndex = this.templateList.findIndex(item => item.wx_template_id === this.templatePushDetail.wx_template_id);
        this.templatePushDetail.wx_template_id = this.templateList[findIndex].wx_template_id;
        this.templatePushDetail.content = new TemplatePushManagementContentEntity();
        const contentObj = this.templatePushDetail.content;
        this.templateList[findIndex].content.forEach(item => {
            const temp = new TemplatePushManagementContentChildEntity();
            temp.key = item.name;
            contentObj.content.push();
        });
    }

    /**
     * 推送时间
     */
    public onChangeSendType() {
        this.templatePushDetail.start_date = null;
        this.templatePushDetail.end_date = null;
        this.checkOptions.forEach(item => item.checked = false);
        this.templatePushDetail.set_time = null;
        this.templatePushDetail.send_time = null;
        this.templatePushDetail.date_unlimited = DateUnlimited.limited;
        this.currentTime = null;
    }

    /**
     * 导入文件
     * @param evt
     */
    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = (evt.target) as DataTransfer;
        if (target.files.length === 0) {
            return;
        }
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            try {
                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
                // header 设置 1 和不设置header是两种数据效果，具体看log。文件夹中提供测试数据.xlsx
                // const jsonData = XLSX.utils.sheet_to_json(ws, {header: 1});
                const jsonData = XLSX.utils.sheet_to_json(ws);
                // 这里可以对数据进行校验，判断是否正确合法
                this.templatePushDetail.uu_codes = jsonData.map(item => item['uu_ID/ht_ID']).join(',');
            } catch (ex) {
                console.log('文件无法解析,需要提示');
                console.log(ex);
            }
        };
        reader.readAsBinaryString(target.files[0]);
    }

    /**
     * 更改不限制复选框
     */
    public onClickDateUnlimited() {
        this.templatePushDetail.start_date = null;
        this.templatePushDetail.end_date = null;
    }

    /**
     * 选择星期
     * @param type
     */
    public onClickWeekDay(type: WeekdayOperationType) {
        const fiveCheck = this.checkOptions.slice(0, 5);
        const lastTwoCheck = this.checkOptions.slice(5);
        if (type === WeekdayOperationType.all) {
            this.checkOptions.forEach(item => item.checked = true);
        } else if (type === WeekdayOperationType.weekend) {
            fiveCheck.forEach(item => item.checked = false);
            lastTwoCheck.forEach(item => item.checked = true);
        } else {
            fiveCheck.forEach(item => item.checked = true);
            lastTwoCheck.forEach(item => item.checked = false);
        }
    }

    /**
     * 提交
     */
    public onEditFormSubmit() {
        if (this.templatePushDetail.send_type === SendType.timingPush) {
            this.templatePushDetail.set_time = (new Date(this.templatePushDetail.set_time).setSeconds(0, 0) / 1000);
        } else if (this.templatePushDetail.send_type === SendType.periodicPush) {
            this.templatePushDetail.start_date = (new Date(this.templatePushDetail.start_date).setSeconds(0, 0) / 1000);
            this.templatePushDetail.end_date = (new Date(this.templatePushDetail.end_date).setSeconds(0, 0) / 1000);
            const _checkOptions = this.checkOptions.filter(item => item.checked);
            this.templatePushDetail.weekday = _checkOptions.map(item => item.value).join(',');
            const hour = this.currentTime.getHours();
            const minute = this.currentTime.getMinutes();
            this.templatePushDetail.send_time = hour * 60 + minute;
        }
        this.templatePushManagementService.requestAddTemplatePushData(this.templatePushDetail, this.template_message_id).subscribe(data => {
            this.globalService.promptBox.open(this.template_message_id ? '编辑成功！' : '添加成功！', () => {
                this.router.navigate(['../../template-push-list'], {relativeTo: this.route});
            });
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }


    /**
     * 请求模板相关数据
     */
    private requestTemplateData() {
        const httpList = [];
        const params = new SearchParamsEntity();
        httpList.push(this.templateManagementService.requestTemplateListData(params));
        if (this.template_message_id) {
            httpList.push(this.templatePushManagementService.requestTemplatePushDetailData(this.template_message_id));
        }
        forkJoin(httpList).subscribe(results => {
            this.templateList = results[0];
            if (this.templateList.length === 0) {
                this.globalService.promptBox.open('请先创建模板！', () => {
                    this.router.navigate(['../../template-push-list'], {relativeTo: this.route});
                });
            }
            if (this.template_message_id) {
                this.templatePushDetail = results[1];
            }
            const findIndex = this.templateList.findIndex(item => item.wx_template_id === this.templatePushDetail.wx_template_id);
            if (findIndex < 0) {
                this.templatePushDetail.wx_template_id = this.templateList[0].wx_template_id;
                this.templatePushDetail.content = new TemplatePushManagementContentEntity();
                const contentObj = this.templatePushDetail.content;
                this.templateList[0].content.forEach(item => {
                    const temp = new TemplatePushManagementContentChildEntity();
                    temp.key = item.name;
                    contentObj.content.push(temp);
                });
            }
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}

enum WeekdayOperationType {
    all,
    workingDay,
    weekend,
}
