import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SearchParams, SupplierEntity, SupplierManagementHttpService } from '../supplier-management-http.service';
import { Router } from '@angular/router';

const PageSize = 15;

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  public supplierList: Array<SupplierEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public searchParams: SearchParams = new SearchParams();
  public vehicleBrandList = [];
  public vehicleFirmList = [];
  public time = null;

  @ViewChild('helpServicePromptDiv', { static: true }) public helpServicePromptDiv: ElementRef;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.supplierList.length % PageSize === 0) {
      return this.supplierList.length / PageSize;
    }
    return this.supplierList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private router: Router,
              private supplierHttpService: SupplierManagementHttpService) {
  }

  ngOnInit() {
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.supplierHttpService.requestSupplierListData(this.searchParams))
    ).subscribe(res => {
      this.supplierList = res.results;
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
      this.continueRequestSubscription = this.supplierHttpService.continueSupplierListData(this.linkUrl).subscribe(res => {
        this.supplierList = this.supplierList.concat(res.results);
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

  // 跳转至线下仓库页面
  public onWarehouseClick(data: SupplierEntity) {
    this.router.navigate([`/supplier-management/supplier-list/${data.supplier_id}/warehouse-list`]);
  }
}
