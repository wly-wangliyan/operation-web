import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchWarehouseParams, SupplierManagementHttpService, WarehouseEntity } from '../supplier-management-http.service';

const PageSize = 15;

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {
  public warehouseList: Array<WarehouseEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public searchParams: SearchWarehouseParams = new SearchWarehouseParams();
  public vehicleBrandList = [];
  public vehicleFirmList = [];
  public time = null;
  public supplier_id: string;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.warehouseList.length % PageSize === 0) {
      return this.warehouseList.length / PageSize;
    }
    return this.warehouseList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private route: ActivatedRoute,
              private router: Router,
              private supplierHttpService: SupplierManagementHttpService) {
    route.paramMap.subscribe(map => {
      this.supplier_id = map.get('supplier_id');
    });
  }

  ngOnInit() {
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.supplierHttpService.requestWarehouseListData(this.supplier_id, this.searchParams))
    ).subscribe(res => {
      this.warehouseList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.supplierHttpService.continueWarehouseListData(this.linkUrl).subscribe(res => {
        this.warehouseList = this.warehouseList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 查询
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 开启、关闭线下仓库营业状态
  public onSwitchChange(warehouse_id: string, event: boolean) {
    const swith = event ? 1 : 2;
    this.supplierHttpService.requestUpdateStatusData(this.supplier_id, warehouse_id, swith).subscribe(res => {
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

  public onEditClick(data: WarehouseEntity) {
    this.router.navigate([`/supplier-management/supplier-list/${this.supplier_id}/warehouse-edit/${data.warehouse_id}/`]);
  }
}
