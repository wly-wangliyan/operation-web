import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { ProductLibraryHttpService, ProductEntity, SearchParams } from '../product-library-http.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

const PageSize = 15;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选

  public productList: Array<ProductEntity> = []; // 产品列表

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
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private productLibraryService: ProductLibraryHttpService
  ) { }

  public ngOnInit() {
    this.productList.push(new ProductEntity());
    this.generateProductList();
  }

  // 初始化获取产品列表
  private generateProductList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProductList();
    });
    this.searchText$.next();
  }

  // 请求产品列表
  private requestProductList() {
    this.productLibraryService.requestProductListData(this.searchParams).subscribe(res => {
      this.productList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {

        }
      }
    });
  }

  /** 删除产品 */
  public onDeleteProgect(data: ProductEntity) {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.productLibraryService.requestDeleteProductData(data.upkeep_accessory_id).subscribe(res => {
        this.globalService.promptBox.open('删除成功');
        this.searchText$.next();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.productLibraryService.continueProductListData(this.linkUrl)
        .subscribe(res => {
          this.productList = this.productList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

}
