import { Component } from '@angular/core';
import { SearchParamsEntity } from '../../../operation/push-message-management/template-management/template-management.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../core/global.service';
import {
    TemplatePushManagementEntity,
    TemplatePushManagementService
} from '../../../operation/push-message-management/template-push-management/template-push-management.service';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';

@Component({
    selector: 'app-information-delivery-list',
    templateUrl: './information-delivery-list.component.html',
    styleUrls: ['./information-delivery-list.component.css', '../../../../../assets/less/tab-bar-list.less']
})
export class InformationDeliveryListComponent implements NzSearchAdapter {

    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数
    public start_time: any = '';
    public end_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;
    public tabList = [
        {key: 0, label: '全部'},
        {key: 1, label: '待审核'},
        {key: 2, label: '已审核'}
    ];
    public activeTabIndex = 0;

    constructor(private globalService: GlobalService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    // 切换tab
    public onTabChange(key: number) {
        this.searchParams = new SearchParamsEntity();
        this.start_time = '';
        this.end_time = '';
        // if (key === 0) {
        //   this.searchParams.pay_status = null;
        // } else if (key === 1) {
        //   this.searchParams.order_status = 2;
        // } else if (key === 2) {
        //   this.searchParams.pay_status = 3;
        // }
        this.nzSearchAssistant.submitSearch(true);
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
     * 启停
     * @param templatePush
     */
    public onSwitchChange(templatePush: TemplatePushManagementEntity) {
        // if (this.isDisabledOpen(templatePush)) {
        //     return;
        // }
        // const swicth = templatePush.status === TemplatePushStatus.close ? TemplatePushStatus.open : TemplatePushStatus.close;
        // this.templatePushManagementService.requestStatusTemplatePushData(templatePush.template_message_id, swicth).subscribe(res => {
        //     if (templatePush.status === TemplatePushStatus.close) {
        //         this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
        //     } else {
        //         this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
        //     }
        //     this.nzSearchAssistant.submitSearch(true);
        // }, err => {
        //     if (!this.globalService.httpErrorProcess(err)) {
        //         if (err.status === 422) {
        //             const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        //             for (const content of error.errors) {
        //                 if (content.resource === 'template' && content.code === 'deleted') {
        //                     this.globalService.promptBox.open('微信模板已删除！', null, 2000, null, false);
        //                     return;
        //                 }
        //                 if (content.field === swicth.toString() && content.code === 'not_allowed') {
        //                     this.globalService.promptBox.open('不允许操作', null, 2000, null, false);
        //                     return;
        //                 }
        //             }
        //         }
        //     }
        // });
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
