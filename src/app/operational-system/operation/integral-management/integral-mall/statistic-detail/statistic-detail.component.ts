import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { DisabledTimeHelper } from 'src/utils/disabled-time-helper';
import { IntegralMallHttpService, SearchDailyClickParams, IntegralCommodityEntity } from '../integral-mall-http.service';

@Component({
  selector: 'app-statistic-detail',
  templateUrl: './statistic-detail.component.html',
  styleUrls: ['./statistic-detail.component.css']
})
export class StatisticDetailComponent implements OnInit, NzSearchAdapter {
  public nzSearchAssistant: NzSearchAssistant;
  private searchParams: SearchDailyClickParams = new SearchDailyClickParams();
  public start_time: any = '';
  public end_time: any = '';
  private commodity_id: string;
  public commodityInfo: IntegralCommodityEntity = undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalService: GlobalService,
    private integralMallHttpService: IntegralMallHttpService) {
    this.route.paramMap.subscribe(map => {
      this.commodity_id = map.get('commodity_id');
    });
  }

  ngOnInit() {
    this.requestCommodityDetail();
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  private requestCommodityDetail(): void {
    this.integralMallHttpService.requestCommodityDetailData(this.commodity_id).subscribe(data => {
      this.commodityInfo = data;
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.globalService.promptBox.open('商品详情获取失败，请刷新后重试！', () => {
            window.history.back();
          }, 2000, null, false);
        }
      }
    });
  }

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    return this.integralMallHttpService.requestDailyClickStatisticData(this.commodity_id, this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.integralMallHttpService.continueDailyClickStatisticData(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const cTime = new Date().getTime() / 1000;
    const sTime = this.start_time ? ((new Date(this.start_time).setHours(0, 0, 0, 0) / 1000)) : 0;
    const eTime = this.end_time ? ((new Date(this.end_time).setHours(23, 59, 59, 0) / 1000)) : cTime;
    this.searchParams.section = `${sTime},${eTime}`;
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any): any {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(): any { }

  // 下单开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  }

  // 下单结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  }
}
