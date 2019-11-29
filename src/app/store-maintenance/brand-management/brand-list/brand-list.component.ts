import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  UpkeepOrderEntity,
  OrderManagementService,
  SearchOrderParams,
} from 'src/app/store-maintenance/order-management/order-management.service';
import { Subject, Subscription, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BrandEditComponent } from './brand-edit/brand-edit.component';
import { BannerEntity } from 'src/app/operational-system/operation/mini-program/banner-management/banner.service';
const PageSize = 15;

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {

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

  constructor(private globalService: GlobalService, private orderService: OrderManagementService) { }

  @ViewChild('brandEdit', { static: false }) public brandEdit: BrandEditComponent;

  ngOnInit() {
    // 订单管理列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.orderService.requestOrderList(this.searchParams))
    ).subscribe(res => {
      this.orderList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 显示添加编辑Bannermodal
  public onShowModal(data?: BannerEntity) {
    const banner_id = data ? data.banner_id : null;
    this.brandEdit.open(banner_id, () => {
      this.brandEdit.clear();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, () => {
      this.brandEdit.clear();
    });
  }

  /** 删除品牌 */
  public onDeleteBrand(data: UpkeepOrderEntity) {
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
