import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import {
    DateUnlimited,
    LandingPageType, SendType,
    TemplatePushManagementContentEntity,
    TemplatePushManagementEntity,
    TemplatePushManagementService, UserCategory
} from '../template-push-management.service';
import { GlobalService } from '../../../../../core/global.service';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import {
    SearchParamsEntity, TemplateManagementContentEntity,
    TemplateManagementEntity,
    TemplateManagementService
} from '../../template-management/template-management.service';
import { DateFormatHelper, TimeItem } from '../../../../../../utils/date-format-helper';

@Component({
    selector: 'app-application-push-edit',
    templateUrl: './template-push-edit.component.html',
    styleUrls: ['./template-push-edit.component.css']
})
export class TemplatePushEditComponent implements OnInit {
    public levelName = '新建';
    public templatePushDetail: TemplatePushManagementEntity = new TemplatePushManagementEntity();
    public templateList: Array<TemplateManagementEntity> = [];
    public UserCategory = UserCategory;
    public LandingPageType = LandingPageType;
    public SendType = SendType;
    public WeekdayOperationType = WeekdayOperationType;
    public dateUnlimitedChecked = false; // 是否是不限制
    public time: TimeItem = new TimeItem(); // 发放时间
    public loading = true; // 标记loading
    public checkOptions = [
        {label: '周一', value: 1, checked: false},
        {label: '周二', value: 2, checked: false},
        {label: '周三', value: 3, checked: false},
        {label: '周四', value: 4, checked: false},
        {label: '周五', value: 5, checked: false},
        {label: '周六', value: 6, checked: false},
        {label: '周日', value: 7, checked: false}
    ];
    public template_message_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private templateManagementService: TemplateManagementService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.route.paramMap.subscribe(map => {
            this.template_message_id = map.get('template_message_id');
        });
    }

    public ngOnInit() {
        this.levelName = this.template_message_id ? '编辑' : '新建';
        this.requestTemplateData();
    }

    // 上架开始时间的禁用部分
    public disabledSetTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(startValue, new Date()) > 0;
    };

    // 上架开始时间的禁用部分
    public disabledStartDate = (startValue: Date): boolean => {
        if (differenceInCalendarDays(new Date(), startValue) > 0) {
            return true;
        } else if (!startValue || !this.templatePushDetail.end_date) {
            return false;
        }
        return new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.templatePushDetail.end_date).setHours(0, 0, 0, 0);
    };

    // 上架结束时间的禁用部分
    public disabledEndDate = (endValue: Date): boolean => {
        if (differenceInCalendarDays(new Date(), endValue) > 0) {
            return true;
        } else if (!endValue || !this.templatePushDetail.start_date) {
            return false;
        }
        return new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.templatePushDetail.start_date).setHours(0, 0, 0, 0);
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
            const temp = new TemplateManagementContentEntity();
            temp.key = item.key;
            contentObj.content.push(temp);
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
        this.time = new TimeItem();
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
        if (!this.template_message_id) {
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
    }

    /**
     * 提交
     */
    public onEditFormSubmit() {
        const params = this.templatePushDetail.clone();
        if (params.send_type === SendType.timingPush) {
            params.set_time = (new Date(this.templatePushDetail.set_time).setSeconds(0, 0) / 1000);
        } else if (params.send_type === SendType.periodicPush) {
            params.start_date = (new Date(this.templatePushDetail.start_date).setSeconds(0, 0) / 1000);
            params.end_date = (new Date(this.templatePushDetail.end_date).setSeconds(0, 0) / 1000);
            const _checkOptions = this.checkOptions.filter(item => item.checked);
            params.weekday = _checkOptions.map(item => item.value).join(',');
            params.send_time = DateFormatHelper.getSecondTimeSum(this.time, 'mm');
        }
        this.templatePushManagementService.requestAddTemplatePushData(params, this.template_message_id).subscribe(() => {
            this.globalService.promptBox.open(this.template_message_id ? '编辑成功！' : '添加成功！', () => {
                this.router.navigate(['../'], {relativeTo: this.route});
            });
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 禁止保存
     */
    public get disabledBtn(): boolean {
        const contentObj = this.templatePushDetail.content;
        const contentItem = contentObj.content.find(item => !!item.value);
        const checkOptionItem = this.checkOptions.find(item => !!item.checked);
        if (this.templatePushDetail.send_type === SendType.periodicPush) {
            return !(((this.templatePushDetail.start_date && this.templatePushDetail.end_date) ||
                this.dateUnlimitedChecked) && checkOptionItem);
        }
        return !(contentItem || contentObj.start || contentObj.start);

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
            this.loading = false;
            this.templateList = results[0];
            if (this.templateList.length === 0) {
                this.globalService.promptBox.open('请先创建模板！', () => {
                    this.router.navigate(['../'], {relativeTo: this.route});
                });
                return;
            }
            if (this.template_message_id) {
                this.templatePushDetail = results[1].clone();
                this.templatePushDetail.set_time = results[1].set_time ? new Date((results[1].set_time) * 1000) : null;
                if (this.templatePushDetail.send_type === SendType.periodicPush) {
                    this.templatePushDetail.start_date = new Date((results[1].start_date) * 1000);
                    this.templatePushDetail.end_date = new Date((results[1].end_date) * 1000);
                    this.time = results[1].send_time && results[1].send_time.time ?
                        DateFormatHelper.getMinuteOrTime(results[1].send_time.time, 'mm')
                        : new TimeItem();
                    const weekdays = this.templatePushDetail.weekday.split(',');
                    this.checkOptions.forEach(item => {
                        if (weekdays.indexOf(item.value.toString()) > -1) {
                            item.checked = true;
                        }
                    });
                }
            }
            const findIndex = this.templateList.findIndex(item => item.wx_template_id === this.templatePushDetail.wx_template_id);
            if (findIndex < 0) {
                this.templatePushDetail.wx_template_id = this.templateList[0].wx_template_id;
                this.templatePushDetail.content = new TemplatePushManagementContentEntity();
                const contentObj = this.templatePushDetail.content;
                this.templateList[0].content.forEach(item => {
                    const temp = new TemplateManagementContentEntity();
                    temp.key = item.key;
                    contentObj.content.push(temp);
                });
            }
        }, err => {
            this.loading = false;
            this.globalService.httpErrorProcess(err);
        });
    }
}

enum WeekdayOperationType {
    all,
    workingDay,
    weekend,
}
