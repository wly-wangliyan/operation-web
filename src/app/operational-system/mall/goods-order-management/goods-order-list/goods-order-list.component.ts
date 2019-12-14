import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { GoodsOrderEntity, GoodsOrderManagementHttpService, OrderDetailEntity, SearchParams } from '../goods-order-management-http.service';
import { GoodsOrderDeliveryComponent } from '../goods-order-delivery/goods-order-delivery.component';
import { GoodsOrderRefundComponent } from '../goods-order-refund/goods-order-refund.component';
import { environment } from '../../../../../environments/environment';
import { GoodsOrderRemarkComponent } from '../goods-order-remark/goods-order-remark.component';
import { GoodsWriteOffComponent } from '../goods-write-off/goods-write-off.component';
import { BusinessEntity, BusinessManagementService, SearchParams as BussinessParams } from '../../business-management/business-management.service';

const PageSize = 15;

@Component({
  selector: 'app-goods-order-list',
  templateUrl: './goods-order-list.component.html',
  styleUrls: ['./goods-order-list.component.css']
})
export class GoodsOrderListComponent implements OnInit, OnDestroy {

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private orderHttpService: GoodsOrderManagementHttpService, private businessService: BusinessManagementService) { }

  public searchParams: SearchParams = new SearchParams(); // 条件筛选
  public bussinessParams: BussinessParams = new BussinessParams(); // 条件筛选
  public orderList: Array<GoodsOrderEntity> = []; // 产品订单列表
  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';
  public businessList: Array<BusinessEntity> = [];
  public supplierList: Array<any> = [];
  public tabs: Array<any> = [];
  public tab: number;
  public selectedTabIndex: number;
  public refund_type = '0';
  public commodity_type = '0';
  public shipping_method = '0';
  public tab_refund_type = null;

  private searchText$ = new Subject<any>();
  private searchSupplierText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private requestSubscription: Subscription; // 获取数据

  private linkUrl: string; // 分页url

  private searchUrl: string;

  @ViewChild('orderDeliveryComponent', { static: true }) public orderDeliveryComponent: GoodsOrderDeliveryComponent;
  @ViewChild('orderRefund', { static: true }) public orderRefund: GoodsOrderRefundComponent;
  @ViewChild('orderRemark', { static: true }) public orderRemark: GoodsOrderRemarkComponent;
  @ViewChild('writeOff', { static: true }) public writeOff: GoodsWriteOffComponent;

  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间

  public pay_start_time: any = ''; // 支付开始时间
  public pay_end_time: any = ''; // 支付结束时间

  public ngOnInit() {
    this.tabs = [
      { key: 0, value: '全部' },
      { key: 1, value: '待支付' },
      { key: 2, value: '待发货' },
      { key: 3, value: '已发货' },
      { key: 4, value: '已完成' },
      { key: 5, value: '售后/退款' },
      { key: 6, value: '已关闭' },
    ];

    this.selectedTabIndex = 0;

    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.onTabChange(0);
    });
    this.searchText$.next();

    this.searchSupplierText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.businessService.requestBusinessList(this.bussinessParams))
    ).subscribe(res => {
      this.businessList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchSupplierText$.next();
  }

  // 切换tab
  public onTabChange(key: number) {
    this.tab = key;
    if (key === 1) {
      this.searchParams.pay_status = 1;
    } else if (key === 2) {
      this.searchParams.delivery_status = 1;
    } else if (key === 3) {
      this.searchParams.delivery_status = 2;
    } else if (key === 4) {
      this.searchParams.order_status = 2;
    } else if (key === 5) {
      this.tab_refund_type = 2;
    } else if (key === 6) {
      this.searchParams.pay_status = 3;
    }
    this.requestOrderList();
  }

  // 初始化检索参数
  public initSearchParams() {
    this.refund_type = '0';
    this.commodity_type = '0';
    this.shipping_method = '0';
    this.tab_refund_type = null;
    this.commodity_type = '0';
    this.searchParams = new SearchParams();
    this.order_start_time = ''; // 下单开始时间
    this.order_end_time = ''; // 下单结束时间
    this.pay_start_time = ''; // 支付开始时间
    this.pay_end_time = ''; // 支付结束时间
  }


  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 请求订单列表
  private requestOrderList() {
    this.handelParams();
    this.orderHttpService.requestGoodsOrderList(this.searchParams).subscribe(res => {
      this.orderList = res.results;
      this.linkUrl = res.linkUrl;
      this.initPageIndex();
      this.noResultText = '暂无数据';
      this.exportSearchUrl();
    }, err => {
      this.initPageIndex();
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 处理入参
  private handelParams() {
    this.searchParams.refund_type = this.tab === 5 ? 2 : this.refund_type !== '0' ? Number(this.refund_type) : null;
    this.searchParams.commodity_type = this.commodity_type !== '0' ? Number(this.commodity_type) : null;
    if (this.shipping_method !== '0' && this.shipping_method !== '1') {
      this.searchParams.shipping_method = 2;
      this.searchParams.business_id = this.shipping_method;
    } else if (this.shipping_method === '1') {
      this.searchParams.shipping_method = 1;
      this.searchParams.business_id = '';
    } else {
      this.searchParams.shipping_method = null;
      this.searchParams.business_id = '';
    }
  }

  // 条件筛选
  public onSearchBtnClick() {
    if (this.generateAndCheckParamsValid()) {
      this.onTabChange(this.tab);
    }
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.orderHttpService.continueOrderList(this.linkUrl)
        .subscribe(res => {
          this.orderList = this.orderList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

  // 导出url
  private exportSearchUrl() {
    this.handelParams();
    // tslint:disable-next-line:max-line-length
    this.searchUrl = `${environment.MALL_DOMAIN}/admin/orders/export?pay_status=${this.searchParams.pay_status}&delivery_status=${this.searchParams.delivery_status}&refund_type=${this.searchParams.refund_type}&order_status=${this.searchParams.order_status}&commodity_type=${this.searchParams.commodity_type}&shipping_method=${this.searchParams.shipping_method}&business_id=${this.searchParams.business_id}&mobile=${this.searchParams.mobile}&contact=${this.searchParams.contact}&order_id=${this.searchParams.order_id}&commodity_name=${this.searchParams.commodity_name}&order_time=${this.searchParams.order_time || ''}&pay_time=${this.searchParams.pay_time || ''}`;
  }

  // 下单开始时间的禁用部分
  public disabledOrderStartTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.order_end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.order_end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 下单结束时间的禁用部分
  public disabledOrderEndTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.order_start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.order_start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 支付开始时间的禁用部分
  public disabledStartPayTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.pay_end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.pay_end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 支付结束时间的禁用部分
  public disabledEndPayTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.pay_start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.pay_start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 导出订单管理列表
  public onExportOrderList() {
    if (this.generateAndCheckParamsValid() && this.searchUrl) {
      window.open(this.searchUrl);
    } else {
      return;
    }
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(new Date(this.order_start_time).getHours(),
      new Date(this.order_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(new Date(this.order_end_time).getHours(),
      new Date(this.order_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    const sPayTimestamp = this.pay_start_time ? (new Date(this.pay_start_time).setHours(new Date(this.pay_start_time).getHours(),
      new Date(this.pay_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const ePayTimeStamp = this.pay_end_time ? (new Date(this.pay_end_time).setHours(new Date(this.pay_end_time).getHours(),
      new Date(this.pay_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！', null, 2000, '/assets/images/warning.png');
      return false;
    } else if (sPayTimestamp > ePayTimeStamp) {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间！', null, 2000, '/assets/images/warning.png');
      return false;
    }
    if (this.order_start_time || this.order_end_time) {
      this.searchParams.order_time = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.order_time = null;
    }

    if (this.pay_start_time || this.pay_end_time) {
      this.searchParams.pay_time = `${sPayTimestamp},${ePayTimeStamp}`;
    } else {
      this.searchParams.pay_time = null;
    }
    return true;
  }

  /*
  * 编辑物流信息
  * @param data GoodsOrderEntity 商品信息
  * */
  public onEditDeliveryClick(data: GoodsOrderEntity) {
    this.orderDeliveryComponent.open(data, () => {
      this.initPageIndex();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '保存');
  }

  /*
  * 退款
  * @param data GoodsOrderEntity 商品信息
  * */
  public onEditRefundClick(data: GoodsOrderEntity) {
    this.orderRefund.open(data, () => {
      this.initPageIndex();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '确认退款');
  }

  /*
  * 确认收货
  * @param data GoodsOrderEntity 商品信息
  * */
  public onConfiemClick(data: GoodsOrderEntity) {
    this.globalService.confirmationBox.open('提示', '确认收货后无法撤销，确认此操作吗？', () => {
      this.globalService.confirmationBox.close();
      this.orderHttpService.requestConfirmReceipt(data.order_id).subscribe(res => {
        this.searchText$.next();
        this.globalService.promptBox.open('确认收货成功！');
      });
    });
  }

  /*
  * 修改备注信息
  * @param data GoodsOrderEntity 商品信息
  * */
  public onUpdateRemarkClick(title: string, data: GoodsOrderEntity) {
    this.orderRemark.open(title, data, () => {
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '保存');
  }

  // 核销
  public onWriteOff(data: GoodsOrderEntity) {
    this.writeOff.open(data, () => {
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    });
  }

}
