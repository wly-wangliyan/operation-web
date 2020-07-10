import { Component, OnInit } from '@angular/core';
import {
  IntegralMallHttpService,
  SearchIntegralCommodityParams,
  IntegralCommodityEntity
} from '../integral-mall-http.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { HttpErrorEntity } from '../../../../../core/http.service';

@Component({
  selector: 'app-commodity-list',
  templateUrl: './commodity-list.component.html',
  styleUrls: ['./commodity-list.component.css']
})
export class CommodityListComponent implements OnInit, NzSearchAdapter {
  public nzSearchAssistant: NzSearchAssistant;
  public searchParams = new SearchIntegralCommodityParams();
  public start_time: any = '';
  public end_time: any = '';

  constructor(
    public globalService: GlobalService,
    private integralMallHttpService: IntegralMallHttpService
  ) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  ngOnInit() {
  }

  // 置顶商品
  public onTopCommodityClick(commodity_id: string): void {
    this.integralMallHttpService.requestTopCommodity(commodity_id)
      .subscribe(res => {
        this.nzSearchAssistant.submitSearch(true);
        this.globalService.promptBox.open('置顶成功');
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open(`置顶失败，请刷新重试！`, null, 2000, null, false);
        }
      });
  }


  /** 删除商品 */
  public onDeleteCommodityClick(commodity_id: string): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.integralMallHttpService.requestDeleteCommodityData(commodity_id)
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

  // 变更销售状态
  public onChangeSwitchStatus(data: IntegralCommodityEntity): void {
    const swith_status = data.status === 1 ? 2 : 1;
    const tipMsg = swith_status === 1 ? '上架' : '下架';
    this.integralMallHttpService.requestChangeCommodityStatus(data.commodity_id, swith_status).subscribe(() => {
      this.nzSearchAssistant.submitSearch(true);
      this.globalService.promptBox.open(`${tipMsg}成功`);
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.field === 'status' && content.code === 'missing_field') {
              this.globalService.promptBox.open(`参数缺失，无法${tipMsg}!`, null, 2000, null, false);
            } else if (content.field === 'status' && content.code === 'invalid') {
              this.globalService.promptBox.open(`参数不合法，无法${tipMsg}!`, null, 2000, null, false);
            } else {
              this.globalService.promptBox.open(`${tipMsg}失败！`, null, 2000, null, false);
            }
          }
        }
      }
    });
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
  public searchCompleteProcess(): any { }

  // 开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  }

  // 结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  }
}
