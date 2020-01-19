import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import {
  CarBrandEntity,
  CarFactoryEntity,
  CarSeriesEntity,
  VehicleManagementHttpService
} from '../../../vehicle-management/vehicle-management-http.service';
import {
  AccessoryLibraryService,
  SpecificationEntity,
  AccessoryEntity,
  SearchAccessoryParams,
  ProjectEntity,
} from '../../accessory-library.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core';
import { HttpErrorEntity } from '../../../../core/http.service';

@Component({
  selector: 'app-select-multi-brand-firm',
  templateUrl: './select-multi-brand-firm.component.html',
  styleUrls: ['./select-multi-brand-firm.component.css']
})
export class SelectMultiBrandFirmComponent implements OnInit {

  constructor(
    private globalService: GlobalService,
    private vehicleService: VehicleManagementHttpService,
    private accessoryLibraryService: AccessoryLibraryService,
  ) { }

  @Input() public accessory_id: string;

  public letter_list = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  public carBrandList: Array<CarBrandEntity> = []; // 车辆品牌列表

  public vehicleBrandTreeList: Array<any> = []; // 树结构展示的车辆品牌列表

  public carFactoryList: Array<CarFactoryEntity> = []; // 厂商列表

  public carSeriesList: Array<CarSeriesEntity> = []; // 车系列表

  public mapOfBrand: { [key: string]: Array<any> } = {}; // 字母对应品牌

  public defaultSelectedKeys = ['05720b6c27fd11eaaca60242ac150006', '05992a7627fd11eaaca60242ac150006', '0341427227fd11eaaca60242ac150006', '0214982227fd11eaaca60242ac150006', '0244b5b627fd11eaaca60242ac150006', '07372f0e27fd11eaaca60242ac150006', '06d3327427fd11eaaca60242ac150006', '0360b76027fd11eaaca60242ac150006', '05b5e40427fd11eaaca60242ac150006', '03a319fc27fd11eaaca60242ac150006', '05b35d6027fd11eaaca60242ac150006', '06f09cec27fd11eaaca60242ac150006', '05caad4427fd11eaaca60242ac150006', '076e60b427fd11eaaca60242ac150006', '0403e03427fd11eaaca60242ac150006', '065278a027fd11eaaca60242ac150006', '0783cecc27fd11eaaca60242ac150006', '07f6132e27fd11eaaca60242ac150006', '042dfedc27fd11eaaca60242ac150006', '07fdb6d827fd11eaaca60242ac150006', '07c85d9e27fd11eaaca60242ac150006', '080ab1da27fd11eaaca60242ac150006', '023d17fc27fd11eaaca60242ac150006', '043f364827fd11eaaca60242ac150006', '07b23dac27fd11eaaca60242ac150006', '045f6daa27fd11eaaca60242ac150006', '0819335427fd11eaaca60242ac150006', '06a11b7227fd11eaaca60242ac150006', '07d7964227fd11eaaca60242ac150006', 'd234fbe6280211eaa6b00242ac150006', '0e7bcf8627fd11eaaca60242ac150006', '0e98c23a27fd11eaaca60242ac150006', '160c415427fd11eaaca60242ac150006', '0ea0914a27fd11eaaca60242ac150006', '0ef3888c27fd11eaaca60242ac150006', '0efe201227fd11eaaca60242ac150006', '0f0e694027fd11eaaca60242ac150006', '0f1c85de27fd11eaaca60242ac150006', '0f3c404a27fd11eaaca60242ac150006', '0f48edae27fd11eaaca60242ac150006', '0f66450227fd11eaaca60242ac150006', '0910a6d427fd11eaaca60242ac150006', '161d547627fd11eaaca60242ac150006', '091d8cfa27fd11eaaca60242ac150006', '10b6b02c27fd11eaaca60242ac150006', '10cdbf5627fd11eaaca60242ac150006', '1102cb1027fd11eaaca60242ac150006', '111a633827fd11eaaca60242ac150006', '11367ece27fd11eaaca60242ac150006', '115fe73227fd11eaaca60242ac150006', '0926ba2827fd11eaaca60242ac150006', '0930f1a027fd11eaaca60242ac150006', '11998eb027fd11eaaca60242ac150006', '1624d8b827fd11eaaca60242ac150006', '163311c627fd11eaaca60242ac150006', '1640e72e27fd11eaaca60242ac150006', '164d087427fd11eaaca60242ac150006', '1658870827fd11eaaca60242ac150006', '16611bd427fd11eaaca60242ac150006', '166aaa0a27fd11eaaca60242ac150006', '1672ddd827fd11eaaca60242ac150006', '12654fc827fd11eaaca60242ac150006', '0933f40e27fd11eaaca60242ac150006', '1296f9b027fd11eaaca60242ac150006', '129eb31c27fd11eaaca60242ac150006', '0de9949027fd11eaaca60242ac150006', '0df36c3627fd11eaaca60242ac150006', '0e0f329027fd11eaaca60242ac150006'];

  private requestBrandSubscription: Subscription; // 获取品牌数据

  private requestFirmSubscription: Subscription; // 获取厂商数据

  public ngOnInit() {
  }

  /**
   * 打开
   */
  public open(accessory_id) {
    this.accessory_id = accessory_id;
    this.initModal();
    setTimeout(() => {
      $('#selectMultiBrandFirmModal').modal();
      this.requestBrandList();
    }, 0);
  }

  /**
   * 关闭
   */
  public close() {
    this.requestBrandSubscription && this.requestBrandSubscription.unsubscribe();
    this.requestFirmSubscription && this.requestFirmSubscription.unsubscribe();
    $('#selectMultiBrandFirmModal').modal('hide');
  }

