import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { GoodsOrderEntity, GoodsOrderManagementHttpService, OrderDetailEntity, SearchParams } from '../goods-order-management-http.service';
import { GoodsOrderDeliveryComponent } from '../goods-order-delivery/goods-order-delivery.component';
import { environment } from '../../../../../environments/environment';

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
    private orderHttpService: GoodsOrderManagementHttpService) { }

  public searchParams: SearchParams = new SearchParams(); // 条件筛选

  public orderList: Array<GoodsOrderEntity> = []; // 产品订单列表

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string; // 分页url

  private searchUrl: string;

  @ViewChild('orderDeliveryComponent', { static: true }) public orderDeliveryComponent: GoodsOrderDeliveryComponent;

  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间

  public pay_start_time: any = ''; // 支付开始时间
  public pay_end_time: any = ''; // 支付结束时间

  public pay_status = ''; // 	int	F	订单状态 1:待支付 2:已支付 3:已取消
  public delivery_status = ''; // 	int	F	发货状态 1:待发货 2:已发货 3:已签收
  public mobile = undefined; // 	String	F	购买人手机号
  public contact = undefined; // 	String	F	收货人
  public order_id = undefined; // 	string	F	订单ID
  public commodity_name = undefined; // 	string	F	商品名称
  public order_time = undefined; // 	string	F	下单时间 12154.0,232645.0
  public pay_time = undefined; // 	string	F	支付时间 12154.0,232645.0
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数

  public ngOnInit() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestOrderList();
    });
    this.searchText$.next();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 请求订单列表
  private requestOrderList() {
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

  // 条件筛选
  public onSearchBtnClick() {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
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
    this.searchUrl = `${environment.MALL_DOMAIN}/admin/orders/export=
    ${this.searchParams.pay_status}&delivery_status=${this.searchParams.delivery_status}
    &mobile=${this.searchParams.mobile}&contact=
    ${this.searchParams.contact}&order_id=${this.searchParams.order_id}
    &commodity_name=${this.searchParams.commodity_name}&order_time=
    ${this.searchParams.order_time}&pay_time=${this.searchParams.pay_time}`;
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

  // 导出订单管理列表
  public onExportOrderList() {
    if (this.getTimeValid() === 'order_time') {
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！', null, 2000, '/assets/images/warning.png');
    } else if (this.getTimeValid() === 'pay_time') {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间!', null, 2000, '/assets/images/warning.png');
    } else {
      if (this.searchUrl) {
        window.open(this.searchUrl);
      } else {
        return;
      }
    }
  }

  // 查询时间校验
  private getTimeValid(): string {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(new Date(this.order_start_time).getHours(),
      new Date(this.order_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(new Date(this.order_end_time).getHours(),
      new Date(this.order_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    const sPayTimestamp = this.pay_start_time ? (new Date(this.pay_start_time).setHours(new Date(this.pay_start_time).getHours(),
      new Date(this.pay_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const ePayTimeStamp = this.pay_end_time ? (new Date(this.pay_end_time).setHours(new Date(this.pay_end_time).getHours(),
      new Date(this.pay_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      return 'order_time';
    } else if (sPayTimestamp > ePayTimeStamp) {
      return 'pay_time';
    } else {
      return '';
    }
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

}
