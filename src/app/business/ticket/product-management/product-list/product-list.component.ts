import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import { differenceInCalendarDays } from 'date-fns';
import { ProductService, TicketProductEntity, SearchParams } from '../product.service';

const PageSize = 15;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选

  public saleStatus = [1, 2]; // 销售状态 1:销售中 2:已下架

  public sale_status = ''; // 销售状态

  public start_time = ''; // 上架开始时间

  public end_time = ''; // 上架结束时间

  public productList: Array<TicketProductEntity> = []; // 产品列表

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string; // 分页url

  private get pageCount(): number {
    if (this.productList.length % PageSize === 0) {
      return this.productList.length / PageSize;
    }
    return this.productList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private productService: ProductService,
    private router: Router) { }

  public ngOnInit() {
    this.generateProductList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
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
    this.requestSubscription = this.productService.requestProductListData(this.searchParams).subscribe(res => {
      this.productList = res.results;
      this.linkUrl = res.linkUrl;
      this.initPageIndex();
      this.noResultText = '暂无数据';
    }, err => {
      this.initPageIndex();
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  public onChangeSearchStatus(event: any) {
    const status = event.target.value;
    this.searchParams.status = null;
    if (status) {
      this.searchParams.status = Number(status);
    }
  }

  // 条件筛选
  public onSearchBtnClick() {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
    }
  }

  // 编辑
  public onEditProduct(status: number, product_id: string) {
    if (status === 1) {
      this.globalService.promptBox.open('请下架后再进行编辑！');
    } else {
      this.router.navigateByUrl(`/main/ticket/product-management/edit/${product_id}`);
    }
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.productService.continueProductListData(this.linkUrl)
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

  /** 删除产品 */
  public onDeleteProduct(data: TicketProductEntity) {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.productService.requestDeleteProductData(data.product_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功', () => {
          this.searchText$.next();
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  /** 上架/下架产品 */
  public onChangeSaleStatus(data: TicketProductEntity) {
    const msg = data.status === 1 ? '下架' : '上架';
    const status = data.status === 1 ? 2 : 1;
    this.globalService.confirmationBox.open('提示', '确认' + msg + '此产品？', () => {
      this.globalService.confirmationBox.close();
      this.productService.requestChangeSaleStatusData(data.product_id, status).subscribe(res => {
        this.globalService.promptBox.open(msg + '成功', () => {
          this.searchText$.next();
        });
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            this.globalService.promptBox.open('产品已被第三方停售，无法上架！', () => {
              this.searchText$.next();
            });
          }
        }
      });
    });
  }

  /** 推荐/取消推荐产品 */
  public onChangeTopStatus(data: TicketProductEntity) {
    const is_top = data.is_top === 1 ? 2 : 1;
    const msg = data.is_top === 1 ? '取消推荐' : '设为推荐';
    this.productService.requestChangeTopStatusData(data.product_id, is_top).subscribe(res => {
      this.globalService.promptBox.open(msg + '成功', () => {
        this.searchText$.next();
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 上架开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 上架结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
      new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
      new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;

    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('上架开始时间不能大于结束时间！');
      return false;
    }

    if (this.start_time || this.end_time) {
      this.searchParams.section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.section = null;
    }
    return true;
  }

}
