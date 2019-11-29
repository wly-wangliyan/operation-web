import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  UpkeepOrderEntity,
  OrderManagementService,
  SearchOrderParams,
} from 'src/app/store-maintenance/order-management/order-management.service';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SelectMultiBrandFirmComponent } from '../../../share/components/select-multi-brand-firm/select-multi-brand-firm.component';

const PageSize = 15;

@Component({
  selector: 'app-accessory-list',
  templateUrl: './accessory-list.component.html',
  styleUrls: ['./accessory-list.component.css']
})
export class AccessoryListComponent implements OnInit {

  public orderList: Array<UpkeepOrderEntity> = [];
  public pageIndex = 1;
  public searchParams = new SearchOrderParams();
  public noResultText = '数据加载中...';
  public start_pay_time = null; // 支付时间
  public end_pay_time = null;
  public start_reserve_time = null; // 预定时间
  public end_reserve_time = null;
  public workerList: Array<any> = [];

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

  @ViewChild(SelectMultiBrandFirmComponent, { static: true }) public selectMultiBrandFirmComponent: SelectMultiBrandFirmComponent;

  constructor(private globalService: GlobalService, private orderService: OrderManagementService) { }

  ngOnInit() {
    // 订单管理列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.orderService.requestOrderList(this.searchParams))
    ).subscribe(res => {
      this.orderList = res.results.map(i => ({ ...i, item_categorys: i.upkeep_item_categorys ? i.upkeep_item_categorys.split(',') : [] }));
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 推荐设置打开所属厂商选择组件
  public onOpenBrandFirmModal(): void {
    this.selectMultiBrandFirmComponent.open();
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  /** 删除配件 */
  public onDeleteAccessory(data: UpkeepOrderEntity) {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      // this.productService.requestDeleteProductData(data.product_id).subscribe(() => {
      //   this.globalService.promptBox.open('删除成功', () => {
      //     this.searchText$.next();
      //   });
      // },err => {
      //   this.globalService.httpErrorProcess(err);
      // });
    });
  }


  // 分页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      // tslint:disable-next-line:no-unused-expression
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.orderService.continueOrderList(this.linkUrl).subscribe(res => {
        this.orderList = this.orderList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
}
