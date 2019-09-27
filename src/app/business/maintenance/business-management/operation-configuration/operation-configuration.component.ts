import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BusinessEditComponent } from '../business-edit/business-edit.component';
import { GlobalService } from '../../../../core/global.service';
import { BrokerageEntity, InsuranceService } from '../../../insurance/insurance.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import {
  BusinessManagementService,
  SearchUpkeepProductParams,
  UpkeepMerchantProductEntity
} from '../business-management.service';
import { SelectBrandFirmTypeComponent } from '../../../../share/components/select-brand-firm-type/select-brand-firm-type.component';
import { HttpErrorEntity } from '../../../../core/http.service';
import { SearchVehicleTypeGroupComponent } from '../../../../share/components/search-vehicle-type-group/search-vehicle-type-group.component';
import { RegionEntity } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';

const PageSize = 15;

@Component({
  selector: 'app-operation-configuration',
  templateUrl: './operation-configuration.component.html',
  styleUrls: ['./operation-configuration.component.css']
})
export class OperationConfigurationComponent implements OnInit, OnDestroy {

  public searchParams = new SearchUpkeepProductParams();
  public productList: Array<UpkeepMerchantProductEntity>;
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public tabIndex = 1;
  public bookingTimes = [];
  public disableVehicleType = [];
  public brand_ids = [];
  public firm_ids = [];
  private requestProductSubscription: Subscription;
  private requestDetailSubscription: Subscription;
  private requestMerchantSubscription: Subscription;
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private upkeep_merchant_id: string;

  @ViewChild(BusinessEditComponent, { static: true }) public businessEditComponent: BusinessEditComponent;
  @ViewChild(SelectBrandFirmTypeComponent, { static: true }) public selectBrandFirmTypeComponent: SelectBrandFirmTypeComponent;
  @ViewChild(SearchVehicleTypeGroupComponent, { static: true }) public searchVehicleTypeGroupComponent: SearchVehicleTypeGroupComponent;

  private get pageCount(): number {
    if (this.productList.length % PageSize === 0) {
      return this.productList.length / PageSize;
    }
    return this.productList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private insuranceService: InsuranceService,
    private businessManagementService: BusinessManagementService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((params: Params) => {
      this.upkeep_merchant_id = params.upkeep_merchant_id;
    });
  }

