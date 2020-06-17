import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import {
  UpkeepOrderSearchParams,
  UpkeepOrderEntity,
  UpkeepOrderService,
  DoorRefundParams, MatchParams, ArrivalOrderEntity
} from '../upkeep-order.service';
import { AccessoryEntity, SpecificationEntity, ProjectEntity } from '../../accessory-library/accessory-library.service';
import { RepairShopEntity } from '../../garage-management/garage-management.service';
import { TabelHelper } from '../../../../utils/table-helper';
import { environment } from '../../../../environments/environment';
import { ExamineGoodsModalComponent } from '../examine-goods-modal/examine-goods-modal.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css', '../../../../assets/less/tab-bar-list.less']
})
export class OrderListComponent implements OnInit, OnDestroy {
  public tabs = [{ key: 1, value: '到店保养' }, { key: 2, value: '上门保养' }]; // tab列表
  public tab_index = 1; // 标记当前tab索引
  public searchParams: UpkeepOrderSearchParams = new UpkeepOrderSearchParams(); // 条件筛选
  public order_start_time: any = new Date().setMonth(new Date().getMonth() - 3); // 搜索-下单开始时间
  public order_end_time: any = ''; // 搜索-下单结束时间
  public pay_start_time: any = new Date().setMonth(new Date().getMonth() - 3); // 搜索-支付开始时间
  public pay_end_time: any = ''; // 搜索-支付结束时间
  public arrivalOrderStatus = [1, 2, 3, 4, 5, 6]; // 到店保养订单状态
  public orderStatus = [1, 2, 3, 4, 5]; // 上门保养订单状态
  public refundParams: DoorRefundParams = new DoorRefundParams(); // 退款参数
  public arrivalOrderList: Array<ArrivalOrderEntity> = []; // 到店保养订单列表
  public orderList: Array<UpkeepOrderEntity> = []; // 上门保养订单列表
  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';
  public selectOrder: any; // 选中行

  public matchParams: MatchParams = new MatchParams(); // 上门保养-人工匹配
  public accessoryList: Array<AccessoryEntity> = []; // 人工匹配-配件列表
  public repairShopList: Array<RepairShopEntity> = []; // 人工匹配-汽修店列表
  public specificationList: Array<SpecificationEntity> = []; // 人工匹配-规格列表

  private projectList: Array<ProjectEntity> = []; // 项目列表
  private bettery_project_id: string; // 蓄电池项目id，用于人工匹配
  private requestArrivalOrderSubscription: Subscription; // 订阅到店保养订单数据
  private requestOrderSubscription: Subscription; // 订阅上门保养订单数据
  private searchArrivalOrderText$ = new Subject<any>();
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url
  private operationing = false;
  private searchUrl: string; // 到店保养导出url

  private get pageCount(): number {
    const pageList = this.tab_index === 1 ? this.arrivalOrderList : this.orderList;
    return Math.ceil(pageList.length / TabelHelper.NgPageSize);
  }

  @ViewChild('examineGoods', { static: true }) public examineGoodsRef: ExamineGoodsModalComponent;
  constructor(
    private globalService: GlobalService,
    private orderService: UpkeepOrderService) { }

