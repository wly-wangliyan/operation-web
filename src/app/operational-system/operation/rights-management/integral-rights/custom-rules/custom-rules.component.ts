import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { IntegralRightsHttpService, SearchCustomIntegralParams, RuleEntity } from '../integral-rights-http.service';

@Component({
  selector: 'app-custom-rules',
  templateUrl: './custom-rules.component.html',
  styleUrls: ['./custom-rules.component.less']
})
export class CustomRulesComponent implements OnInit, NzSearchAdapter {
  public nzSearchAssistant: NzSearchAssistant;
  public searchParams: SearchCustomIntegralParams = new SearchCustomIntegralParams();

  constructor(
    private globalService: GlobalService,
    private integralRightsHttpService: IntegralRightsHttpService
  ) { }

  ngOnInit() {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  // 删除自定义规则
  public onDeleteRule(rule_id: string): void {
    this.globalService.confirmationBox.open('提示', '删除操作不可逆，是否删除？', () => {
      this.globalService.confirmationBox.close();
      this.integralRightsHttpService.requestDeleteCustomIntegralRuleData(rule_id)
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

  // 开启/停止规则
  public onChangeRuleStatus(data: RuleEntity): void {
    const tip = data.status === 1 ? '停止' : '开启';
    this.integralRightsHttpService.requestChangeCustomIntegralRuleStatus(data.rule_id, data.status === 1 ? 2 : 1)
      .subscribe(res => {
        this.nzSearchAssistant.submitSearch(true);
        this.globalService.promptBox.open(`${tip}成功`);
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open(`${tip}失败，请刷新重试！`, null, 2000, null, false);
        }
      });
  }

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    return this.integralRightsHttpService.requestCustomIntegralRuleListData(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.integralRightsHttpService.continueCustomIntegralRuleListData(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any): any {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(): any { }

}
