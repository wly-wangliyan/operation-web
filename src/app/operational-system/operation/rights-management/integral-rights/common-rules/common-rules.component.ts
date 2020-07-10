import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { IntegralRightsHttpService, IntegralStatistics, CommonRuleEntity } from '../integral-rights-http.service';
import { Subject, forkJoin } from 'rxjs';
import { ValidDateConfigModalComponent } from './valid-date-config-modal/valid-date-config-modal.component';
import { LimitConfigModalComponent } from './limit-config-modal/limit-config-modal.component';
import { MathHelper } from 'src/utils/math-helper';
import { IssueTimeModalComponent } from './issue-time-modal/issue-time-modal.component';

@Component({
  selector: 'app-common-rules',
  templateUrl: './common-rules.component.html',
  styleUrls: ['./common-rules.component.less']
})
export class CommonRulesComponent implements OnInit {
  public ruleDetail: CommonRuleEntity = new CommonRuleEntity();
  public searchText$ = new Subject<any>();
  public statisticData: IntegralStatistics = new IntegralStatistics();
  public clearMonthStr = '';
  public clearDayStr = '';

  @ViewChild('validDateConfigModal', { static: false }) private validDateConfigModal: ValidDateConfigModalComponent;
  @ViewChild('limitConfigModal', { static: false }) private limitConfigModal: LimitConfigModalComponent;
  @ViewChild('issueTimeModal', { static: false }) private issueTimeModal: IssueTimeModalComponent;
  constructor(
    private globalService: GlobalService,
    private integralRightsHttpService: IntegralRightsHttpService
  ) { }

  ngOnInit() {
    this.requestCommonIntegralRule();
  }

  // 获取通用积分统计及通用积分规则
  private requestCommonIntegralRule(): void {
    forkJoin(
      this.integralRightsHttpService.requestIntegralStatisticsData(),
      this.integralRightsHttpService.requestCommonIntegralRuleDetail())
      .subscribe(res => {
        this.statisticData = res[0];
        this.ruleDetail = res[1];
        this.clearMonthStr = this.ruleDetail.month ? MathHelper.MathPadStart(this.ruleDetail.month, 2) : '';
        this.clearDayStr = this.ruleDetail.day ? MathHelper.MathPadStart(this.ruleDetail.day, 2) : '';
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 打开设置窗体
  public onOpenConfigModal(type: number): void {
    if (!this.ruleDetail.config_id) {
      this.globalService.promptBox.open('通用积分规则主键获取失败，\n请刷新重试！', null, -1, null, false);
      return;
    }
    const modalRef = type === 1 ? this.validDateConfigModal : type === 2 ? this.limitConfigModal : this.issueTimeModal;
    modalRef.open(this.ruleDetail, () => {
      this.requestCommonIntegralRule();
    });
  }
}
