import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BannerEntity, BannerService, SearchParams } from '../../../mini-program/banner-management/banner.service';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';


const PageSize = 15;

@Component({
  selector: 'app-luck-draw-record',
  templateUrl: './luck-draw-record.component.html',
  styleUrls: ['./luck-draw-record.component.css', '../../../../../../assets/less/tab-bar-list.less']
})
export class LuckDrawRecordComponent implements OnInit, OnDestroy {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选参数

  public bannerList: Array<BannerEntity> = []; // banner列表

  public noResultText = '数据加载中...';

  public start_time: any = '';

  public end_time: any = '';

  private searchText$ = new Subject<any>();

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 页码

  private linkUrl: string;

  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.bannerList.length % PageSize === 0) {
      return this.bannerList.length / PageSize;
    }
    return this.bannerList.length / PageSize + 1;
  }

  constructor(
      private globalService: GlobalService,
      private bannerService: BannerService) { }

  public ngOnInit() {
    this.generateBannerList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.searchText$ && this.searchText$.unsubscribe();
  }

  // 初始化获取banner列表
  private generateBannerList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBannerList();
    });
    this.searchText$.next();
  }

  // 请求banner列表
  private requestBannerList(): void {
    this.requestSubscription = this.bannerService.requestBannerListData(this.searchParams).subscribe(res => {
      this.bannerList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.bannerService.continueBannerListData(this.linkUrl)
          .subscribe(res => {
            this.bannerList = this.bannerList.concat(res.results);
            this.linkUrl = res.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
    }
  }

  // 搜索
  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
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

  // 删除Banner
  public onDeleteClick(banner_id: string): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.bannerService.requestDeleteBannerData(banner_id).subscribe(() => {
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

  // 校验数据
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
        new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : null;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : null;
    this.searchParams.start_time = sTimestamp;
    this.searchParams.end_time = eTimeStamp;

    if (sTimestamp && eTimeStamp) {
      if (sTimestamp > eTimeStamp) {
        this.globalService.promptBox.open('上线开始时间不能大于结束时间！', null, 2000, null, false);
        return false;
      }
    }
    return true;
  }

  // tab页切换
  public onTabChange(banner_type: number) {
    this.searchParams = new SearchParams();
    this.start_time = null;
    this.end_time = null;
    this.searchParams.banner_type = banner_type;
    this.searchText$.next();
  }
}
