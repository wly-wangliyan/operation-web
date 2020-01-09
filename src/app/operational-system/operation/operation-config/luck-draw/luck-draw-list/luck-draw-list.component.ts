import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityConfigService, PromotionEntity, SearchParams } from '../../activity-config/activity-config.service';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/internal/operators';
import { HttpErrorEntity } from '../../../../../core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-luck-draw-list',
  templateUrl: './luck-draw-list.component.html',
  styleUrls: ['./luck-draw-list.component.css']
})
export class LuckDrawListComponent implements OnInit, OnDestroy {

  public noResultText = '数据加载中...';

  public pageIndex = 1; // 页码

  public searchParams: SearchParams = new SearchParams(); // 条件筛选参数

  public configList: Array<PromotionEntity> = []; // 活动配置列表

  private searchText$ = new Subject<any>();

  private linkUrl: string;

  private requestSubscription: Subscription; // 获取数据

  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.configList.length % PageSize === 0) {
      return this.configList.length / PageSize;
    }
    return this.configList.length / PageSize + 1;
  }

  constructor(
      private router: Router,
      private globalService: GlobalService,
      private configService: ActivityConfigService) { }

  public ngOnInit() {
    this.generateConfigList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.searchText$ && this.searchText$.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取活动配置列表
  private generateConfigList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestConfigList();
    });
    this.searchText$.next();
  }

  // 请求活动配置列表
  private requestConfigList(): void {
    this.requestSubscription = this.configService.requestActivityConfigListData(this.searchParams).subscribe(res => {
      this.configList = res.results;
      this.noResultText = '暂无数据';
      this.linkUrl = res.linkUrl;
      this.pageIndex = 1;
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.configService.continueActivityConfigListData(this.linkUrl)
          .subscribe(res => {
            this.configList = this.configList.concat(res.results);
            this.linkUrl = res.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
    }
  }

  // 搜索
  public onSearchBtnClick(): void {
    this.searchText$.next();
  }

  // 修改启停状态
  public onSwitchChange(promotion_id: string, event: any): void {
    const status = event ? 1 : 2;
    let sucessMsg = '开启成功!';
    let errMsg = '开启失败,请重试!';
    if (!event) {
      sucessMsg = '关闭成功';
      errMsg = '关闭失败，请重试!';
    }
    this.configService.requestChangeStatus(promotion_id, status).subscribe(() => {
      this.globalService.promptBox.open(sucessMsg);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {

          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.resource === 'time' && content.code === 'already_expired') {
              this.globalService.promptBox.open('当前时间超过有效期，无法开启!', null, 2000, null, false);
            } else {
              this.globalService.promptBox.open(errMsg, null, 2000, null, false);
            }
            this.searchText$.next();
          }
        }
      }
    });
  }

  // 点击编辑
  public onEditClick(promotion_id: string): void {
    this.router.navigate(['/main/operation/operation-config/luck-draw/edit'],
        { queryParams: { promotion_id } });
  }

  // 点击数据
  public onDataClick(promotion_id: string): void {
    this.router.navigate(['/main/operation/operation-config/luck-draw/record'],
        { queryParams: { promotion_id } });
  }

}
