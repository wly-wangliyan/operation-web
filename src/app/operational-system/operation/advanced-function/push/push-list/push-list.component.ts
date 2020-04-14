import { Component, OnInit } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { PushService } from '../push.service';

@Component({
  selector: 'app-push-list',
  templateUrl: './push-list.component.html',
  styleUrls: ['./push-list.component.css']
})
export class PushListComponent implements OnInit, NzSearchAdapter {
  public nzSearchAssistant: NzSearchAssistant;
  constructor(
    private globalService: GlobalService,
    private pushService: PushService
  ) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  public ngOnInit() { }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.pushService.requestPushMessageList();
  }

  public continueSearch(url: string): any {
    return this.pushService.continuePushMessageListData(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) { }
}