  // 初始化
  private initModal() {
    this.carBrandList = [];
    this.vehicleBrandTreeList = [];
    this.carFactoryList = [];
    this.carSeriesList = [];
  }

  // 获取品牌列表
  private requestBrandList() {
    this.requestBrandSubscription = this.vehicleService.requestCarBrandsListData().subscribe(res => {
      this.carBrandList = res.results;
      this.vehicleBrandTreeList = res.results.map(i => ({ ...i, key: i.car_brand_id, title: i.car_brand_name }));
      this.letter_list.forEach(leter => {
        this.mapOfBrand[leter] = this.vehicleBrandTreeList.filter(brand => brand.car_brand_initial === leter);
      });
    }, err => {
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 加载下级菜单
  nzEvent(event: Required<NzFormatEmitEvent>): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        if (node.level === 0) {
          // 根据品牌获取厂商
          this.requestFirmListByBrand(node);
        } else if (node.level === 1) {
          // 根据厂商获取汽车车系
          this.requestSeriesListByFirm(node);
        }
      }
    }
  }

  // 复选>选中父级默认勾选子级
  nzCheck(event: Required<NzFormatEmitEvent>): void {
    if (event.eventName === 'check') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && !node.isExpanded) {
        if (node.level === 0) {
          // 根据品牌获取厂商和车系
          this.requestFirmAndSeriesList(node);
        } else if (node.level === 1) {
          // 根据厂商获取汽车车系
          this.requestSeriesListByFirm(node);
        }
      }
    }
  }

  // 获取对应厂商列表
  private requestFirmListByBrand(node) {
    const car_brand_id = node.origin.car_brand_id;
    this.vehicleService.requestCarFactoryListData(car_brand_id).subscribe(res => {
      this.carFactoryList = res.results;
      const newVehicleFirmList = this.carFactoryList.map(i => ({ ...i, key: i.car_factory_id, title: i.car_factory_name }));
      node.addChildren(newVehicleFirmList);
    }, err => {
      this.carFactoryList = [];
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取对应车系列表
  private requestSeriesListByFirm(node) {
    const car_brand_id = node.parentNode.origin.car_brand_id;
    const car_factory_id = node.origin.car_factory_id;
    this.vehicleService.requestCarSeriesListData(car_brand_id, car_factory_id).subscribe(res => {
      this.carSeriesList = res.results;
      const newVehicleSeriesList = this.carSeriesList.map(i => ({
        ...i, isLeaf: true,
        key: i.car_series_id, title: i.car_series_name
      }));
      node.addChildren(newVehicleSeriesList);
      if (node.isChecked && node.children.length !== 0) {
        node.children.forEach(i => {
          i.isChecked = true;
        });
      }
    }, err => {
      this.carSeriesList = [];
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取对应厂商以及车系列表
  private requestFirmAndSeriesList(node) {
    const car_brand_id = node.origin.car_brand_id;
    this.vehicleService.requestCarFactoryListData(car_brand_id).subscribe(res => {
      this.carFactoryList = res.results;
      const newVehicleFirmList = this.carFactoryList.map(i => ({ ...i, key: i.car_factory_id, title: i.car_factory_name }));
      node.addChildren(newVehicleFirmList);
      if (node.children.length !== 0) {
        node.children.forEach(i => {
          i.isChecked = true;
          this.requestSeriesListByFirm(i);
        });
      }
    }, err => {
      this.carFactoryList = [];
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 回传选中事件
  public onSelectCarSeries() {
    const seriesList = [];
    for (const item of Object.keys(this.mapOfBrand)) {
      this.mapOfBrand[item].forEach(i => {
        if (i.checked) {// 第一级勾选
          if (i.children) {// 由于第二级全部勾选导致第一级勾选
            this.getThirdChecked(i, seriesList);
          } else { // 第一级全部勾选上
            seriesList.push(i);
          }
        } else {// 第一级未勾选
          this.getThirdChecked(i, seriesList);
        }
      });
    }
    if (seriesList.length === 0) {
      this.globalService.promptBox.open(`请勾选车系后再保存!`, null, 2000, '/assets/images/warning.png');
    } else {
      const newList = seriesList.flat();
      const seriesIds = newList.map(item => item.car_series_id).join(',');
      this.setRecommendData(seriesIds);
    }
  }

  // 获取第三级勾选数据
  private getThirdChecked(firstLevel, seriesList) {
    if (firstLevel.children) {// 第二级有部分勾选
      firstLevel.children.forEach(secondLevel => {
        if (secondLevel.checked) {
          if (secondLevel.children) {// 第三级全部勾选导致第二级被勾选
            seriesList.push(secondLevel.children);
          } else {// 第二级全部勾选
            seriesList.push(secondLevel);
          }
        } else if (!secondLevel.checked) {// 第二级未勾选
          if (secondLevel.children) {// 第三级有部分勾选
            secondLevel.children.forEach(c => {
              if (c.checked) {
                seriesList.push(c);
              }
            });
          }
        }
      });
    } else {// 均未勾选
      seriesList = [];
    }
  }

  // 推荐设置接口
  private setRecommendData(seriesIds: string) {
    this.accessoryLibraryService.requestUpdateRecommendData(seriesIds, this.accessory_id).subscribe(() => {
      this.globalService.promptBox.open('推荐设置成功！');
      this.close();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) { } {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            const field = content.field === 'car_series_ids' ? '车系' : '';
            if (content.code === 'missing_field') {
              this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
              return;
            } else if (content.code === 'invalid') {
              this.globalService.promptBox.open(`${field}字段输入错误!`, null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open(`推荐设置失败,请重试!`, null, 2000, '/assets/images/warning.png');
            }
          }
        }
      }
    });
  }

}

