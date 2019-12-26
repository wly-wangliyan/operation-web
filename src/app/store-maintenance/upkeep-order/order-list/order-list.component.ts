import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import {
  UpkeepOrderSearchParams,
  UpkeepOrderEntity,
  UpkeepOrderService,
  DoorRefundParams, MatchParams
} from '../upkeep-order.service';
import { AccessoryEntity, SpecificationEntity, ProjectEntity } from '../../accessory-library/accessory-library.service';
import { RepairShopEntity } from '../../garage-management/garage-management.service';

const PageSize = 15;


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css', '../../../../assets/less/tab-bar-list.less']
})
export class OrderListComponent implements OnInit, OnDestroy {

  public searchParams: UpkeepOrderSearchParams = new UpkeepOrderSearchParams();
  public refundParams: DoorRefundParams = new DoorRefundParams(); // 退款参数
  public orderList: Array<UpkeepOrderEntity> = []; // 救援订单列表
  public matchParams: MatchParams = new MatchParams(); // 人工匹配

  public accessoryList: Array<AccessoryEntity> = []; // 配件列表
  public repairShopList: Array<RepairShopEntity> = []; // 汽修店列表
  public specificationList: Array<SpecificationEntity> = []; // 规格列表
  private projectList: Array<ProjectEntity> = []; // 项目列表

  private bettery_project_id: string; // 蓄电池项目id

  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间
  public pay_start_time: any = ''; // 支付开始时间
  public pay_end_time: any = ''; // 支付结束时间

  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';

  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url
  private selectOrder: UpkeepOrderEntity = new UpkeepOrderEntity(); // 选中行
  private operationing = false;

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }
  constructor(
    private globalService: GlobalService,
    private orderService: UpkeepOrderService) { }

  public ngOnInit() {
    this.generateOrderList();
    this.requestProjectList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取订单列表
  private generateOrderList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestOrderList();
    });
    this.searchText$.next();
  }

  // 请求订单列表
  private requestOrderList(): void {
    this.requestSubscription = this.orderService.requestOrderListData(this.searchParams).subscribe(res => {
      this.orderList = res.results;
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
      this.continueRequestSubscription = this.orderService.continueOrderListData(this.linkUrl)
        .subscribe(res => {
          const results = res.results;
          this.orderList = this.orderList.concat(results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 条件查询
  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
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

  // 变更配件
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

  // 变更规格
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

  // 变更汽修店
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

  // 确认匹配
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
  public onRefundClick(orderItem: UpkeepOrderEntity): void {
    this.selectOrder = orderItem;
    this.refundParams = new DoorRefundParams();
    this.refundParams.refund_fee = orderItem.real_prepaid_fee ? orderItem.real_prepaid_fee / 100 : null;
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

    if (Number(this.selectOrder.real_prepaid_fee) < Number(this.refundParams.refund_fee) * 100) {
      this.globalService.promptBox.open(`退款金额应小于等于预付实收金额！`, null, 2000, null, false);
      return;
    }

    this.globalService.confirmationBox.open('提示', '操作后将退款金额原路返回至支付账户，此操作不可逆，请慎重操作！', () => {
      this.globalService.confirmationBox.close();
      this.requestPrepaidRefund();
    }, '确认退款');
  }

  private requestPrepaidRefund(): void {
    this.orderService.requestOrderRefundData(this.selectOrder.door_order_id, this.refundParams).subscribe(() => {
      this.operationing = false;
      $('#refundModal').modal('hide');
      this.globalService.promptBox.open('退款成功');
      this.searchText$.next();
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
      // if (!this.globalService.httpErrorProcess(err)) {
      //   if (err.status === 404) {
      //     this.globalService.promptBox.open('已选配件不存在，获取规格失败!', null, 2000, null, false);
      //   }
      // }
    });
  }

  // 获取可以提供对应配件的汽修店
  private requestRepairShopList(accesspry_id: string) {
    this.orderService.requestRepairShopData(accesspry_id).subscribe(res => {
      this.repairShopList = res;
    }, err => {
      this.repairShopList = [];
      this.globalService.httpErrorProcess(err);
      // if (!this.globalService.httpErrorProcess(err)) {
      //   if (err.status === 404) {
      //     this.globalService.promptBox.open('已选配件不存在，获取汽修店失败!', null, 2000, null, false);
      //   }
      // }
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
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！');
      return false;
    } else if (sPayTimestamp > ePayTimeStamp) {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间！');
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
