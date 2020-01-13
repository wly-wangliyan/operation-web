import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/internal/operators';
import { ActivityEntity, ActivitySearchParams, LuckDrawService } from '../luck-draw.service';
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

  public searchParams: ActivitySearchParams = new ActivitySearchParams(); // 条件筛选参数

  public activityList: Array<ActivityEntity> = []; // 活动列表

  private searchText$ = new Subject<any>();

  private linkUrl: string;

  private requestSubscription: Subscription; // 获取数据

  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.activityList.length % PageSize === 0) {
      return this.activityList.length / PageSize;
    }
    return this.activityList.length / PageSize + 1;
  }

  constructor(
      private router: Router,
      private globalService: GlobalService,
      private luckDrawService: LuckDrawService) { }

  public ngOnInit() {
    this.generateactivityList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.searchText$ && this.searchText$.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取活动配置列表
  private generateactivityList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestactivityList();
    });
    this.searchText$.next();
  }

  // 请求活动配置列表
  private requestactivityList(): void {
    this.requestSubscription = this.luckDrawService.requestActivityListData(this.searchParams).subscribe(res => {
      this.activityList = res.results;
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
      this.continueRequestSubscription = this.luckDrawService.continueActivityListData(this.linkUrl)
          .subscribe(res => {
            this.activityList = this.activityList.concat(res.results);
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
  public onSwitchChange(lottery_activity_id: string, event: any): void {
    const status = event ? 1 : 2;
    let sucessMsg = '开启成功!';
    let errMsg = '开启失败,请重试!';
    if (!event) {
      sucessMsg = '关闭成功';
      errMsg = '关闭失败，请重试!';
    }
    this.luckDrawService.requestChangeStatus(lottery_activity_id, status).subscribe(() => {
      this.globalService.promptBox.open(sucessMsg);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.resource === 'lottery_activity' && content.code === 'not_valid') {
              this.globalService.promptBox.open('当前时间超过有效期，无法开启!', null, 2000, null, false);
            } else if (content.resource === 'lottery_activities' && content.code === 'not_allow') {
              this.globalService.promptBox.open('此活动不允许开启!', null, 2000, null, false);
            } else if (content.resource === 'missed_settings' && content.code === 'not_set') {
              this.globalService.promptBox.open('没有设置未中奖设置，无法开启!', null, 2000, null, false);
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
  public onEditClick(lottery_activity_id: string): void {
    this.router.navigate(['/main/operation/operation-config/luck-draw/edit'],
        { queryParams: { lottery_activity_id } });
  }

  // 点击数据
  public onDataClick(lottery_activity_id: string): void {
    this.router.navigate(['/main/operation/operation-config/luck-draw/record'],
        { queryParams: { lottery_activity_id } });
  }

  // 删除活动
  public onDeleteClick(lottery_activity_id: string): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.luckDrawService.requestDeleteActivityData(lottery_activity_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功');
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('删除失败，请重试！', null, 2000, null, false);
          this.searchText$.next();
        }
      });
    });
  }

}
