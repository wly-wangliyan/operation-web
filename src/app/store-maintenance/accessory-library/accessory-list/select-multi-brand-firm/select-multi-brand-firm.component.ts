import { Component, OnInit, Input } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import {
  CarBrandEntity,
  CarFactoryEntity,
  CarSeriesEntity,
  VehicleManagementHttpService
} from '../../../vehicle-management/vehicle-management-http.service';
import { AccessoryLibraryService } from '../../accessory-library.service';
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
    private accessoryLibraryService: AccessoryLibraryService
  ) {}

  @Input() public accessory_id: string;

  public letter_list = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];

  public carBrandList: Array<CarBrandEntity> = []; // 车辆品牌列表
  public vehicleBrandTreeList: Array<any> = []; // 树结构展示的车辆品牌列表
  public newVehicleFirmList: Array<any> = []; // 树结构展示的车辆品牌列表
  public newVehicleSeriesList: Array<any> = []; // 树结构展示的车辆品牌列表
  public car_series_list: Array<any> = []; // 已勾选的数组
  public car_series_checked_list: Array<any> = []; // 已勾选的车系数组
  public car_factory_checked_list: Array<any> = []; // 已勾选的车型数组
  public car_brand_checked_list: Array<any> = []; // 已勾选的品牌数组
  public carFactoryList: Array<CarFactoryEntity> = []; // 厂商列表
  public carSeriesList: Array<CarSeriesEntity> = []; // 车系列表
  public mapOfBrand: { [key: string]: Array<any> } = {}; // 字母对应品牌
  public defaultExpandedKeys = [];
  public defaultCheckedKeys = [];
  public defaultSelectedKeys = [];

  private sureCallback: any;
  private closeCallback: any;
  private requestBrandSubscription: Subscription; // 获取品牌数据
  private requestFirmSubscription: Subscription; // 获取厂商数据

  public ngOnInit() {}

  /**
   * 打开
   */
  public open(data, sureFunc: any, closeFunc: any = null) {
    $('.tree_ul').scrollTop(0);
    this.initModal();
    this.accessory_id = data.accessory_id;
    this.car_series_list = data.car_series_list;
    if (this.car_series_list.length === 0) {
      this.requestBrandAllList();
    } else {
      this.getDefaultKeys();
      this.requestBrandList();
    }
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    setTimeout(() => {
      $('#selectMultiBrandFirmModal').modal();
    }, 0);
  }

  /**
   * 关闭
   */
  public close() {
    this.initModal();
    this.requestBrandSubscription &&
      this.requestBrandSubscription.unsubscribe();
    this.requestFirmSubscription && this.requestFirmSubscription.unsubscribe();
    $('#selectMultiBrandFirmModal').modal('hide');
  }

  // 初始化
  private initModal() {
    this.accessory_id = '';
    this.carBrandList = [];
    this.carFactoryList = [];
    this.carSeriesList = [];
    this.car_series_list = [];
    this.vehicleBrandTreeList = [];
    this.car_brand_checked_list = [];
    this.car_factory_checked_list = [];
    this.car_brand_checked_list = [];
    this.defaultCheckedKeys = [];
    this.defaultSelectedKeys = [];
    this.defaultExpandedKeys = [];
  }

  // 获取勾选项
  private getDefaultKeys() {
    const car_brand_checked_list = this.car_series_list.map(
      i => i.car_brand.car_brand_id
    );
    this.car_brand_checked_list = [...new Set(car_brand_checked_list)];
    this.car_factory_checked_list = this.car_series_list.map(
      i => i.car_factory.car_factory_id
    );
    this.car_series_checked_list = this.car_series_list.map(
      i => i.car_series_id
    );
    this.defaultCheckedKeys = this.car_series_checked_list;
    this.defaultSelectedKeys = this.car_series_checked_list;
    this.defaultExpandedKeys = this.car_brand_checked_list.concat(
      this.car_factory_checked_list
    );
    console.log('1', this.defaultCheckedKeys);
    console.log('2', this.defaultSelectedKeys);
    console.log('3', this.defaultExpandedKeys);
  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 获取品牌列表
  private requestBrandAllList() {
    this.requestBrandSubscription = this.vehicleService
      .requestCarBrandsListData()
      .subscribe(
        res => {
          this.carBrandList = res.results;
          this.vehicleBrandTreeList = this.carBrandList.map(i => ({
            ...i,
            key: i.car_brand_id,
            title: i.car_brand_name
          }));
          this.letter_list.forEach(leter => {
            this.mapOfBrand[leter] = this.vehicleBrandTreeList.filter(
              brand => brand.car_brand_initial === leter
            );
          });
        },
        err => {
          $('#selectMultiBrandFirmModal').modal('hide');
          this.globalService.httpErrorProcess(err);
        }
      );
  }

  // 获取品牌列表
  private requestBrandList() {
    this.requestBrandSubscription = this.vehicleService
      .requestCarBrandsListData()
      .subscribe(
        res => {
          this.carBrandList = res.results;
          this.vehicleBrandTreeList = this.carBrandList.map(i => ({
            ...i,
            key: i.car_brand_id,
            title: i.car_brand_name,
            children: [],
            expanded: false
          }));
          res.results.forEach((i, index) => {
            const isChekedBrand = this.car_brand_checked_list
              .join(',')
              .includes(i.car_brand_id);
            if (isChekedBrand) {
              this.getCheckedFactoryList(i, index);
            }
          });
        },
        err => {
          $('#selectMultiBrandFirmModal').modal('hide');
          this.globalService.httpErrorProcess(err);
        }
      );
  }

  // 获取已勾选的车型
  private getCheckedFactoryList(i, index) {
    this.vehicleService.requestCarFactoryListData(i.car_brand_id).subscribe(
      res => {
        this.carFactoryList = res.results;
        const newVehicleFirmList = res.results.map(f => ({
          ...f,
          key: f.car_factory_id,
          title: f.car_factory_name,
          children: [],
          expanded: false
        }));
        this.vehicleBrandTreeList[index].expanded = true;
        this.carFactoryList.forEach((v, idx) => {
          const isChekedFactory = this.car_factory_checked_list
            .join(',')
            .includes(v.car_factory_id);
          if (isChekedFactory) {
            this.getCheckedSeriesList(i, index, v, idx, newVehicleFirmList);
          }
        });
      },
      err => {
        this.carFactoryList = [];
        $('#selectMultiBrandFirmModal').modal('hide');
        this.globalService.httpErrorProcess(err);
      }
    );
  }

  // 获取已勾选的车系
  private getCheckedSeriesList(i, index, v, idx, newVehicleFirmList) {
    this.vehicleService
      .requestCarSeriesListData(i.car_brand_id, v.car_factory_id)
      .subscribe(
        data => {
          this.carSeriesList = data.results;
          const newVehicleSeriesList = this.carSeriesList.map(k => ({
            ...k,
            isLeaf: true,
            key: k.car_series_id,
            title: k.car_series_name,
            selected: this.car_series_checked_list
              .join(',')
              .includes(k.car_series_id),
            checked: this.car_series_checked_list
              .join(',')
              .includes(k.car_series_id)
          }));
          newVehicleFirmList[idx].expanded = true;
          newVehicleFirmList[idx].children = newVehicleSeriesList;
          this.vehicleBrandTreeList[index].children = newVehicleFirmList;
          this.letter_list.forEach(leter => {
            this.mapOfBrand[leter] = this.vehicleBrandTreeList.filter(
              brand => brand.car_brand_initial === leter
            );
          });
        },
        err => {
          this.carSeriesList = [];
          $('#selectMultiBrandFirmModal').modal('hide');
          this.globalService.httpErrorProcess(err);
        }
      );
  }

  // 加载下级菜单
  nzEvent(event: any): void {
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
  nzCheck(event: any): void {
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
    this.vehicleService.requestCarFactoryListData(car_brand_id).subscribe(
      res => {
        this.carFactoryList = res.results;
        const newVehicleFirmList = this.carFactoryList.map(i => ({
          ...i,
          key: i.car_factory_id,
          title: i.car_factory_name
        }));
        node.addChildren(newVehicleFirmList);
      },
      err => {
        this.carFactoryList = [];
        $('#selectMultiBrandFirmModal').modal('hide');
        this.globalService.httpErrorProcess(err);
      }
    );
  }

  // 获取对应车系列表
  private requestSeriesListByFirm(node) {
    const car_brand_id = node.parentNode.origin.car_brand_id;
    const car_factory_id = node.origin.car_factory_id;
    this.vehicleService
      .requestCarSeriesListData(car_brand_id, car_factory_id)
      .subscribe(
        res => {
          this.carSeriesList = res.results;
          const newVehicleSeriesList = this.carSeriesList.map(i => ({
            ...i,
            isLeaf: true,
            key: i.car_series_id,
            title: i.car_series_name
          }));
          node.addChildren(newVehicleSeriesList);
          if (node.isChecked && node.children.length !== 0) {
            node.children.forEach(i => {
              i.isChecked = true;
            });
          }
        },
        err => {
          this.carSeriesList = [];
          $('#selectMultiBrandFirmModal').modal('hide');
          this.globalService.httpErrorProcess(err);
        }
      );
  }

  // 获取对应厂商以及车系列表
  private requestFirmAndSeriesList(node) {
    const car_brand_id = node.origin.car_brand_id;
    this.vehicleService.requestCarFactoryListData(car_brand_id).subscribe(
      res => {
        this.carFactoryList = res.results;
        const newVehicleFirmList = this.carFactoryList.map(i => ({
          ...i,
          key: i.car_factory_id,
          title: i.car_factory_name
        }));
        node.addChildren(newVehicleFirmList);
        if (node.children.length !== 0) {
          node.children.forEach(i => {
            i.isChecked = true;
            this.requestSeriesListByFirm(i);
          });
        }
      },
      err => {
        this.carFactoryList = [];
        $('#selectMultiBrandFirmModal').modal('hide');
        this.globalService.httpErrorProcess(err);
      }
    );
  }

  // 回传选中事件
  public onSelectCarSeries() {
    const seriesList = [];
    for (const item of Object.keys(this.mapOfBrand)) {
      this.mapOfBrand[item].forEach(i => {
        if (i.checked) {
          // 第一级勾选
          if (i.children) {
            // 由于第二级全部勾选导致第一级勾选
            this.getThirdChecked(i, seriesList);
          } else {
            // 第一级全部勾选上
            seriesList.push(i);
          }
        } else {
          // 第一级未勾选
          this.getThirdChecked(i, seriesList);
        }
      });
    }
    if (seriesList.length === 0) {
      this.globalService.promptBox.open(
        `请勾选车系后再保存!`,
        null,
        2000,
        '/assets/images/warning.png'
      );
    } else {
      const newList = seriesList.flat();
      const seriesIds = newList
        .map(item => item.car_series_id && item.car_series_id)
        .join(',');
      this.setRecommendData(seriesIds);
    }
  }

  // 获取第三级勾选数据
  private getThirdChecked(firstLevel, seriesList) {
    if (firstLevel.children) {
      // 第二级有部分勾选
      firstLevel.children.forEach(secondLevel => {
        if (secondLevel.checked) {
          if (secondLevel.children) {
            // 第三级全部勾选导致第二级被勾选
            seriesList.push(secondLevel.children);
          } else {
            // 第二级全部勾选
            seriesList.push(secondLevel);
          }
        } else if (!secondLevel.checked) {
          // 第二级未勾选
          if (secondLevel.children) {
            // 第三级有部分勾选
            secondLevel.children.forEach(c => {
              if (c.checked) {
                seriesList.push(c);
              }
            });
          }
        }
      });
    } else {
      // 均未勾选
      seriesList = [];
    }
  }

  // 推荐设置接口
  private setRecommendData(seriesIds: string) {
    this.accessoryLibraryService
      .requestUpdateRecommendData(seriesIds, this.accessory_id)
      .subscribe(
        () => {
          this.globalService.promptBox.open('推荐设置成功！');
          this.close();
          this.sureCallbackInfo();
        },
        err => {
          if (!this.globalService.httpErrorProcess(err)) {
          }
          {
            if (err.status === 422) {
              const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
              for (const content of error.errors) {
                const field = content.field === 'car_series_ids' ? '车系' : '';
                if (content.code === 'missing_field') {
                  this.globalService.promptBox.open(
                    `${field}字段未填写!`,
                    null,
                    2000,
                    '/assets/images/warning.png'
                  );
                  return;
                } else if (content.code === 'invalid') {
                  this.globalService.promptBox.open(
                    `${field}字段输入错误!`,
                    null,
                    2000,
                    '/assets/images/warning.png'
                  );
                } else {
                  this.globalService.promptBox.open(
                    `推荐设置失败,请重试!`,
                    null,
                    2000,
                    '/assets/images/warning.png'
                  );
                }
              }
            }
          }
        }
      );
  }
}
