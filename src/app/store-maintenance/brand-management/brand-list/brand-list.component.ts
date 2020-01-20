import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  AccessoryBrandEntity,
  BrandManagementHttpService,
  SearchParams,
} from '../brand-management-http.service';
import { Subject, Subscription, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BrandEditComponent } from './brand-edit/brand-edit.component';
import { HttpErrorEntity } from '../../../core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {

  public accessoryBrandList: Array<AccessoryBrandEntity> = [];
  public pageIndex = 1;
  public searchParams = new SearchParams();
  public noResultText = '数据加载中...';
  public start_pay_time = null; // 支付时间
  public end_pay_time = null;
  public start_reserve_time = null; // 预定时间
  public end_reserve_time = null;
  public workerList: Array<any> = [];

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.accessoryBrandList.length % PageSize === 0) {
      return this.accessoryBrandList.length / PageSize;
    }
    return this.accessoryBrandList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private brandManagementService: BrandManagementHttpService) { }

  @ViewChild('brandEdit', { static: false }) public brandEdit: BrandEditComponent;

  ngOnInit() {
    // 配件品牌列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.brandManagementService.requestAccessoryBrandListData(this.searchParams))
    ).subscribe(res => {
      this.accessoryBrandList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 显示添加编辑Bannermodal
  public onShowModal(data?: AccessoryBrandEntity) {
    this.brandEdit.open(data, () => {
      this.brandEdit.clear();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, () => {
      this.brandEdit.clear();
    });
  }

  /** 删除品牌 */
  public onDeleteBrand(data: AccessoryBrandEntity) {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.brandManagementService.requestDeleteAccessoryData(data.accessory_brand_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功', () => {
          this.searchText$.next();
        });
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) { } {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.resource === 'accessory_brand' && content.code === 'already_related') {
                this.globalService.promptBox.open(`此品牌已关联配件，无法删除!`, null, 2000, '/assets/images/warning.png');
                return;
              } else {
                this.globalService.promptBox.open(`删除失败，请重试!`, null, 2000, '/assets/images/warning.png');
              }
            }
          }
        }
      });
    });
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      // tslint:disable-next-line:no-unused-expression
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.brandManagementService.continueAccessoryBrandListData(this.linkUrl).subscribe(res => {
        this.accessoryBrandList = this.accessoryBrandList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
}
