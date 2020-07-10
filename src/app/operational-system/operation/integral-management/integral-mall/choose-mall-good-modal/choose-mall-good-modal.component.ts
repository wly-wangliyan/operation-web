import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import {
  CommoditySearchParams,
  GoodsManagementHttpService,
  CommodityEntity
} from '../../../../mall/goods-management/goods-management-http.service';
import { NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-choose-mall-good-modal',
  templateUrl: './choose-mall-good-modal.component.html',
  styleUrls: ['./choose-mall-good-modal.component.less']
})
export class ChooseMallGoodModalComponent implements OnInit {
  public nzSearchAssistant: NzSearchAssistant;
  public searchParams: CommoditySearchParams = new CommoditySearchParams();
  public selectedGood: CommodityEntity; // 勾选的商品

  @Output() public selectedGoodEvent = new EventEmitter(); // 发送选中的商品信息
  constructor(
    public globalService: GlobalService,
    private goodsManagementHttpService: GoodsManagementHttpService
  ) { }

  ngOnInit() {
    this.nzSearchAssistant = new NzSearchAssistant(this, 5);
  }

  public open(commodity_type: number) {
    this.nzSearchAssistant.nzData = [];
    this.searchParams.commodity_type = commodity_type;
    this.selectedGood = null;
    timer(0).subscribe(() => {
      $('#chooseGoodModal').modal();
      this.nzSearchAssistant.submitSearch(true);
    });
  }

  // 勾选商品
  public onItemChecked(commodity: CommodityEntity, checked: boolean): void {
    this.selectedGood = checked ? commodity : null;
  }

  // 确定
  public onCheckClick() {
    $('#chooseGoodModal').modal('hide');
    this.selectedGoodEvent.emit({ commodity: this.selectedGood });
  }

  /** 翻页清除选中项 */
  public onPageSelectd(event: any) {
    this.selectedGood = null;
    this.nzSearchAssistant.pageSelected(event);
  }

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    this.selectedGood = null;
    return this.goodsManagementHttpService.requestCommodityListData(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.goodsManagementHttpService.requestContinueCommodityListData(url);
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