  ngOnInit() {
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.businessManagementService.requestUpkeepProductList(this.upkeep_merchant_id, this.searchParams))
    ).subscribe(res => {
      this.productList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
    this.requestUpkeepProductAll();
    this.requestUpkeepDetail();
  }

  public ngOnDestroy() {
    this.requestProductSubscription && this.requestProductSubscription.unsubscribe();
    this.requestDetailSubscription && this.requestDetailSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.requestMerchantSubscription && this.requestMerchantSubscription.unsubscribe();
  }

  // 获取商家详情，以方便过滤品牌、厂商
  private requestUpkeepDetail() {
    this.requestDetailSubscription = this.businessManagementService.requestUpkeepMerchantDetail(this.upkeep_merchant_id)
      .subscribe(res => {
        res.VehicleFirm.forEach(value => {
          this.brand_ids.push(value.vehicle_brand.vehicle_brand_id);
          this.firm_ids.push(value.vehicle_firm_id);
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 获取全部产品
  private requestUpkeepProductAll() {
    const params = new SearchUpkeepProductParams();
    params.page_size = 1000;
    this.requestProductSubscription =
      this.businessManagementService.requestUpkeepProductList(this.upkeep_merchant_id, params).subscribe(res => {
        res.results.forEach(value => {
          this.disableVehicleType.push(value.vehicle_type.vehicle_type_id);
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 显示添加编辑项目modal
  public onEditBtnClick(data, isEdit) {
    if (isEdit) {
      this.router.navigate([`/main/maintenance/business-management/operation-configuration/${this.upkeep_merchant_id}/edit`],
        { queryParams: { upkeep_merchant_id: this.upkeep_merchant_id, upkeep_merchant_product_id: data.upkeep_merchant_product_id } });
    } else {
      this.businessManagementService.requestAddUpkeepProduct(this.upkeep_merchant_id, data.vehicle_type.vehicle_type_id).subscribe(res => {
        this.globalService.promptBox.open('创建成功！', () => {
          this.router.navigate([`/main/maintenance/business-management/operation-configuration/${this.upkeep_merchant_id}/edit`],
            {
              queryParams: {
                upkeep_merchant_id: this.upkeep_merchant_id,
                upkeep_merchant_product_id: res.body.upkeep_merchant_product_id
              }
            });
        }, 2000, '/assets/images/success.png');
      }, err => {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'not found upkeep_handbook' && content.resource === 'vehicle_type') {
              this.globalService.promptBox.open('该车型没有关联保养手册，不能创建产品！', null, 2000, '/assets/images/warning.png');
            }
          }
        } else {
          this.globalService.httpErrorProcess(err);
        }
      });
    }
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.businessManagementService.continueUpkeepProductList(this.linkUrl).subscribe(res => {
        this.productList = this.productList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 切换Tab
  public onTabClicked(index) {
    this.tabIndex = index;
    if (index === 2) {
      this.requestUpkeepMerchantOperation();
    } else {
      this.pageIndex = 1;
    }
  }

  private requestUpkeepMerchantOperation() {
    this.bookingTimes = [];
    this.requestMerchantSubscription && this.requestMerchantSubscription.unsubscribe();
    this.requestMerchantSubscription =
      this.businessManagementService.requestUpkeepMerchantOperationList(this.upkeep_merchant_id).subscribe(res => {
        res.forEach(value => {
          const timeObj = {
            begin_time: DateFormatHelper.getMinuteOrTime(value.start_time),
            end_time: DateFormatHelper.getMinuteOrTime(value.end_time),
            upkeep_merchant_operation_id: value.upkeep_merchant_operation_id,
            operation_time_amount: value.operation_time_amount,
            isEdit: false
          };
          this.bookingTimes.push(timeObj);
        });
        if (res.length === 0) {
          const timeObj = {
            begin_time: DateFormatHelper.getMinuteOrTime(0),
            end_time: DateFormatHelper.getMinuteOrTime(0),
            isEdit: false
          };
          this.bookingTimes.push(timeObj);
        }
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 创建产品
  public onAddClick() {
    this.selectBrandFirmTypeComponent.open();
  }

  // 查看详情
  public onDetailBtnClick(data) {
    this.router.navigate([`/main/maintenance/business-management/operation-configuration/${this.upkeep_merchant_id}/detail`],
      { queryParams: { upkeep_merchant_id: this.upkeep_merchant_id, upkeep_merchant_product_id: data.upkeep_merchant_product_id } });
  }

  // 删除预定时间段
  public onTimeDelBtn(index) {
    this.globalService.confirmationBox.open('警告', '此操作不可逆，确认要删除吗？', () => {
      this.globalService.confirmationBox.close();
      if (!this.bookingTimes[index].upkeep_merchant_operation_id) {
        this.bookingTimes.splice(index, 1);
      } else {
        this.businessManagementService.requestDeleteUpkeepOperation(this.upkeep_merchant_id, this.bookingTimes[index].upkeep_merchant_operation_id)
          .subscribe((e) => {
            this.bookingTimes = this.bookingTimes.filter(version => version.upkeep_merchant_operation_id !== this.bookingTimes[index].upkeep_merchant_operation_id);
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
      }
    });
  }

  // 添加预定时间段
  public onTimeAddBtn() {
    const timeObj = {
      begin_time: DateFormatHelper.getMinuteOrTime(0),
      end_time: DateFormatHelper.getMinuteOrTime(0),
      isEdit: false,
    };
    this.bookingTimes.push(timeObj);
  }

  // 保存预定时间段
  public onTimeSaveBtn(data, index) {
    const params = {
      start_time: DateFormatHelper.getSecondTimeSum(data.begin_time),
      end_time: DateFormatHelper.getSecondTimeSum(data.end_time),
      operation_time_amount: Number(data.operation_time_amount).toFixed(2)
    };
    if (params.start_time >= params.end_time) {
      this.globalService.promptBox.open('预定时段开始时间需小于结束时间！', null, 2000, '/assets/images/warning.png');
      this.requestUpkeepMerchantOperation();
      return;
    }
    let is_pass = true;
    this.bookingTimes.forEach((value, i) => {
      if (!value.isEdit || value.upkeep_merchant_operation_id) {
        const start_time = DateFormatHelper.getSecondTimeSum(value.begin_time);
        const end_time = DateFormatHelper.getSecondTimeSum(value.end_time);
        if (index !== i &&
          ((params.start_time >= start_time && params.start_time < end_time)
            || (params.start_time <= start_time && params.end_time > start_time)
            || (params.end_time > start_time && params.end_time <= end_time))) {
          this.globalService.promptBox.open('预定时段时间不可重叠！', null, 2000, '/assets/images/warning.png');
          is_pass = false;
        }
      }
    });
    if (!is_pass) {
      this.requestUpkeepMerchantOperation();
      return;
    }
    if (data.upkeep_merchant_operation_id) {
      // 调用编辑接口
      this.businessManagementService.requestUpdateUpkeepOperation(this.upkeep_merchant_id, data.upkeep_merchant_operation_id, params)
        .subscribe((e) => {
          this.bookingTimes[index].operation_time_amount = Number(data.operation_time_amount).toFixed(2);
          this.requestUpkeepMerchantOperation();
          this.globalService.promptBox.open('保存成功！', null, 2000, '/assets/images/success.png');
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    } else {
      // 调用创建接口
      this.businessManagementService.requestAddUpkeepOperation(this.upkeep_merchant_id, params)
        .subscribe((e) => {
          this.bookingTimes[index].operation_time_amount = Number(data.operation_time_amount).toFixed(2);
          this.requestUpkeepMerchantOperation();
          this.globalService.promptBox.open('保存成功！', null, 2000, '/assets/images/success.png');
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 删除商家
  public onDelBtnClick(data: UpkeepMerchantProductEntity) {
    if (data.status === 1) {
      this.globalService.promptBox.open('该产品已上架，不能删除！', null, 2000, '/assets/images/warning.png');
      return;
    }
    this.globalService.confirmationBox.open('警告', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.businessManagementService.requestDeleteUpkeepProduct(this.upkeep_merchant_id, data.upkeep_merchant_product_id).subscribe((e) => {
        this.productList = this.productList.filter(v => v.upkeep_merchant_product_id !== data.upkeep_merchant_product_id);
        this.disableVehicleType = this.disableVehicleType.filter(v => v !== data.vehicle_type.vehicle_type_id);
        this.pageIndex = 1;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  // 产品上架、下架状态
  public onSwitchChange(upkeep_merchant_product_id, event) {
    const swith = event ? 1 : 2;
    const params = { status: swith };
    this.businessManagementService.requestProductStatus(this.upkeep_merchant_id, upkeep_merchant_product_id, params).subscribe(res => {
      if (event) {
        this.globalService.promptBox.open('上架成功', () => {
        }, 2000, '/assets/images/success.png');
      } else {
        this.globalService.promptBox.open('下架成功', () => {
        }, 2000, '/assets/images/success.png');
      }
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'data_scarcity' && content.resource === 'data') {
              this.globalService.promptBox.open('产品数据不完整！', () => {
              }, 2000, '/assets/images/warning.png');
            } else if (event) {
              this.globalService.promptBox.open('上架失败，请重试！', () => {
              }, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('下架失败，请重试！', () => {
              }, 2000, '/assets/images/warning.png');
            }
          }
        }
      }
      this.searchText$.next();
    });
  }

  public selectBrandFirmSeries(event) {
    this.searchParams.vehicle_brand_id = event.brand ? event.brand : '';
    this.searchParams.vehicle_firm_id = event.firm ? event.firm : '';
    this.searchParams.vehicle_series_id = event.series ? event.series : '';
  }
}
