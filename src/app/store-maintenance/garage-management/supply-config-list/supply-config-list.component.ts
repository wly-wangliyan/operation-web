import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileImportViewModel } from '../../../../utils/file-import.model';
import { Subject, Subscription } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import { GarageManagementService, SupplyConfigParams, SetSupplyConfigParams, AccessoryInfoEntity } from '../garage-management.service';
import { ProjectEntity, AccessoryLibraryService } from '../../accessory-library/accessory-library.service';
import { SupplierEntity, WarehouseEntity } from '../../supplier-management/supplier-management-http.service';

const PageSize = 15;

@Component({
  selector: 'app-supply-config-list',
  templateUrl: './supply-config-list.component.html',
  styleUrls: ['./supply-config-list.component.css']
})
export class SupplyConfigListComponent implements OnInit {

  public accessoryList: Array<AccessoryInfoEntity> = []; // 配件列表

  public searchParams: SupplyConfigParams = new SupplyConfigParams();
  public importViewModel: FileImportViewModel = new FileImportViewModel();
  public projectList: Array<ProjectEntity> = []; // 所属项目
  public supplierList: Array<SupplierEntity> = []; // 供应商列表
  public searchWarehouseList: Array<WarehouseEntity> = []; // 筛选供应仓库列表
  public warehouseList: Array<WarehouseEntity> = []; // 供应仓库列表
  public configParams: SetSupplyConfigParams = new SetSupplyConfigParams();
  public supply_type = [1, 2]; // 1:第三方供应商 2:门店自供

  public isAllDisplayDataChecked = false;
  public isIndeterminate = false;
  public mapOfCheckedId: { [key: string]: boolean } = {};
  public tempCheckedArr: Array<any> = []; // 选中的id集合

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  public pageIndex = 1;
  public noResultText = '数据加载中...';

  private repair_shop_id: string; // 汽修店id

  private get pageCount(): number {
    if (this.accessoryList.length % PageSize === 0) {
      return this.accessoryList.length / PageSize;
    }
    return this.accessoryList.length / PageSize + 1;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private accessoryService: AccessoryLibraryService,
    private garageService: GarageManagementService) {
    this.route.paramMap.subscribe(map => {
      this.repair_shop_id = map.get('repair_shop_id');
    });
  }

