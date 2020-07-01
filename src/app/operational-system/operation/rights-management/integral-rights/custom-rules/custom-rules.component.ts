import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { IntegralRightsHttpService } from '../integral-rights-http.service';

@Component({
  selector: 'app-custom-rules',
  templateUrl: './custom-rules.component.html',
  styleUrls: ['./custom-rules.component.less']
})
export class CustomRulesComponent implements OnInit, NzSearchAdapter {
  public nzSearchAssistant: NzSearchAssistant;

  constructor(
    private globalService: GlobalService,
    private integralRightsHttpService: IntegralRightsHttpService
  ) { }

  ngOnInit() {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    // return this.integralRightsHttpService;
  }

  public continueSearch(url: string): any {
    // return this.integralRightsHttpService.requestContinueData(url);
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
