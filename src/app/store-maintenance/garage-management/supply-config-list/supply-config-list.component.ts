import { Component, OnInit, ViewChild } from '@angular/core';
import { BrokerageEntity, InsuranceService } from '../../../operational-system/insurance/insurance.service';
import { SearchUpkeepProductParams } from '../../../operational-system/maintenance/business-management/business-management.service';
import { FileImportViewModel } from '../../../../utils/file-import.model';
import { ProgressModalComponent } from '../../../share/components/progress-modal/progress-modal.component';
import { Subject, Subscription, timer } from 'rxjs';
import { BrokerageCompanyEditComponent } from '../../../operational-system/insurance/brokerage-company-management/brokerage-company-edit/brokerage-company-edit.component';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-supply-config-list',
  templateUrl: './supply-config-list.component.html',
  styleUrls: ['./supply-config-list.component.css']
})
export class SupplyConfigListComponent implements OnInit {

  public brokerageList: Array<BrokerageEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public searchParams = new SearchUpkeepProductParams();
  public vehicleBrandList = [];
  public vehicleFirmList = [];
  public vehicleSeriesList = [];
  public importViewModel: FileImportViewModel = new FileImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private importSpotSubscription: Subscription;

  @ViewChild(BrokerageCompanyEditComponent, {static: true}) public brokerageEditComponent: BrokerageCompanyEditComponent;

  private get pageCount(): number {
    if (this.brokerageList.length % PageSize === 0) {
      return this.brokerageList.length / PageSize;
    }
    return this.brokerageList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private insuranceService: InsuranceService) {
  }

  ngOnInit() {
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.insuranceService.requestBrokerageList())
    ).subscribe(res => {
      this.brokerageList = res.results;
      this.brokerageList.forEach(value => {
        const ic_company_name = [];
        value.ic_company.forEach(value1 => {
          ic_company_name.push(value1.ic_name);
        });
        value.ic_company_name = ic_company_name.join(',');
      });
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 显示添加编辑项目modal
  // 显示添加编辑项目modal
  public onShowModal() {
    // if (this.appList.length > 7) {
    //   this.globalService.promptBox.open('最多可添加8个应用！', null, 2000, '/assets/images/warning.png');
    //   return;
    // }
    // this.appComponent.open(() => {
    //   this.appComponent.clear();
    //   this.pageIndex = 1;
    //   timer(0).subscribe(() => {
    //     this.searchText$.next();
    //   });
    // }, '保存', () => {
    //   this.appComponent.clear();
    // });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.insuranceService.continueBrokerageList(this.linkUrl).subscribe(res => {
        this.brokerageList = this.brokerageList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 开启、关闭经济公司
  public onSwitchChange(broker_company_id, event) {
    const swith = event ? false : true;
    const params = { discontinue_use: swith };
    this.insuranceService.requestOpenBrokerCompany(broker_company_id, params).subscribe(res => {
      if (event) {
        this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
      } else {
        this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
      }
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            this.globalService.promptBox.open('参数错误或无效！', null, 2000, '/assets/images/warning.png');
          }
        }
      }
      this.searchText$.next();
    });
  }

  // 查询
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 变更品牌
  public onChangeBrand(event: any) {
    this.vehicleFirmList = [];
    this.searchParams.vehicle_series_id = '';
    this.searchParams.vehicle_firm_id = '';
    this.vehicleSeriesList = [];
    if (event.target.value) {
      // this.requestFirmListByBrand(event.target.value);
    }
  }

  // 变更厂商
  public onChangeFirm(event: any) {
    this.vehicleSeriesList = [];
    this.searchParams.vehicle_series_id = '';
    if (event.target.value ) {
      // this.requestSeriesList(event.target.value);
    }
  }

  // 解订阅
  public onCloseUnsubscribe() {
    this.importSpotSubscription && this.importSpotSubscription.unsubscribe();
  }

  public onCancelData() {
    this.onCloseUnsubscribe();
    this.importViewModel.initImportData();
    $('#importBerthPromptDiv').modal('hide');
    $('#importParamPromptDiv').modal('hide');
  }
}
