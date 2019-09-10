import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { ProgressModalComponent } from '../../../../share/components/progress-modal/progress-modal.component';
import { LocalStorageProvider } from '../../../../share/localstorage-provider';
import { FileImportViewModel } from '../../../../../utils/file-import.model';
import { debounceTime, switchMap } from 'rxjs/operators';
import {
  VehicleBrandEntity,
  VehicleFirmEntity,
  VehicleSeriesEntity, VehicleTypeEntity,
  VehicleTypeManagementService
} from '../vehicle-type-management.service';

@Component({
  selector: 'app-vehicle-type-list',
  templateUrl: './vehicle-type-list.component.html',
  styleUrls: ['./vehicle-type-list.component.css']
})
export class VehicleTypeListComponent implements OnInit {

  public vehicleBrandList: Array<VehicleBrandEntity> = [];
  public vehicleFirmList: Array<VehicleFirmEntity> = [];
  public vehicleSeriesList: Array<VehicleSeriesEntity> = [];
  public vehicleTypeList: Array<VehicleTypeEntity> = [];
  public vehicle_brand_id: string;
  public index = 0;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private importSpotSubscription: Subscription;
  public importViewModel: FileImportViewModel = new FileImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  constructor(private globalService: GlobalService,
              private vehicleTypeManagementService: VehicleTypeManagementService) {
  }

  ngOnInit() {
    // 获取车辆品牌列表
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.vehicleTypeManagementService.requestVehicleBrandList())
    ).subscribe(res => {
      this.vehicleBrandList = res.results;
      this.vehicle_brand_id = this.vehicleBrandList[0].vehicle_brand_id;
      if (this.vehicleBrandList.length > 0) {
        this.requestVehicleFirmsList(this.vehicleBrandList[0].vehicle_brand_id);
      }
      LocalStorageProvider.Instance.setObject(LocalStorageProvider.VehicleList, this.vehicleBrandList);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 获取厂商列表
  private requestVehicleFirmsList(vehicle_brand_id: string) {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription =
        this.vehicleTypeManagementService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
          this.vehicleFirmList = res;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  nzEvent(event: Required<NzFormatEmitEvent>): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        if (node.level === 0) {
          // 根据厂商获取汽车车系
          this.vehicleTypeManagementService.requestVehicleSeriesList(node.origin.vehicle_firm_id).subscribe(res => {
            this.vehicleSeriesList = res;
            node.addChildren(res);
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
        } else if (node.level === 1) {
          // 根据车系获取汽车车型
          this.vehicleTypeManagementService.requestVehicleTypeList(node.origin.vehicle_series_id).subscribe(res => {
            this.vehicleTypeList = res;
            let temp = [];
            temp = res;
            temp.forEach(value => {
              value.isLeaf = true;
            });
            node.addChildren(res);
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
        }
      }
    }
  }

  public onImportClick() {
    console.log(LocalStorageProvider.Instance.getObject(LocalStorageProvider.VehicleList));
    $('#importBerthPromptDiv').modal('show');
    this.importViewModel.initImportData();
  }

  /* 导入数据 */
  public onSubmitImportBerth() {
    LocalStorageProvider.Instance.setObject(LocalStorageProvider.VehicleList, []);
    if (this.importViewModel.address) {
      const length = this.importViewModel.address.length;
      const index = this.importViewModel.address.lastIndexOf('.');
      const type = this.importViewModel.address.substring(index, length);
      if (type !== '.xlsx' && type !== '.xls' && type !== '.csv') {
        this.globalService.promptBox.open('文件格式错误！');
        return;
      }
    }
    if (this.importViewModel.checkFormDataValid()) {
     /* this.progressModalComponent.openOrClose(true);
      this.importSpotSubscription = this.setBerthService.requestImportSpot(
          this.importViewModel.type, this.importViewModel.file, this.projectId).subscribe(() => {
        $('#dataImportModal').modal('hide');
        this.globalService.promptBox.open('名单导入成功！', () => {
          this.importViewModel.initImportData();
          $('#importBerthPromptDiv').modal('hide');
          this.progressModalComponent.openOrClose(false);
        }, -1);
      }, err => {
        this.progressModalComponent.openOrClose(false);
        timer(300).subscribe(() => {
          if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
              const tempErr = JSON.parse(err.responseText);
              const error = tempErr.length > 0 ? tempErr[0].errors[0] : tempErr.errors[0];
              if (error.resource === 'file' && error.code === 'missing') {
                this.globalService.promptBox.open('泊位文件不能为空！');
              } else {
                this.globalService.promptBox.open('泊位文件错误');
              }
            }
          }
        });
      });*/
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

  // 删除车型
  public onDeleteVehicleClick() {
    let sizeStore = 0;
    if (window.localStorage) {
      // 遍历所有存储
      for (const item in window.localStorage) {
        if (window.localStorage.hasOwnProperty(item)) {
          sizeStore += window.localStorage.getItem(item).length;
        }
      }
    }
    console.log((sizeStore / 1024 / 1024).toFixed(2) + 'M');
    this.globalService.confirmationBox.open('警告', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      /*this.versionManagementService.requestDeleteVersion(data.version_id).subscribe((e) => {
        this.versionList = this.versionList.filter(version => version.version_id !== data.version_id);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });*/
    });
  }

  public onBrandClick(data: VehicleBrandEntity) {
    this.vehicle_brand_id = data.vehicle_brand_id;
  }
}