  public ngOnInit() {
    this.searchArrivalOrderText$.pipe(debounceTime(500)).subscribe(() => {
      if (this.generateAndCheckParamsValid()) {
        this.exportSearchUrl();
        this.requestArrivalOrderList();
      }
    });

    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestOrderList();
    });

    this.searchArrivalOrderText$.next();
  }

  public ngOnDestroy() {
    this.requestArrivalOrderSubscription && this.requestArrivalOrderSubscription.unsubscribe();
    this.requestOrderSubscription && this.requestOrderSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 切换tab页时，重新获取数据
  public onTabChange(event: any): void {
    this.searchParams = new UpkeepOrderSearchParams();
    this.order_start_time = '';
    this.order_end_time = '';
    this.pay_start_time = '';
    this.pay_end_time = '';
    this.linkUrl = null;
    this.noResultText = '数据加载中...';
    this.arrivalOrderList = [];
    this.orderList = [];
    this.searchUrl = '';
    if (event === 1) {
      this.searchArrivalOrderText$.next();
      this.order_start_time = new Date().setMonth(new Date().getMonth() - 3);
      this.pay_start_time = new Date().setMonth(new Date().getMonth() - 3);
    } else if (event === 2) {
      this.searchText$.next();
      this.requestProjectList();
    }
  }

  // 请求到店保养订单列表
  private requestArrivalOrderList(): void {
    this.requestArrivalOrderSubscription = this.orderService.requestArrivalOrderListData(this.searchParams).subscribe(res => {
      this.arrivalOrderList = res.results;
      this.linkUrl = res.linkUrl;
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.exportSearchUrl();
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 请求上门订单列表
  private requestOrderList(): void {
    this.requestOrderSubscription = this.orderService.requestOrderListData(this.searchParams).subscribe(res => {
      this.orderList = res.results;
      // this.orderList[0].accessory_info.push(this.orderList[0].accessory_info[0]);
      // this.orderList[0].accessory_info = [];
      this.linkUrl = res.linkUrl;
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      if (this.tab_index === 1) {
        this.continueRequestSubscription = this.orderService.continueArrivalOrderListData(this.linkUrl)
          .subscribe(res => {
            this.arrivalOrderList = this.arrivalOrderList.concat(res.results);
            this.linkUrl = res.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
      } else if (this.tab_index === 2) {
        this.continueRequestSubscription = this.orderService.continueOrderListData(this.linkUrl)
          .subscribe(res => {
            this.orderList = this.orderList.concat(res.results);
            this.linkUrl = res.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
      }
    }
  }

  // 条件查询
  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      if (this.tab_index === 1) {
        this.searchArrivalOrderText$.next();
      } else {
        this.searchText$.next();
      }
    }
  }

  // 导出
  public onExportRecords(): void {
    if (this.generateAndCheckParamsValid()) {
      window.open(this.searchUrl);
    }
  }

  // 导出url
  private exportSearchUrl() {
    this.searchUrl = `${environment.STORE_DOMAIN}/admin/arrival_orders/export?default=1`;
    const params = this.searchParams.json();
    delete params.page_size;
    delete params.page_num;
    for (const key in params) {
      if (params[key]) {
        this.searchUrl += `&${key}=${params[key]}`;
      }
    }
  }

  // 人工匹配
  public onMatchClick(orderItem: UpkeepOrderEntity): void {
    this.selectOrder = orderItem;
    this.matchParams = new MatchParams();
    this.operationing = false;
    this.accessoryList = [];
    this.specificationList = [];
    this.repairShopList = [];
    if (orderItem.accessory_info && orderItem.accessory_info.length > 0) {
      const matched = orderItem.accessory_info[0].clone();
      if (matched.accessory_id) {
        forkJoin(this.orderService.requestAllOfConfigAccessoryData(this.bettery_project_id),
          this.orderService.requestSpecificationData(matched.accessory_id),
          this.orderService.requestRepairShopData(matched.accessory_id)).subscribe(res => {
            this.accessoryList = res[0][0];
            this.specificationList = res[1];
            this.repairShopList = res[2];
            if (this.accessoryList.some(accessory => accessory.accessory_id === matched.accessory_id)) {
              this.matchParams.accessory_id = matched.accessory_id || '';
              this.matchParams.accessory_name = matched.accessory_name;
              if (this.specificationList.some(specification => specification.specification_id === matched.specification_id)) {
                this.matchParams.specification_id = matched.specification_id || '';
                this.matchParams.battery_model = matched.battery_model;
                this.matchParams.original_fee = matched.original_fee;
                if (this.repairShopList.some(repairShop => repairShop.repair_shop_id === orderItem.repair_shop_id)) {
                  this.matchParams.repair_shop_id = orderItem.repair_shop_id || '';
                  this.matchParams.repair_shop_name = orderItem.repair_shop_name;
                } else {
                  this.matchParams.repair_shop_id = '';
                }
              } else {
                this.matchParams.specification_id = '';
                this.repairShopList = [];
              }
            } else {
              this.specificationList = [];
              this.repairShopList = [];
            }
            $('#matchModal').modal('show');
          }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
              if (err.status === 404) {
                this.requestAccessoryList(this.bettery_project_id);
              }
            }
          });
      }
    } else {
      this.requestAccessoryList(this.bettery_project_id);
    }
  }

  // 人工匹配-变更配件
  public onChangeAccessory(event: any): void {
    const selectAccessory = this.accessoryList.filter(accessory => accessory.accessory_id === this.matchParams.accessory_id);
    this.matchParams.specification_id = '';
    this.matchParams.repair_shop_id = '';
    this.matchParams.original_fee = null;
    if (event.target.value && selectAccessory.length > 0) {
      this.matchParams.accessory_name = selectAccessory[0].accessory_name;
    } else {
      this.matchParams.accessory_name = null;
    }
    this.requestSpecificationList(this.matchParams.accessory_id);
  }

  // 人工匹配-变更规格
  public onChangeSpecification(event: any): void {
    const selectSpecification = this.specificationList
      .filter(specification => specification.specification_id === this.matchParams.specification_id);
    this.matchParams.repair_shop_id = '';
    if (event.target.value && selectSpecification.length > 0) {
      this.matchParams.battery_model = selectSpecification[0].battery_model;
      this.matchParams.original_fee = selectSpecification[0].original_balance_fee;
    } else {
      this.matchParams.battery_model = null;
      this.matchParams.original_fee = null;
    }
    this.requestRepairShopList(this.matchParams.accessory_id);
  }

  // 人工匹配-变更汽修店
  public onChangeRepairShop(event: any): void {
    const selectRepairShop = this.repairShopList
      .filter(repairShop => repairShop.repair_shop_id === this.matchParams.repair_shop_id);
    if (event.target.value && selectRepairShop.length > 0) {
      this.matchParams.repair_shop_id = selectRepairShop[0].repair_shop_id;
      this.matchParams.repair_shop_name = selectRepairShop[0].repair_shop_name;
    } else {
      this.matchParams.repair_shop_id = null;
    }
  }

  // 人工匹配-确认匹配
  public onCheckMatch(): void {
    if (this.operationing) {
      return;
    }
    this.operationing = true;
    this.orderService.requestMatchDate(this.selectOrder.door_order_id, this.matchParams).subscribe(res => {
      $('#matchModal').modal('hide');
      this.globalService.promptBox.open('匹配成功');
      this.searchText$.next();
      this.operationing = false;
    }, err => {
      this.operationing = false;
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.field === 'accessory_id' && content.code === 'invalid') {
              this.globalService.promptBox.open('配件数据错误，请重试!', null, 2000, null, false);
              return;
            } else if (content.field === 'specification_id' && content.code === 'invalid') {
              this.globalService.promptBox.open('规格数据错误，请重试!', null, 2000, null, false);
              return;
            } else if (content.field === 'repair_shop_id' && content.code === 'invalid') {
              this.globalService.promptBox.open('汽修店数据错误，请重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('匹配失败，请重试!', null, 2000, null, false);
              return;
            }
          }
        } else if (err.status === 404) {
          this.globalService.promptBox.open('订单不存在，请刷新重试!', null, 2000, null, false);
          return;
        }
      } else {
        $('#matchModal').modal('hide');
      }
    });
  }

  // 退款
  public onRefundClick(orderItem: any): void {
    this.selectOrder = orderItem;
    this.refundParams = new DoorRefundParams();
    if (orderItem.arrival_order_id) {
      this.refundParams.refund_fee = orderItem.sale_total_fee ? orderItem.sale_total_fee / 100 : null;
    } else {
      this.refundParams.refund_fee = orderItem.real_prepaid_fee ? orderItem.real_prepaid_fee / 100 : null;
    }
    this.operationing = false;
    $('#refundModal').modal('show');
  }

  // 确认退款
  public onRefundCheckClick(): void {
    if (this.operationing) {
      return;
    }
    if (!this.refundParams.refund_fee || Number(this.refundParams.refund_fee) === 0) {
      this.globalService.promptBox.open('退款金额应大于0！', null, 2000, null, false);
      return;
    }

    if (this.selectOrder.door_order_id && Number(this.selectOrder.real_prepaid_fee) < Math.round(Number(this.refundParams.refund_fee) * 100)) {
      this.globalService.promptBox.open(`退款金额应小于等于预付实收金额！`, null, 2000, null, false);
      return;
    }

    if (this.selectOrder.arrival_order_id && Number(this.selectOrder.sale_total_fee) < Math.round(Number(this.refundParams.refund_fee) * 100)) {
      this.globalService.promptBox.open(`退款金额应小于等于合计实收金额！`, null, 2000, null, false);
      return;
    }

    this.globalService.confirmationBox.open('提示', '操作后将退款金额原路返回至支付账户，此操作不可逆，请慎重操作！', () => {
      this.globalService.confirmationBox.close();
      this.requestPrepaidRefund();
    }, '确认退款');
  }

  private requestPrepaidRefund(): void {
    let request = this.orderService.requestOrderRefundData(this.selectOrder.door_order_id, this.refundParams);
    if (this.selectOrder.arrival_order_id) {
      request = this.orderService.requestArrivalOrderRefundData(this.selectOrder.arrival_order_id, this.refundParams);
    }
    request.subscribe(() => {
      this.operationing = false;
      $('#refundModal').modal('hide');
      this.globalService.promptBox.open('退款成功');
      if (this.selectOrder.door_order_id) {
        this.searchText$.next();
      } else {
        this.searchArrivalOrderText$.next();
      }
    }, err => {
      this.operationing = false;
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.resource === 'pay_refund' && content.code === 'fail') {
              this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
              return;
            } else if (content.resource === 'order' && content.code === 'not_allow') {
              this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
              return;
            }
          }
        }
      } else {
        $('#refundModal').modal('hide');
      }
    });
  }

  // 获取项目列表
  private requestProjectList() {
    this.orderService.requestProjectListData().subscribe(res => {
      this.projectList = res;
      this.projectList.filter(project => {
        if (project.project_name === '蓄电池') {
          this.bettery_project_id = project.project_id;
        }
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取已设置供货方式的配件
  private requestAccessoryList(project_id: string) {
    this.orderService.requestAllOfConfigAccessoryData(project_id).subscribe(res => {
      this.accessoryList = res[0];
      $('#matchModal').modal('show');
    }, err => {
      this.accessoryList = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取配件规格
  private requestSpecificationList(accesspry_id: string) {
    this.orderService.requestSpecificationData(accesspry_id).subscribe(res => {
      this.specificationList = res;
    }, err => {
      this.specificationList = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取可以提供对应配件的汽修店
  private requestRepairShopList(accesspry_id: string) {
    this.orderService.requestRepairShopData(accesspry_id).subscribe(res => {
      this.repairShopList = res;
    }, err => {
      this.repairShopList = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  // 服务完成
  public onFinishClick(arrival_order_id: string): void {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，请确认是否已完成保养服务，且车主已知晓并同意完成服务？', () => {
      this.globalService.confirmationBox.close();
      this.orderService.requestFinishDate(arrival_order_id).subscribe(res => {
        this.globalService.promptBox.open('已完成服务');
        this.searchArrivalOrderText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('未完成服务,请重试！', null, 2000, null, false);
        }
      });
    });
  }

  // 确认收货
  public onChangeToRecive(arrival_order_id: string): void {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，确认要代替商家确认收货吗？', () => {
      this.globalService.confirmationBox.close();
      this.orderService.requestChangeStatusToRecive(arrival_order_id, 2)
        .subscribe(res => {
          this.searchArrivalOrderText$.next();
          this.globalService.promptBox.open('确认收货完成');
        }, err => {
          if (!this.globalService.httpErrorProcess(err)) {
            this.globalService.promptBox.open('确认收货失败,请重试！', null, 2000, null, false);
          }
        });
    });
  }

  // 验货完成
  public onChangeStatusToCheck(orderItem: any): void {
    this.selectOrder = orderItem;
    this.examineGoodsRef.open(this.selectOrder, () => {
      this.searchArrivalOrderText$.next();
    });
  }

  // 删除订单
  public onDeleteOrderClick(arrival_order_id: string) {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，确认要删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.orderService.requestDeleteOrder(arrival_order_id).subscribe(res => {
        this.globalService.promptBox.open('删除成功！');
        this.searchArrivalOrderText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('删除失败！', null, 2000, null, false);
        }
      });
    });
  }

  /* 生成并检查参数有效性 */
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(new Date(this.order_start_time).getHours(),
      new Date(this.order_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(new Date(this.order_end_time).getHours(),
      new Date(this.order_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    const sPayTimestamp = this.pay_start_time ? (new Date(this.pay_start_time).setHours(new Date(this.pay_start_time).getHours(),
      new Date(this.pay_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const ePayTimeStamp = this.pay_end_time ? (new Date(this.pay_end_time).setHours(new Date(this.pay_end_time).getHours(),
      new Date(this.pay_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    } else if (sPayTimestamp > ePayTimeStamp) {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }
    if (this.order_start_time || this.order_end_time) {
      this.searchParams.order_section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.order_section = null;
    }

    if (this.pay_start_time || this.pay_end_time) {
      this.searchParams.pay_section = `${sPayTimestamp},${ePayTimeStamp}`;
    } else {
      this.searchParams.pay_section = null;
    }
    return true;
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
}