  public ngOnInit() {
    if (this.repair_shop_id) {
      this.generateConfigList();
      this.requestProjectList();
      this.requestSupplierList();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  // 初始化获取供货配置列表
  private generateConfigList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestConfigList();
    });
    this.searchText$.next();
  }

  // 请求配置列表
  private requestConfigList() {
    this.resetCheckStatus();
    this.garageService.requestSupplyConfigList(this.searchParams, this.repair_shop_id).subscribe(res => {
      this.accessoryList = res.results;
      this.linkUrl = res.linkUrl;
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 全选
  public onCheckAll(event: any) {
    if (event.target.checked) {
      $('.check-single').prop('checked', true);
      this.checkItem();
    } else {
      this.resetCheckStatus();
    }
  }

  public onChangeCheck(event: any): void {
    this.checkItem();
    if ($('.check-single ').length > this.tempCheckedArr.length) {
      $('.check-all').prop('checked', false);
    } else if ($('.check-single ').length === this.tempCheckedArr.length) {
      $('.check-all').prop('checked', true);
    }
  }

  // 处理列表
  private checkItem() {
    this.tempCheckedArr = [];
    const tempCheckList = $('.check-single');
    for (const item of tempCheckList) {
      const checkValue = item.value;
      if (item.checked && !this.tempCheckedArr.includes(checkValue)) {
        this.tempCheckedArr.push(checkValue);
      }
    }
  }

  // 重置多选及全选
  private resetCheckStatus() {
    this.tempCheckedArr = [];
    $('.check-all').prop('checked', false);
    $('.check-single ').prop('checked', false);
  }

  // 获取项目列表
  private requestProjectList() {
    this.garageService.requestProjectListData().subscribe(res => {
      this.projectList = res;
    }, err => {
      this.projectList = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取供应商列表
  private requestSupplierList() {
    this.garageService.requestSupplierListData().subscribe(res => {
      this.supplierList = res;
    }, err => {
      this.supplierList = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取供应仓库列表
  private requestSearchWarehouseList(supplier_id: string): void {
    this.garageService.requestWarehouseListData(supplier_id).subscribe(res => {
      this.searchWarehouseList = res;
    }, err => {
      this.searchWarehouseList = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取供应仓库列表
  private requestWarehouseList(supplier_id: string, warehouse_id?: string): void {
    this.garageService.requestWarehouseListData(supplier_id, 1).subscribe(res => {
      this.warehouseList = res;
      if (warehouse_id && !this.warehouseList.some(warehouse => warehouse.warehouse_id === warehouse_id)) {
        this.configParams.warehouse_id = '';
      }
    }, err => {
      this.warehouseList = [];
      this.configParams.warehouse_id = '';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.resetCheckStatus();
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.garageService.continueSupplyConfigList(this.linkUrl).subscribe(res => {
        this.accessoryList = this.accessoryList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  public onChangeSearchSupplier(event: any): void {
    this.searchParams.warehouse_id = '';
    if (event.target.value) {
      this.requestSearchWarehouseList(event.target.value);
    }
  }

  // 查询
  public onSearchBtnClick() {
    this.searchText$.next();
  }

  // 设置供应商
  public onSettingClick(data: AccessoryInfoEntity): void {
    this.configParams = new SetSupplyConfigParams();
    this.configParams.accessory_ids = data.accessory_id;
    if (data.supply_config) {
      this.configParams.supply_type = data.supply_config.supply_type || '';
      this.configParams.supplier_id = data.supply_config.supplier ? data.supply_config.supplier.supplier_id : '';
      this.configParams.warehouse_id = data.supply_config.warehouse ? data.supply_config.warehouse.warehouse_id : '';
      if (this.configParams.supply_type === 1 && this.configParams.supplier_id) {
        if (this.supplierList.some(supplier => supplier.supplier_id === this.configParams.supplier_id)) {
          this.requestWarehouseList(this.configParams.supplier_id, this.configParams.warehouse_id);
        } else {
          this.configParams.supplier_id = '';
        }
      }
    }
    $('#configModal').modal();
  }

  // 批量设置供应商
  public onBatchSetting() {
    this.configParams = new SetSupplyConfigParams();
    this.configParams.accessory_ids = this.tempCheckedArr.join(',');
    $('#configModal').modal();
  }

  // 切换供货方式
  public onChangeSupplyType(event: any): void {
    this.configParams.supplier_id = '';
    this.configParams.warehouse_id = '';
    if (event.target.value) {
      this.configParams.supply_type = Number(event.target.value);
    }
  }

  // 切换供应商
  public onChangeSupplier(event: any): void {
    this.configParams.warehouse_id = '';
    if (event.target.value) {
      this.requestWarehouseList(event.target.value);
    }
  }

  public onCheckClick(): void {
    this.garageService.requestSetSupplyConfig(this.repair_shop_id, this.configParams).subscribe(() => {
      $('#configModal').modal('hide');
      this.globalService.promptBox.open('保存成功');
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.field === 'supply_type' && content.code === 'invalid') {
              this.globalService.promptBox.open('供货方式错误，请重新选择!', null, 2000, null, false);
              return;
            } else if (content.field === 'accessory_ids' && content.code === 'invalid') {
              this.globalService.promptBox.open('当前配件信息错误，请刷新重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
              return;
            }
          }
        } else if (err.status === 404) {
          this.globalService.promptBox.open('当前配件不存在，请刷新重试!', null, 2000, null, false);
          return;
        }
      }
    });
  }
}
