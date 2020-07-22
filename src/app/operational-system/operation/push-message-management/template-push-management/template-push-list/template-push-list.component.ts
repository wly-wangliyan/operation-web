import { Component } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { differenceInCalendarDays } from 'date-fns';
import { TemplatePushManagementService, TemplatePushStatus } from '../template-push-management.service';
import { SearchParamsEntity } from '../../template-management/template-management.service';
import { HttpErrorEntity } from '../../../../../core/http.service';

@Component({
    selector: 'app-application-push-list',
    templateUrl: './template-push-list.component.html',
    styleUrls: ['./template-push-list.component.css', '../../push-message-management.component.css']
})
export class TemplatePushListComponent implements NzSearchAdapter {
    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数
    public start_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;
    public TemplatePushStatus = TemplatePushStatus;

    constructor(private globalService: GlobalService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    // 上架开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(startValue, new Date()) > 0;
    };

    /**
     * 删除模板消息
     * @param commodity_id
     */
    public onDeleteClick(commodity_id: string) {
        this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
            this.globalService.confirmationBox.close();
            this.templatePushManagementService.requestDeleteTemplatePushData(commodity_id)
                .subscribe(res => {
                    this.nzSearchAssistant.submitSearch(true);
                    this.globalService.promptBox.open('删除成功');
                }, err => {
                    if (!this.globalService.httpErrorProcess(err)) {
                        this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                    }
                });
        });
    }

    /**
     * 启停
     * @param template_message_id
     * @param event
     */
    public onSwitchChange(template_message_id: string, event: boolean) {
        const swicth = event ? TemplatePushStatus.open : TemplatePushStatus.close;
        this.templatePushManagementService.requestStatusTemplatePushData(template_message_id, swicth).subscribe(res => {
            if (event) {
                this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
            } else {
                this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
            }
            // timer(500).subscribe(() => {
            //     node.status = event;
            // });
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 删除模板
     * @param template_message_id
     */
    public onDeleteTemplateClick(template_message_id: string) {
        this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
            this.globalService.confirmationBox.close();
            this.templatePushManagementService.requestDeleteTemplatePushData(template_message_id).subscribe(res => {
                this.nzSearchAssistant.submitSearch(true);
                this.globalService.promptBox.open('删除成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                }
            });
        });
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
        if (this.start_time) {
            const _start_time = (new Date(this.start_time).setSeconds(0, 0) / 1000);
            const _end_time = new Date().getTime() / 1000;
            this.searchParams.section = `${_start_time},${_end_time}`;
        } else {
            this.searchParams.section = null;
        }
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
