import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  ServiceFeeEntity,
  ServiceFeesManagementService,
  SearchParams,
} from '../service-fees-management.service';
import {
  WashCarServiceConfigService,
  WashCarServiceConfigEntity,
  WashCarSpecificationEntity,
  BasePriceEntity,
} from '../wash-car-service-config.service';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';

const PageSize = 15;

export class TabItem {
  key: number;
  value: string;
}

@Component({
  selector: 'app-service-fees-list',
  templateUrl: './service-fees-list.component.html',
  styleUrls: ['./service-fees-list.component.css', '../../../../assets/less/tab-bar-list.less']
})
export class ServiceFeesListComponent implements OnInit {

  public serviceFeeList: Array<ServiceFeeEntity> = [];
  public pageIndex = 1;
  public searchParams = new SearchParams();
  public noResultText = '数据加载中...';
  public tabs: Array<TabItem> = [{ key: 1, value: '救援服务' }, { key: 2, value: '洗车服务' }];
  public washTabs: Array<TabItem> = [{ key: 1, value: '5座小型车' }, { key: 2, value: 'SUV/MPV' }]; // 洗车服务下tab
  public washServiceConfig: WashCarServiceConfigEntity = new WashCarServiceConfigEntity(); // 洗车服务配置
  public specificationList: Array<WashCarSpecificationEntity> = []; // 规格
  public basePrice: Array<BasePriceEntity> = []; // 基础价格
  public valid_unit = { day: '天', month: '月', year: '年' };
  public selectedCarTypeTabIndex = 1;
  public selectedTabIndex = 1;

  private searchText$ = new Subject<any>();
  private searchWashCarText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.serviceFeeList.length % PageSize === 0) {
      return this.serviceFeeList.length / PageSize;
    }
    return this.serviceFeeList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService, private feesService: ServiceFeesManagementService,
    private washCarService: WashCarServiceConfigService) { }

  public ngOnInit() {
    // 救援服务
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.feesService.requestServiceFeeListData(this.searchParams).subscribe(res => {
        this.serviceFeeList = res.results;
        this.getPriceData();
        this.linkUrl = res.linkUrl;
        this.noResultText = '暂无数据';
        this.pageIndex = 1;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchWashCarText$.pipe(debounceTime(500)).subscribe(() => {
      this.washCarService.requestWashCarServiceConfigData().subscribe(res => {
        this.washServiceConfig = res;
        this.washServiceConfig.base_price_info = res.base_price_info ? res.base_price_info : [];
        this.washServiceConfig.specification_info = res.specification_info ? res.specification_info : [];
        this.calculateSpecificationPrice();
        this.specificationList = this.washServiceConfig.specification_info.filter(specification => specification.car_type === 1);
      });
    });
    this.searchText$.next();
  }

  /**
   * 列表价格数据计算
   * 原价：尾款原价+预付原价
   * 现价：尾款现价+预付现价
   */
  private getPriceData() {
    this.serviceFeeList.forEach(i => {
      i.initial_price = i.balance_initial_price && i.prepay_initial_price
        ? Number(i.balance_initial_price) + Number(i.prepay_initial_price) : i.balance_initial_price || i.prepay_initial_price
        || 0;
      i.current_price = i.balance_current_price && i.prepay_current_price
        ? Number(i.balance_current_price) + Number(i.prepay_current_price) : i.balance_current_price || i.prepay_current_price
        || 0;
    });
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      // tslint:disable-next-line:no-unused-expression
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.feesService.continueServiceFeeListData(this.linkUrl).subscribe(res => {
        this.serviceFeeList = this.serviceFeeList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
  /**
   * 列表规格原价数据计算
   * 原价= 标准洗车原价×标准洗车次数 +（标准洗车+打蜡次数原价）×（标准洗车+打蜡次数）
   */
  private calculateSpecificationPrice() {
    this.washServiceConfig.specification_info.forEach(item => {
      const base_price = this.washServiceConfig.base_price_info.filter(price => price.car_type === item.car_type);
      const service_type_1 = base_price.filter(price => price.service_type === 1);
      const service_type_2 = base_price.filter(price => price.service_type === 2);
      if (base_price && base_price.length > 0) {
        if (service_type_1) {
          item.original_fee = item.base_num * service_type_1[0].original_unit_fee;
        }
        if (service_type_2) {
          item.original_fee += item.base_wax_num * service_type_2[0].original_unit_fee;
        }
      }
      if (isNaN(item.original_fee)) {
        item.original_fee = null;
      }
    });
  }

  // 切换服务tab
  public onTabChange(event: any): void {
    this.searchParams = new SearchParams();
    this.selectedCarTypeTabIndex = 1;
    this.noResultText = '数据加载中...';
    if (event === 1) {
      this.searchText$.next();
    } else {
      this.searchWashCarText$.next();
    }
  }
  // 切换洗车服务-车辆类型tab
  public onChangeWashTabClick(tab: TabItem): void {
    this.noResultText = '暂无数据';
    this.selectedCarTypeTabIndex = tab.key;
    this.specificationList = this.washServiceConfig.specification_info.filter(specification => specification.car_type === tab.key);
  }
  // 规格开关
  public onChangeSpecificationStatus(wash_car_specification_id: string, event: any): void {
    const status = event ? 1 : 2;
    let sucessMsg = '开启成功!';
    let errMsg = '开启失败,请重试!';
    if (!event) {
      sucessMsg = '关闭成功';
      errMsg = '关闭失败，请重试!';
    }
    this.washCarService.requestChangeStatus(wash_car_specification_id, status).subscribe(() => {
      this.globalService.promptBox.open(sucessMsg);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        this.searchText$.next();
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.resource === 'time' && content.code === 'already_expired') {
              this.globalService.promptBox.open('当前时间超过有效期，无法开启!', null, 2000, null, false);
            } else {
              this.globalService.promptBox.open(errMsg, null, 2000, null, false);
            }
          }
        } else if (err.status === 404) {
          this.globalService.promptBox.open('规格信息不存在!', null, 2000, null, false);
        }
      }
    });
  }
}
