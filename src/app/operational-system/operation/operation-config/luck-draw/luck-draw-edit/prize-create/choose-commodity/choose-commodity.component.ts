import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import {
  CommodityEntity,
  GoodsManagementHttpService, SpecificationEntity
} from '../../../../../../mall/goods-management/goods-management-http.service';
import { GlobalService } from '../../../../../../../core/global.service';
import { debounceTime } from 'rxjs/internal/operators';
import { CommoditySearchParams, LuckDrawService, PrizeInfoEntity } from '../../../luck-draw.service';

const PageSize = 15;

class CommodityItem {
  public isChoose = false;
  public specification: SpecificationEntity;
  public source: CommodityEntity;

  constructor(source?: CommodityEntity) {
    this.source = source;
  }
}

class SpecificationItem {
  public isChoose = false;
  public source: SpecificationEntity;

  constructor(source: SpecificationEntity) {
    this.source = source;
  }
}

@Component({
  selector: 'app-choose-commodity',
  templateUrl: './choose-commodity.component.html',
  styleUrls: ['./choose-commodity.component.css']
})
export class ChooseCommodityComponent implements OnInit {
  public commodityList: Array<CommodityItem> = []; // 商品列表
  public specificationList: Array<SpecificationItem> = []; // 商品列表
  public noResultText = '数据加载中...';
  public pageIndex = 1; // 页码
  public searchParams: CommoditySearchParams = new CommoditySearchParams();
  public currentCommodity = new CommodityItem();

  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private sureCallback: any;
  private closeCallback: any;
  private searchText$ = new Subject<any>();
  private prize_info: PrizeInfoEntity = new PrizeInfoEntity();

  @ViewChild('addCommodityPromptDiv', { static: false }) public addCommodityPromptDiv: ElementRef;
  @ViewChild('addSpecificationPromptDiv', { static: false }) public addSpecificationPromptDiv: ElementRef;
  @Output() public saveCommodity = new EventEmitter();

  private get pageCount(): number {
    if (this.commodityList.length % PageSize === 0) {
      return this.commodityList.length / PageSize;
    }
    return this.commodityList.length / PageSize + 1;
  }

  constructor(public globalService: GlobalService,
              private luckDrawService: LuckDrawService,
              private goodsHttpService: GoodsManagementHttpService) { }

  ngOnInit() {
  }

  private rquestCommodityList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(100)).subscribe(() => {
      this.luckDrawService.requestCommodityListData(this.searchParams).subscribe(res => {
        this.commodityList = [];
        res.results.forEach(value => {
          const commodity = new CommodityItem(value);
           // 单规格的商品默认显示规格售价、库存、名称
          if (commodity.source.specifications.length === 1) {
            commodity.specification = commodity.source.specifications[0];
          }
          if (value.commodity_id === this.prize_info.commodity_id) {
            commodity.isChoose = true;
            value.specifications.forEach(value1 => {
              if (value1.specification_id === this.prize_info.specification_id) {
                commodity.specification = value1;
              }
            });
            this.currentCommodity = commodity;
          }
          this.commodityList.push(commodity);
        });
        this.pageIndex = 1;
        this.noResultText = '暂无数据';
      }, err => {
        this.pageIndex = 1;
        this.noResultText = '暂无数据';
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchText$.next();
  }

  // 查询奖品
  public onSearchBtnClick() {
    this.searchText$.next();
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
       // 当存在linkUrl并且快到最后一页了请求数据
       this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
       this.continueRequestSubscription = this.goodsHttpService.requestContinueCommodityListData(this.linkUrl)
           .subscribe(res => {
             this.commodityList = this.commodityList.concat(res.results);
             this.linkUrl = res.linkUrl;
           }, err => {
             this.globalService.httpErrorProcess(err);
           });
    }
  }

  /**
   * 打开选择商品框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(prize_info: PrizeInfoEntity, sureFunc: any, closeFunc: any = null) {
    const openCommodityModal = () => {
      timer(0).subscribe(() => {
        $(this.addCommodityPromptDiv.nativeElement).modal('show');
      });
    };
    this.prize_info = prize_info;
    this.commodityList = [];
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.searchText$ = new Subject<any>();
    this.searchParams = new CommoditySearchParams();
    this.currentCommodity = new CommodityItem();
    this.rquestCommodityList();
    openCommodityModal();
  }

  public onClose() {
    this.searchText$ && this.searchText$.unsubscribe();
    $(this.addCommodityPromptDiv.nativeElement).modal('hide');
  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 保存选择的商品
  public onAddCommodityClick() {
    this.sureCallbackInfo();
    this.onClose();
  }

  // 选择商品规格，赋值规格列表
  public onChooseSpecificationClick(commodity: CommodityItem) {
    if (!commodity.isChoose) {
      return;
    }
    this.specificationList = [];
    commodity.source.specifications.forEach(value => {
      const specificationItem = new SpecificationItem(value);
      // 默认勾选已经选中过的
      if (commodity.specification && commodity.specification.specification_id === value.specification_id) {
        specificationItem.isChoose = true;
      }
      this.specificationList.push(specificationItem);
    });
    $(this.addSpecificationPromptDiv.nativeElement).modal('show');
  }

  // radio更改时，先把所有的radio取消选中
  public onCommodityRadioChange(commodity: CommodityItem) {
    this.currentCommodity = commodity;
    this.commodityList.forEach(value => {
      value.isChoose = false;
    });
  }

  // radio更改时，先把所有的radio取消选中， 选完后自动关闭弹窗
  public onSpecificationRadioChange(specification: SpecificationEntity) {
    this.specificationList.forEach(value => {
      value.isChoose = false;
    });
    timer(0).subscribe(() => {
      this.currentCommodity.specification = specification;
      $(this.addSpecificationPromptDiv.nativeElement).modal('hide');
    });
  }
}
