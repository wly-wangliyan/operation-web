import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import {
  CarBrandEntity,
  CarFactoryEntity,
  CarSeriesEntity,
  CarParamEntity,
  SearchParams,
  VehicleManagementHttpService
} from '../vehicle-management-http.service';
import { FileImportViewModel } from '../../../../utils/file-import.model';
import { ProgressModalComponent } from '../../../share/components/progress-modal/progress-modal.component';

const PageSize = 15;

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  public carTypeList: Array<CarParamEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public searchParams = new SearchParams();
  public carBrandList: Array<CarBrandEntity> = [];
  public carFactoryList: Array<CarFactoryEntity> = [];
  public carSeriesList: Array<CarSeriesEntity> = [];
  public carParamList: Array<CarParamEntity> = [];
  public importViewModel: FileImportViewModel = new FileImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  private searchText$ = new Subject<any>();
  private searchBrandText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private importSpotSubscription: Subscription;

  private get pageCount(): number {
    if (this.carTypeList.length % PageSize === 0) {
      return this.carTypeList.length / PageSize;
    }
    return this.carTypeList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private vehicleManagementService: VehicleManagementHttpService,
  ) {
  }

  ngOnInit() {
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.vehicleManagementService.requestCarTypeListData(this.searchParams))
    ).subscribe(res => {
      this.carTypeList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();

    // 品牌列表
    this.searchBrandText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.vehicleManagementService.requestCarBrandsListData())
    ).subscribe(res => {
      this.carBrandList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    // this.searchBrandText$.next();
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.vehicleManagementService.continueCarTypeListData(this.linkUrl).subscribe(res => {
        this.carTypeList = this.carTypeList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 开关状态改变
  public onSwitchChange(status: boolean, event: boolean) {
    timer(2000).subscribe(() => {
      return status = event;
    });
  }

  // 开关点击调用接口
  public onSwitchClick(data: CarParamEntity, status: boolean) {
    const text = status ? '开启' : '关闭';
    const car_status = status ? 1 : 2;
    this.globalService.confirmationBox.open('提示', '下架后，将不支持在线购买', () => {
      this.vehicleManagementService.requestUpdateStatusData(data.car_series && data.car_series.car_series_id,
        data.car_param_id, car_status).subscribe(res => {
          this.globalService.promptBox.open(`${text}成功`);
          this.searchText$.next();
        }, err => {
          this.globalService.promptBox.open(`${text}失败，请重试！`, null, 2000, '/assets/images/warning.png');
          this.searchText$.next();
        });

    });
  }

  // 查询
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 变更品牌
  public onChangeBrand(event: any) {
    this.searchParams.car_factory_id = '';
    this.searchParams.car_series_id = '';
    this.searchParams.car_displacement = '';
    this.carFactoryList = [];
    this.carSeriesList = [];
    this.carParamList = [];
    if (event.target.value) {
      this.requestFactoryListByBrand(event.target.value);
    }
  }

  // 变更厂商
  public onChangeFactory(event: any) {
    this.searchParams.car_series_id = '';
    this.searchParams.car_displacement = '';
    this.carSeriesList = [];
    this.carParamList = [];
    if (event.target.value) {
      this.requestSeriesListByFactory(this.searchParams.car_brand_id, event.target.value);
    }
  }

  // 变更车系
  public onChangeSeries(event: any) {
    this.searchParams.car_displacement = '';
    this.carParamList = [];
    if (event.target.value) {
      this.requestDisplacementListBySeries(event.target.value);
    }
  }

  // 通过品牌请求厂商下拉列表
  private requestFactoryListByBrand(car_brand_id: string) {
    this.vehicleManagementService.requestCarFactoryListData(car_brand_id)
      .subscribe(res => {
        this.carFactoryList = res.results;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 通过厂商请求车系下拉列表
  private requestSeriesListByFactory(car_brand_id: string, car_factory_id: string) {
    this.vehicleManagementService.requestCarSeriesListData(car_brand_id, car_factory_id)
      .subscribe(res => {
        this.carFactoryList = res.results;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 通过车系请求排量下拉列表
  private requestDisplacementListBySeries(car_series_id: string) {
    this.vehicleManagementService.requestCarParamListData(car_series_id)
      .subscribe(res => {
        this.carParamList = res.results;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 导入车型信息
  public onImportClick(data: string) {
    $('#importBerthPromptDiv').modal('show');
    this.importViewModel.initImportData();
  }

  /* 导入数据 */
  public onSubmitImportBerth() {
    if (this.importViewModel.address) {
      const length = this.importViewModel.address.length;
      const index = this.importViewModel.address.lastIndexOf('.');
      const type = this.importViewModel.address.substring(index, length);
      if (type !== '.xlsx' && type !== '.csv') {
        this.globalService.promptBox.open('文件格式错误！', null, 2000, '/assets/images/warning.png');
        return;
      }
    }
    if (this.importViewModel.checkFormDataValid()) {
      this.progressModalComponent.openOrClose(true);
      this.importSpotSubscription = this.vehicleManagementService.requestImportCarTypesData(
        this.importViewModel.type, this.importViewModel.file).subscribe(res => {
          this.progressModalComponent.openOrClose(false);
          $('#dataImportModal').modal('hide');
          const date = JSON.parse(res.response);
          this.globalService.promptBox.open(`成功导入${date.success}条，失败${date.failed}条！`, () => {
            this.importViewModel.initImportData();
            $('#importBerthPromptDiv').modal('hide');
            this.searchText$.next();
          }, -1);
        }, err => {
          this.progressModalComponent.openOrClose(false);
          timer(300).subscribe(() => {
            if (!this.globalService.httpErrorProcess(err)) {
              if (err.status === 422) {
                const tempErr = JSON.parse(err.responseText);
                const error = tempErr.length > 0 ? tempErr[0].errors[0] : tempErr.errors[0];
                if (error.field === 'FILE' && error.code === 'invalid') {
                  this.globalService.promptBox.open('导入文件错误或无效！');
                } else if (error.resource === 'FILE' && error.code === 'incorrect_format') {
                  this.globalService.promptBox.open('文件格式错误！');
                } else if (error.resource === 'FILE' && error.code === 'scale_out') {
                  this.globalService.promptBox.open('单次最大可导入1000条，请重新上传！');
                } else {
                  this.globalService.promptBox.open('导入文件错误或无效！');
                }
              }
            }
          });
        });
    } else {
      this.globalService.promptBox.open('文件地址不能为空，请选择！', null, 2000, null, false);
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
  }
}
