import { Component } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { differenceInCalendarDays } from 'date-fns';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import {
    IntegralMallHttpService,
    SearchIntegralCommodityParams
} from '../../../integral-management/integral-mall/integral-mall-http.service';

@Component({
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
    styleUrls: ['./template-list.component.css', '../../push-message-management.component.css']
})
export class TemplateListComponent implements NzSearchAdapter {

    public searchParams: SearchIntegralCommodityParams = new SearchIntegralCommodityParams(); // 条件筛选参数
    public start_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;
    public templateTip = '';
    public createTemplate = {
        'title': '',
        'id': '',
        'templateList': [{templateName: '', dateTime: new Date().getTime()}],
    };

    constructor(private globalService: GlobalService,
                private integralMallHttpService: IntegralMallHttpService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    public onClickCreateTemplate() {
        $('#templateCreatePromptDiv').modal('show');
    }

    public onClickDetail(){
        $('#templateDetailPromptDiv').modal('show');
    }

    public onClickAddKeyword() {
        const index = this.createTemplate.templateList.length - 1;
        const lastTemplate = this.createTemplate.templateList[index];
        if (!lastTemplate.templateName) {
            this.templateTip = `当前第${index + 1}个内容信息未填写`;
        } else {
            this.templateTip = '';
            this.createTemplate.templateList.push({templateName: '', dateTime: new Date().getTime()});
        }
    }

    public onCreateTemplateData(){
        console.log(232323)
    }

    public onClickDeleteTemplate(index: number) {
        this.templateTip = '';
        this.createTemplate.templateList.splice(index, 1);
    }

    // 上架开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(startValue, new Date()) > 0;
    };

    public onDeleteClick(id: string) {
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.integralMallHttpService.requestIntegralCommodityListData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.integralMallHttpService.continueIntegralCommodityData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        // const cTime = new Date().getTime() / 1000;
        // const sTime = this.start_time ? ((new Date(this.start_time).setSeconds(0, 0) / 1000)) : 0;
        // const eTime = this.end_time ? ((new Date(this.end_time).setSeconds(0, 0) / 1000)) : cTime;
        // if (sTime > eTime) {
        //     this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
        //     return false;
        // }
        // this.searchParams.section = `${sTime},${eTime}`;
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
