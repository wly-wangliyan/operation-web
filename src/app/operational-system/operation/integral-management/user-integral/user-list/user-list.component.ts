import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { UserIntegralHttpService, SearchUserIntegralParams } from '../user-integral-http.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, NzSearchAdapter {
  public searchParams: SearchUserIntegralParams = new SearchUserIntegralParams();
  public nzSearchAssistant: NzSearchAssistant;

  constructor(
    private globalService: GlobalService,
    private userIntegralHttpService: UserIntegralHttpService) { }

  ngOnInit() {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    // return this.userIntegralHttpService;
  }

  public continueSearch(url: string): any {
    // return this.userIntegralHttpService.requestContinueData(url);
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
