import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannersService, SearchBannerContentParams, BannerContentEntity } from '../banners.service';
import { GlobalService } from '../../../../../core/global.service';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-banner-content-list',
  templateUrl: './banner-content-list.component.html',
  styleUrls: ['./banner-content-list.component.css']
})
export class BannerContentListComponent implements OnInit, OnDestroy {

  public bannerContentList: Array<BannerContentEntity> = []; // 展位列表(只展示已开启的)
  public searchParams: SearchBannerContentParams = new SearchBannerContentParams();
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;
  public online_start_time = ''; // 上线开始时间
  public online_end_time = ''; // 上线结束时间
  private banner_id = '';  // 展位id
  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    return Math.ceil(this.bannerContentList.length / TabelHelper.NgPageSize);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private bannerService: BannersService
  ) {
    this.route.paramMap.subscribe(map => {
      this.banner_id = map.get('banner_id');
    });
  }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBannerContentList();
    });
    if (this.banner_id) {
      this.searchText$.next();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 获取展位内容列表
  private requestBannerContentList(): void {
    this.requestSubscription = this.bannerService.requestBannerContentListData(this.searchParams)
      .subscribe(backData => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.bannerContentList = backData.results;
        this.linkUrl = backData.linkUrl;
      }, err => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 查询
  public onSearchBtnClick(): void {

  }

  // 删除
  public onDeleteClick(banner: BannerContentEntity): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {

    });
  }

  // 启停
  public onChangeSwitchStatus(): void {

  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.bannerService.continueBannerContentListData(this.linkUrl)
        .subscribe(res => {
          this.bannerContentList = this.bannerContentList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 上线开始时间的禁用部分
  public disabledOnlineStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.online_end_time);
  }

  // 上线结束时间的禁用部分
  public disabledOnlineEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.online_start_time);
  }
}
