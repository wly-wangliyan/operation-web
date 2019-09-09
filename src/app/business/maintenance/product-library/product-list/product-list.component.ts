import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { ProductLibraryHttpService } from '../product-library-http.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public productList: Array<any> = []; // 产品列表

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string;

  private get pageCount(): number {
    if (this.productList.length % PageSize === 0) {
      return this.productList.length / PageSize;
    }
    return this.productList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private productLibraryService: ProductLibraryHttpService
  ) { }

  public ngOnInit() {
    this.generateProjectList();
  }

  // 初始化获取产品列表
  private generateProjectList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProjectList();
    });
    this.searchText$.next();
  }

  // 请求产品列表
  private requestProjectList() {
    console.log('请求获取产品列表接口');
    this.noResultText = '暂无数据';
  }

  /** 删除 */
  public onDeleteProgect() {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      console.log('调用删除接口');
    });
  }

  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      console.log('分页请求产品数据');
      // this.continueRequestSubscription = this.productLibraryService.continueProductList(this.linkUrl).subscribe(res => {
      //   this.productList = this.productList.concat(res.results);
      //   this.linkUrl = res.linkUrl;
      // }, err => {
      //   this.globalService.httpErrorProcess(err);
      // });
    }
  }

  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

}
