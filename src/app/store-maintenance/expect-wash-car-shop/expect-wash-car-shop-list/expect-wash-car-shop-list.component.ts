import { Component, OnInit } from '@angular/core';
import { NzSearchAssistant } from '../../../share/nz-search-assistant';
import { GlobalService } from '../../../core/global.service';
import { DisabledTimeHelper } from '../../../../utils/disabled-time-helper';
import { ExpectWashCarShopService, WishWashShopParams } from '../expect-wash-car-shop.service';

@Component({
  selector: 'app-expect-wash-car-shop-list',
  templateUrl: './expect-wash-car-shop-list.component.html',
  styleUrls: ['./expect-wash-car-shop-list.component.css']
})
export class ExpectWashCarShopListComponent implements OnInit {

  public nzSearchAssistant: NzSearchAssistant;
  public searchParams = new WishWashShopParams();
  public start_time = null;
  public end_time = null;

  constructor(private globalService: GlobalService,
              private expectService: ExpectWashCarShopService) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  ngOnInit() {
  }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.expectService.requestWishWashShopList(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.expectService.continueWishWashShopList(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
        new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp && eTimeStamp) {
      if (sTimestamp > eTimeStamp) {
        this.globalService.promptBox.open('推送开始时间不能大于结束时间！', null, 2000, null, false);
        return false;
      }
    }
    this.searchParams.add_section = sTimestamp + ',' + eTimeStamp;
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) { }

  // 开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  }

  // 结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  }

   // 已阅
  public onReadedClick(wash_shop_id: string) {
    this.expectService.requestReadedWishWashShop(wash_shop_id, true).subscribe(() => {
      this.globalService.promptBox.open('已阅成功！');
      this.nzSearchAssistant.submitSearch(false);
    }, err => {
      this.globalService.promptBox.open('已阅失败，请重试！', null, 2000, null, false);
    });
  }

  // 删除
  public onDeleteClick(wash_shop_id: string) {
    this.globalService.confirmationBox.open('删除', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.expectService.requestDeleteWishWashShop(wash_shop_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功', () => {
          this.nzSearchAssistant.submitSearch(false);
        });
      }, err => {
        this.globalService.promptBox.open('删除失败，请重试！', null, 2000, null, false);
      });
    });
  }
}
