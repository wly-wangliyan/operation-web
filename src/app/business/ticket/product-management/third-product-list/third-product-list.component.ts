import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import { ProductService, ThirdProductEntity } from '../product.service';

const PageSize = 15;

@Component({
  selector: 'app-third-product-list',
  templateUrl: './third-product-list.component.html',
  styleUrls: ['./third-product-list.component.css']
})
export class ThirdProductListComponent implements OnInit, OnDestroy {

  public product_name: string; // 产品名称

  public thirdProductList: Array<ThirdProductEntity> = []; // 门票列表

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  public searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string; // 分页url

  private get pageCount(): number {
    if (this.thirdProductList.length % PageSize === 0) {
      return this.thirdProductList.length / PageSize;
    }
    return this.thirdProductList.length / PageSize + 1;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private productService: ProductService) { }

  public ngOnInit() {
    this.generateThirdProductList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取产品列表
  private generateThirdProductList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestThirdProductList();
    });
    this.searchText$.next();
  }

  // 请求产品列表
  private requestThirdProductList() {
    this.requestSubscription = this.productService.requestThirdProductListData(this.product_name).subscribe(res => {
      this.thirdProductList = res.results;

      this.linkUrl = res.linkUrl;
      this.initPageIndex();
      this.noResultText = '暂无数据';
    }, err => {
      this.initPageIndex();
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.productService.continueThirdProductListData(this.linkUrl)
        .subscribe(res => {
          this.thirdProductList = this.thirdProductList.concat(res.results);
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

  // 点击选用
  public onChooseClick(product: ThirdProductEntity) {
    this.globalService.confirmationBox.open('提示', '确定选用此产品吗？', () => {
      this.globalService.confirmationBox.close();
      this.productService.requestAddProductData(product.third_product_id).subscribe(res => {
        this.globalService.promptBox.open('选用成功', () => {
          timer(0).subscribe(() => {
            this.router.navigateByUrl('/main/ticket/product-management');
          });
        });
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('选用失败，请重试！', null, 2000, null, false);
        }
      });
    });
  }
}
