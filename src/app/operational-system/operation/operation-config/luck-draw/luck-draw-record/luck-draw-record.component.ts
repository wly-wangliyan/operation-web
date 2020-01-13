import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BannerEntity, BannerService, SearchParams } from '../../../mini-program/banner-management/banner.service';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import {
  ActivityEntity,
  DrawSearchParams,
  LotteryActivityClickEntity,
  LotteryActivityClickSearchParams,
  LuckDrawService,
  WinnerRecordEntity
} from '../luck-draw.service';


const PageSize = 15;

@Component({
  selector: 'app-luck-draw-record',
  templateUrl: './luck-draw-record.component.html',
  styleUrls: ['./luck-draw-record.component.css', '../../../../../../assets/less/tab-bar-list.less']
})
export class LuckDrawRecordComponent implements OnInit, OnDestroy {

  public searchParams: DrawSearchParams = new DrawSearchParams(); // 条件筛选参数
  public clickSearchParams: LotteryActivityClickSearchParams = new LotteryActivityClickSearchParams(); // 条件筛选参数
  public drawList: Array<WinnerRecordEntity> = []; // 抽奖记录列表
  public clicksList: Array<LotteryActivityClickEntity> = []; // 点击量列表
  public activityData: ActivityEntity = new ActivityEntity();
  public noResultText = '数据加载中...';
  public start_time: any = '';
  public end_time: any = '';
  public pageIndex = 1; // 页码
  public tabIndex = 1; // tab index

  private linkUrl: string;
  private linkUrlClick: string;
  private continueRequestSubscription: Subscription;
  private lottery_activity_id: string;
  private searchText$ = new Subject<any>();
  private searchClickText$ = new Subject<any>();

  private get pageCount(): number {
    if (this.drawList.length % PageSize === 0) {
      return this.drawList.length / PageSize;
    }
    return this.drawList.length / PageSize + 1;
  }

  constructor(
      private globalService: GlobalService,
      private bannerService: BannerService,
      private luckDrawService: LuckDrawService,
      private route: ActivatedRoute) {
    route.queryParams.subscribe(queryParams => {
      this.lottery_activity_id = queryParams.lottery_activity_id;
    });
  }

  public ngOnInit() {
    this.generateDrawList();
  }

  public ngOnDestroy() {
    this.searchText$ && this.searchText$.unsubscribe();
  }

  // 初始化获取抽奖记录列表
  private generateDrawList(): void {
    this.requestActivityData();
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestDrawList();
    });
    this.searchText$.next();
    this.searchClickText$.pipe().subscribe(() => {
      this.requestClickList();
    });
    this.searchClickText$.next();
  }

  // 请求抽奖记录列表
  private requestDrawList(): void {
    this.luckDrawService.requestWinnerRecordsListData(this.lottery_activity_id, this.searchParams).subscribe(res => {
      this.drawList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 请求访问量列表
  private requestClickList(): void {
    this.luckDrawService.requestClicksListData(this.lottery_activity_id, this.searchParams).subscribe(res => {
      this.clicksList = res.results;
      this.linkUrlClick = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 请求活动数据
  private requestActivityData(): void {
    this.luckDrawService.requestActivityDetail(this.lottery_activity_id).subscribe(res => {
      this.activityData = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.luckDrawService.continueWinnerRecordsListData(this.linkUrl)
          .subscribe(res => {
            this.drawList = this.drawList.concat(res.results);
            this.linkUrl = res.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
    }
  }

  public onClickNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.luckDrawService.continueClicksListData(this.linkUrl)
          .subscribe(res => {
            this.clicksList = this.clicksList.concat(res.results);
            this.linkUrlClick = res.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
    }
  }

  // 搜索抽奖记录
  public onSearchBtnClick(): void {
    this.searchText$.next();
  }

  // 搜索浏览量
  public onClickSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchClickText$.next();
    }
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

  // 校验数据
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? new Date(this.start_time).setHours(0, 0, 0, 0) / 1000 : null;
    const eTimeStamp = this.end_time ? new Date(this.end_time).setHours(23, 59, 59, 59) / 1000 : null;
    this.clickSearchParams.start_time = sTimestamp;
    this.clickSearchParams.end_time = eTimeStamp;
    if (sTimestamp && eTimeStamp) {
      if (sTimestamp > eTimeStamp) {
        this.globalService.promptBox.open('开始日期不能大于结束日期！', null, 2000, null, false);
        return false;
      }
    }
    return true;
  }

  // tab页切换
  public onTabChange(tabIndex: number) {
    this.tabIndex = tabIndex;
    if (tabIndex === 1) {
      this.searchParams = new DrawSearchParams();
      this.searchText$.next();
    } else {
      this.clickSearchParams = new LotteryActivityClickSearchParams();
      this.start_time = null;
      this.end_time = null;
      this.searchClickText$.next();
    }
  }
}
