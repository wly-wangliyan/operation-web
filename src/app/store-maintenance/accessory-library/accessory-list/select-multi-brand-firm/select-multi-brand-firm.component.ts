import { Component, OnInit, Input } from '@angular/core';
import { Subscription, timer, of, forkJoin } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import {
  CarBrandEntity,
  CarFactoryEntity,
  CarSeriesEntity,
  VehicleManagementHttpService
} from '../../../vehicle-management/vehicle-management-http.service';
import { AccessoryLibraryService } from '../../accessory-library.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { switchMap, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Expandable {
  key: string;
  title: string;
  children: Array<any>;
  expanded: boolean;
  prepareState: 'noNeed' | 'need' | 'ready';
}

const MAX_REQUEST_COUNT = 3;

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
  ) { }

  @Input() public accessory_id: string;

  public letter_list = ['A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];
  public mapOfBrand: { [key: string]: Array<any> } = {}; // 字母对应品牌
  public defaultExpandedKeys = [];
  public defaultCheckedKeys = [];
  public loading = true;

  private car_series_list: Array<any> = []; // 已勾选的数组
  private isRequestSeriesData = false;
  private sureCallback: any;
  private closeCallback: any;
  private requestBrandSubscription: Subscription; // 获取品牌数据
  private requestFirmSubscription: Subscription; // 获取厂商数据

  public ngOnInit() { }

  // 品牌
  private requestAllCheckedCarBrands() {
    this.requestBrandSubscription = this.vehicleService
      .requestCarBrandsListData().pipe(map((carBrands: any) => {
        const carBrandCheckedStr = this.getCarBrandCheckedList().join(',');
        return carBrands.results.map((carBrand: any) =>
          ({
            ...carBrand,
            key: carBrand.car_brand_id,
            title: carBrand.car_brand_name,
            children: [],
            expanded: false,
            prepareState: carBrandCheckedStr.includes(carBrand.car_brand_id) ? 'need' : 'noNeed'
          }));
      }), switchMap(carBrandList => this.requestCheckedFactories(carBrandList))).subscribe(carBrandList => {
        this.letter_list.forEach(leter => {
          this.mapOfBrand[leter] = carBrandList.filter(
            (brand: any) => brand.car_brand_initial === leter
          );
        });
        this.loading = false;
      }, err => {
        this.loading = false;
        $('#selectMultiBrandFirmModal').modal('hide');
        this.globalService.httpErrorProcess(err);
      });
  }

  // 厂商
  private requestCheckedFactories(carBrandList: Array<Expandable & { car_brand_id: string }>): Observable<any> {
    const forkJoinHttps = [];
    const currentCarBrands = [];
    for (const carBrand of carBrandList) {
      if (carBrand.prepareState === 'need') {
        forkJoinHttps.push(this.vehicleService.requestCarFactoryListData(carBrand.car_brand_id));
        currentCarBrands.push(carBrand);
      }
      if (forkJoinHttps.length === MAX_REQUEST_COUNT) {
        // factory的最大并发数
        break;
      }
    }
    if (forkJoinHttps.length > 0) {
      // 存在需要加载的数据这执行递归调用
      const carFactoryCheckedStr = this.getCarFactoryCheckedList()
        .join(',');
      return forkJoin(forkJoinHttps).pipe(switchMap((httpRes: Array<any>) => {
        httpRes.forEach((carFactoryRes, index) => {
          currentCarBrands[index].children = carFactoryRes.results.map((carFactory: any) => ({
            ...carFactory,
            key: carFactory.car_factory_id,
            title: carFactory.car_factory_name,
            children: [],
            expanded: false,
            prepareState: carFactoryCheckedStr.includes(carFactory.car_factory_id) ? 'need' : 'noNeed'
          }));
          currentCarBrands[index].prepareState = 'ready';
        });
        return this.requestCheckedSeries(currentCarBrands).pipe(switchMap(() => this.requestCheckedFactories(carBrandList)));
      }));
    } else {
      return of(carBrandList);
    }
  }

  // 车系
  private requestCheckedSeries(carBrandList: Array<Expandable & { car_brand_id: string }>): Observable<any> {
    const forkJoinHttps = [];
    const currentCarFactories = [];
    for (const carBrand of carBrandList) {
      for (const carFactory of carBrand.children) {
        if (carFactory.prepareState === 'need') {
          forkJoinHttps.push(this.vehicleService
            .requestCarSeriesListData(carBrand.car_brand_id, carFactory.car_factory_id));
          currentCarFactories.push(carFactory);
        }
        if (forkJoinHttps.length === MAX_REQUEST_COUNT) {
          // series的最大并发数
          break;
        }
      }
      if (forkJoinHttps.length === MAX_REQUEST_COUNT) {
        // series的最大并发数
        break;
      }
    }
    if (forkJoinHttps.length > 0) {
      // 存在需要加载的数据这执行递归调用
      const carSeriesCheckedStr = this.getCarSeriesCheckedList()
        .join(',');
      return forkJoin(forkJoinHttps).pipe(switchMap((httpRes: Array<any>) => {
        httpRes.forEach((carSeriesRes, index) => {
          currentCarFactories[index].children = carSeriesRes.results.map((carSeries: any) => ({
            ...carSeries,
            isLeaf: true,
            key: carSeries.car_series_id,
            title: carSeries.car_series_name,
            selected: false,
            checked: carSeriesCheckedStr.includes(carSeries.car_series_id)
          }));
          currentCarFactories[index].prepareState = 'ready';
        });
        return this.requestCheckedSeries(carBrandList);
      }));
    } else {
      return of(carBrandList);
    }
  }

  /**
   * 打开
   */
  public open(data: any, sureFunc: any, closeFunc: any = null): any {
    $('.tree_ul').scrollTop(0);
    this.initModal();
    this.accessory_id = data.accessory_id;
    this.car_series_list = data.car_series_list || [];
    this.initDefaultKeys();
    this.requestAllCheckedCarBrands();
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    timer(0).subscribe(() => {
      $('#selectMultiBrandFirmModal').modal();
    });
  }

  /**
   * 关闭
   */
  public close(): any {
    this.initModal();
    this.requestBrandSubscription &&
      this.requestBrandSubscription.unsubscribe();
    this.requestFirmSubscription && this.requestFirmSubscription.unsubscribe();
    $('#selectMultiBrandFirmModal').modal('hide');
  }

  // 初始化
  private initModal(): void {
    this.loading = true;
    this.accessory_id = '';
    this.car_series_list = [];
    this.defaultCheckedKeys = [];
    this.defaultExpandedKeys = [];
  }

  // 获取已勾选的品牌id集合
  private getCarBrandCheckedList(): Array<any> {
    const car_brand_checked_list = this.car_series_list.map(
      carSeries => carSeries.car_brand.car_brand_id
    );
    return Array.from(new Set(car_brand_checked_list));
  }

  // 获取已勾选的厂商id集合
  private getCarFactoryCheckedList(): Array<any> {
    const car_factory_checked_list = this.car_series_list.map(
      carSeries => carSeries.car_factory.car_factory_id
    );
    return Array.from(new Set(car_factory_checked_list));
  }

  // 获取已勾选的车系id集合
  private getCarSeriesCheckedList(): Array<any> {
    const car_series_checked_list = this.car_series_list.map(
      carSeries => carSeries.car_series_id
    );
    return Array.from(new Set(car_series_checked_list));
  }

  // 初始化树结构已勾选项和已展开项
  private initDefaultKeys(): void {
    this.defaultExpandedKeys = this.getCarFactoryCheckedList();
    this.defaultCheckedKeys = this.getCarSeriesCheckedList();
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

  // 加载下级菜单
  public onNzExpand(event: any): void {
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
  public onNzCheck(event: any): void {
    if (event.eventName === 'check') {
      const node = event.node;
      if (node.isChecked) {
        if (node.level === 0) {
          this.requestFirmAndSeriesListData(node);
        } else if (node.level === 1) {
          if (node && node.getChildren().length === 0) {
            this.requestSeriesListByFirm(node);
          }
        }
      }
    }
  }

  /**
   * 根据品牌填充厂商和车系节点
   * @param node 品牌节点
   */
  private requestFirmAndSeriesListData(node: any): void {
    this.isRequestSeriesData = true;
    const car_brand_id = node.origin.car_brand_id;
    const forkJoinHttps = [];

    const addSeriesNode = () => {
      node.children.forEach((carFactoryRes: any) => {
        if (carFactoryRes && carFactoryRes.getChildren().length === 0) {
          forkJoinHttps.push(this.vehicleService.requestCarSeriesListData(car_brand_id, carFactoryRes.origin.car_factory_id));
        }
      });
      if (forkJoinHttps.length > 0) {
        forkJoin(forkJoinHttps).subscribe((httpRes) => {
          httpRes.forEach((carSeriesRes) => {
            const car_factory_id = carSeriesRes.results[0].car_factory.car_factory_id;
            const newVehicleSeriesList = carSeriesRes.results.map((carSeries: any) => ({
              ...carSeries,
              isLeaf: true,
              key: carSeries.car_series_id,
              title: carSeries.car_series_name,
              selected: false,
              checked: true
            }));
            const findIndex = node.children.findIndex((nodeRes: any) =>
              nodeRes.origin.car_factory_id === car_factory_id);
            node.children[findIndex].addChildren(newVehicleSeriesList);
          });
          this.isRequestSeriesData = false;
        }, err => {
          this.isRequestSeriesData = false;
          $('#selectMultiBrandFirmModal').modal('hide');
          this.globalService.httpErrorProcess(err);
        });
      } else {
        this.isRequestSeriesData = false;
      }
    };
    if (node && node.getChildren().length === 0) {
      this.vehicleService.requestCarFactoryListData(car_brand_id).subscribe(
        res => {
          const carFactoryList = res.results;
          const newVehicleFirmList = carFactoryList.map(factory => ({
            ...factory,
            key: factory.car_factory_id,
            title: factory.car_factory_name,
            checked: true
          }));
          node.addChildren(newVehicleFirmList);
          const node_length = node.children.length;
          if (node_length !== 0) {
            addSeriesNode();
          } else {
            this.isRequestSeriesData = false;
          }
        }, err => {
          this.isRequestSeriesData = false;
          $('#selectMultiBrandFirmModal').modal('hide');
          this.globalService.httpErrorProcess(err);
        });
    } else {
      addSeriesNode();
    }
  }

  /**
   * 展开时根据品牌填充对应厂商节点
   * @param node 品牌节点(一级)
   */
  private requestFirmListByBrand(node: any): void {
    const car_brand_id = node.origin.car_brand_id;
    this.vehicleService.requestCarFactoryListData(car_brand_id).subscribe(
      res => {
        const carFactoryList = res.results;
        const newVehicleFirmList = carFactoryList.map(carFactory => ({
          ...carFactory,
          key: carFactory.car_factory_id,
          title: carFactory.car_factory_name
        }));
        node.addChildren(newVehicleFirmList);
      }, err => {
        $('#selectMultiBrandFirmModal').modal('hide');
        this.globalService.httpErrorProcess(err);
      }
    );
  }

  /**
   * 根据厂商填充对应车系节点
   * @param node 厂商节点(二级)
   */
  private requestSeriesListByFirm(node: any): void {
    this.isRequestSeriesData = true;
    const car_brand_id = node.parentNode.origin.car_brand_id;
    const car_factory_id = node.origin.car_factory_id;
    this.vehicleService.requestCarSeriesListData(car_brand_id, car_factory_id)
      .subscribe(res => {
        const carSeriesList = res.results;
        const newVehicleSeriesList = carSeriesList.map(series => ({
          ...series,
          isLeaf: true,
          key: series.car_series_id,
          title: series.car_series_name,
          checked: node.isChecked
        }));
        node.addChildren(newVehicleSeriesList);
        this.isRequestSeriesData = false;
      }, err => {
        this.isRequestSeriesData = false;
        $('#selectMultiBrandFirmModal').modal('hide');
        this.globalService.httpErrorProcess(err);
      });
  }

  // 回传选中事件
  public onSelectCarSeries(): void {
    // if (this.getCheckedSeriesId().length === 0) {
    //   this.globalService.promptBox.open(
    //     `请勾选车系后再保存!`, null, 2000, null, false);
    //   return;
    // }
    const newList = this.getCheckedSeriesId().flat();
    const seriesIds = newList
      .map(item => item.car_series_id && item.car_series_id)
      .join(',');
    if (this.isRequestSeriesData) {
      this.globalService.promptBox.open(
        `正在请求车系数据，请稍后保存!`, null, 2000, null, false);
    } else {
      this.setRecommendData(seriesIds);
    }
  }

  // 获取选中的车系ID
  private getCheckedSeriesId(): Array<any> {
    const seriesList = [];
    for (const item of Object.keys(this.mapOfBrand)) {
      this.mapOfBrand[item].forEach(carBrand => {
        if (carBrand.checked) {
          // 第一级勾选
          if (carBrand.children) {
            // 由于第二级全部勾选导致第一级勾选
            this.getThirdChecked(carBrand, seriesList);
          } else {
            // 第一级全部勾选上
            seriesList.push(carBrand);
          }
        } else {
          // 第一级未勾选
          this.getThirdChecked(carBrand, seriesList);
        }
      });
    }
    return seriesList;
  }

  // 获取第三级勾选数据
  private getThirdChecked(firstLevel: any, seriesList: any): void {
    if (firstLevel.children) {
      // 第二级有部分勾选
      firstLevel.children.forEach((secondLevel: any) => {
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
            secondLevel.children.forEach((item: any) => {
              if (item.checked) {
                seriesList.push(item);
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
  private setRecommendData(seriesIds: string): void {
    this.accessoryLibraryService
      .requestUpdateRecommendData(seriesIds, this.accessory_id)
      .subscribe(() => {
        this.globalService.promptBox.open('推荐设置成功！');
        this.close();
        this.sureCallbackInfo();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              const field = content.field === 'car_series_ids' ? '车系' : '';
              if (content.code === 'missing_field') {
                this.globalService.promptBox.open(
                  `${field}字段未填写!`, null, 2000, null, false);
              } else if (content.code === 'invalid') {
                this.globalService.promptBox.open(
                  `${field}字段输入错误!`, null, 2000, null, false);
              } else {
                this.globalService.promptBox.open(
                  `推荐设置失败,请重试!`, null, 2000, null, false);
              }
            }
          } else if (err.status === 404) {
            this.globalService.promptBox.open(
              `当前所设置的配件信息无效,请重试!`, null, 2000, null, false);
          }
        }
      });
  }
}
