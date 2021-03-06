import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { ProgressModalComponent } from '../../../../share/components/progress-modal/progress-modal.component';
import { FileImportViewModel } from '../../../../../utils/file-import.model';
import {
  VehicleBrandEntity,
  VehicleFirmEntity,
  VehicleSeriesEntity, VehicleTypeEntity,
  VehicleTypeManagementService
} from '../vehicle-type-management.service';
import { VehicleTypeDataService } from '../vehicle-type-data.service';
import { HttpErrorEntity } from '../../../../core/http.service';

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
  public isLoading = true;
  public importViewModel: FileImportViewModel = new FileImportViewModel();

  private importSpotSubscription: Subscription;
  private nzEnevt: any;

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  constructor(private globalService: GlobalService,
              private vehicleTypeManagementService: VehicleTypeManagementService,
              private vehicleDataService: VehicleTypeDataService) {
  }

  ngOnInit() {
    // 获取车辆品牌列表
    if (!this.vehicleDataService.requestVehicleBrandList()) {
      this.isLoading = false;
      this.vehicleBrandList = this.vehicleDataService.vehicleBrandList;
      if (this.vehicleBrandList.length > 0) {
        this.vehicle_brand_id = this.vehicleBrandList[0].vehicle_brand_id;
        this.requestVehicleFirmsList(this.vehicleBrandList[0].vehicle_brand_id);
      }
    } else {
      this.vehicleDataService.requestVehicleBrandList().subscribe(() => {
        this.isLoading = false;
        this.vehicleBrandList = this.vehicleDataService.vehicleBrandList;
        if (this.vehicleBrandList.length > 0) {
          this.vehicle_brand_id = this.vehicleBrandList[0].vehicle_brand_id;
          this.requestVehicleFirmsList(this.vehicleBrandList[0].vehicle_brand_id);
        }
      });
    }
  }

  // 获取厂商列表
  private requestVehicleFirmsList(vehicle_brand_id: string) {
    if (!this.vehicleDataService.requestVehicleFirmsList(vehicle_brand_id)) {
      this.vehicleFirmList = this.vehicleDataService.vehicleFirmList;
      console.log('1', this.vehicleFirmList);

    } else {
      this.vehicleDataService.requestVehicleFirmsList(vehicle_brand_id).subscribe(() => {
        this.vehicleFirmList = this.vehicleDataService.vehicleFirmList;
        console.log('1', this.vehicleFirmList);
      });
    }
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
          this.nzEnevt = event;
          // 根据车系获取汽车车型
          this.vehicleTypeManagementService.requestVehicleTypeList(node.origin.vehicle_series_id).subscribe(res => {
            this.vehicleTypeList = res;
            let temp = [];
            temp = res;
            temp.forEach(value => {
              value.isLeaf = true;
              value.status = value.status === 1 ? true : false;
            });
            node.addChildren(res);
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
        }
      }
    }
  }

  // 导入车型信息
  public onImportClick() {
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
        this.globalService.promptBox.open('文件格式错误！');
        return;
      }
    }
    if (this.importViewModel.checkFormDataValid()) {
      this.progressModalComponent.openOrClose(true);
      this.importSpotSubscription = this.vehicleTypeManagementService.requestImportVehicle(
        this.importViewModel.type, this.importViewModel.file).subscribe(res => {
          this.progressModalComponent.openOrClose(false);
          $('#dataImportModal').modal('hide');
          const date = JSON.parse(res.response);
          this.globalService.promptBox.open(`成功导入${date.success}条，失败${date.failed}条！`, () => {
            this.vehicleDataService.clear();
            this.importViewModel.initImportData();
            $('#importBerthPromptDiv').modal('hide');
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
                  this.globalService.promptBox.open('单次最大可导入200条，请重新上传！');
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

  // 删除车型
  public onDeleteVehicleClick() {
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
    this.requestVehicleFirmsList(this.vehicle_brand_id);
  }

  // 上架、下架车辆
  public onSwitchChange(vehicle_type_id: string, event: any, node: VehicleTypeEntity) {
    const swicth = event ? 1 : 2;
    const params = { status: swicth };
    this.vehicleTypeManagementService.requestVehicleTypeStatus(vehicle_type_id, params).subscribe(res => {
      if (event) {
        this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
      } else {
        this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
      }
      timer(500).subscribe(() => {
        node.status = event;
      });
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'exists' && content.resource === 'product') {
              this.globalService.promptBox.open('此车型未上架产品，无法开启！', null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('参数错误或无效！', null, 2000, '/assets/images/warning.png');
            }
          }
        }
      }
      timer(500).subscribe(() => {
        node.status = event ? false : true;
      });
    });
  }
}
