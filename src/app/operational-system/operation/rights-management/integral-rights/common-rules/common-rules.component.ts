import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { IntegralRightsHttpService, IntegralStatistics, CommonRuleEntity } from '../integral-rights-http.service';
import { Subject, forkJoin } from 'rxjs';
import { ValidDateConfigModalComponent } from './valid-date-config-modal/valid-date-config-modal.component';
import { LimitConfigModalComponent } from './limit-config-modal/limit-config-modal.component';
import { MathHelper } from 'src/utils/math-helper';

@Component({
  selector: 'app-common-rules',
  templateUrl: './common-rules.component.html',
  styleUrls: ['./common-rules.component.less']
})
export class CommonRulesComponent implements OnInit {
  public ruleDetail: CommonRuleEntity = new CommonRuleEntity();
  public nzDataList = [];
  public noResultText = '数据加载中...';
  public searchText$ = new Subject<any>();
  public statisticData: IntegralStatistics = new IntegralStatistics();
  public clearMonthStr = '';
  public clearDayStr = '';

  @ViewChild('validDateConfigModal', { static: false }) private validDateConfigModal: ValidDateConfigModalComponent;
  @ViewChild('limitConfigModal', { static: false }) private limitConfigModal: LimitConfigModalComponent;
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
        this.nzDataList = [res[1]];
        this.ruleDetail = res[1];
        this.clearMonthStr = this.ruleDetail.month ? MathHelper.MathPadStart(this.ruleDetail.month, 2) : '';
        this.clearDayStr = this.ruleDetail.day ? MathHelper.MathPadStart(this.ruleDetail.day, 2) : '';
        this.noResultText = '暂无数据';
      }, err => {
        this.noResultText = '暂无数据';
        this.globalService.httpErrorProcess(err);
      });
  }

  // 设置积分有效期
  public onConfigValidDateClick(): void {
    if (!this.ruleDetail.config_id) {
      this.globalService.promptBox.open('通用积分规则主键获取失败，\n请刷新重试！', null, -1, null, false);
      return;
    }
    this.validDateConfigModal.open(this.ruleDetail, () => {
      this.requestCommonIntegralRule();
    });
  }

  // 设置积分上限
  public onConfigLimitClick(): void {
    if (!this.ruleDetail.config_id) {
      this.globalService.promptBox.open('通用积分规则主键获取失败，\n请刷新重试！', null, -1, null, false);
      return;
    }
    this.limitConfigModal.open(this.ruleDetail, () => {
      this.requestCommonIntegralRule();
    });
  }
}
