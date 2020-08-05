import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { differenceInCalendarDays } from 'date-fns';
import {
    SearchParamsEntity,
    TemplateManagementEntity,
    TemplateManagementService
} from '../template-management.service';
import { timer } from 'rxjs';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';

@Component({
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
    styleUrls: ['./template-list.component.css', '../../push-message-management.component.css']
})
export class TemplateListComponent implements OnInit {
    public templateCreate: TemplateManagementEntity = new TemplateManagementEntity();
    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数
    public start_time: any = '';
    public end_time: any = '';
    public templateDetail: TemplateManagementEntity = new TemplateManagementEntity();
    public templateList: Array<TemplateManagementEntity> = [];
    public noResultText = '数据加载中...';
    private isClick = false;

    constructor(private globalService: GlobalService,
                private templateManagementService: TemplateManagementService) {
    }

    public ngOnInit() {
        this.requestTemplateList();
    }

    /**
     * 添加模板
     */
    public onClickCreateTemplate() {
        this.isClick = false;
        this.templateCreate = new TemplateManagementEntity();
        $('#templateCreatePromptDiv').modal('show');
    }

    /**
     * 查看模板详情
     * @param templateDetail
     */
    public onClickDetail(templateDetail: TemplateManagementEntity) {
        this.templateDetail = templateDetail.clone();
        timer(10).subscribe(() => {
            $('#templateDetailPromptDiv').modal('show');
        });
    }

    /**
     * 创建模板
     */
    public onCreateTemplateData() {
        if (this.isClick) {
            return;
        }
        this.isClick = true;
        this.templateManagementService.requestAddTemplateData(this.templateCreate).subscribe(data => {
            this.isClick = false;
            $('#templateCreatePromptDiv').modal('hide');
            this.requestTemplateList();
            this.globalService.promptBox.open('保存成功！');
        }, err => {
            this.isClick = false;
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                    for (const content of error.errors) {
                        if (content.field === 'weixin_template_id' && content.code === 'invalid') {
                            this.globalService.promptBox.open('微信模板ID不存在或者错误！', null, 2000, null, false);
                            return;
                        }
                        if (content.resource === 'template' && content.code === 'already_existed') {
                            this.globalService.promptBox.open('微信模板ID已存在', null, 2000, null, false);
                            return;
                        }
                    }
                }
            }
        });
    }

    // 开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
    };

    // 结束时间的禁用部分
    public disabledEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
    };

    /**
     * 删除模板
     * @param wx_template_id
     */
    public onDeleteTemplateClick(wx_template_id: string) {
        this.templateManagementService.requestTemplateDeleteAllowedData(wx_template_id).subscribe(data => {
            // # 1允许删除 2不可删除
            if (data.status === 1) {
                this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
                    this.globalService.confirmationBox.close();
                    this.templateManagementService.requestDeleteTemplateData(wx_template_id)
                        .subscribe(res => {
                            this.requestTemplateList();
                            this.globalService.promptBox.open('删除成功');
                        }, err => {
                            if (!this.globalService.httpErrorProcess(err)) {
                                this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                            }
                        });
                });
            } else {
                this.globalService.promptBox.open('此模板正在使用，不可删除！', null, 2000, null, false);
            }
        }, err => {
            this.globalService.httpErrorProcess(err);
        });

    }

    /**
     * 搜索
     */
    public onClickRearch() {
        if (this.generateAndCheckParamsValid()) {
            this.requestTemplateList();
        }
    }

    /**
     * 模板列表
     */
    private requestTemplateList() {
        this.noResultText = '数据加载中...';
        this.templateManagementService.requestTemplateListData(this.searchParams).subscribe(data => {
            this.templateList = data;
            if (data.length === 0) {
                this.noResultText = '暂无数据';
            }
        }, err => {
            this.noResultText = '暂无数据';
            this.globalService.httpErrorProcess(err);
        });
    }

    /* 生成并检查参数有效性 */
    private generateAndCheckParamsValid(): boolean {
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
}
