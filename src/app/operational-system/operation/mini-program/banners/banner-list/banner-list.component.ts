import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchBannerParams, BannerEntity, BannersService } from '../banners.service';
import { GlobalService } from '../../../../../core/global.service';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css']
})
export class BannerListComponent implements OnInit, OnDestroy {
  public bannerList: Array<BannerEntity> = []; // 展位列表(只展示已开启的)
  public searchParams: SearchBannerParams = new SearchBannerParams();
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;
  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    return Math.ceil(this.bannerList.length / TabelHelper.NgPageSize);
  }

  constructor(
    private globalService: GlobalService,
    private bannerService: BannersService
  ) { }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBannerList();
    });
    this.searchText$.next();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 获取已开启的展位列表
  private requestBannerList(): void {
    this.requestSubscription = this.bannerService.requestBannerListData(this.searchParams)
      .subscribe(backData => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.bannerList = backData.results;
        this.linkUrl = backData.linkUrl;
      }, err => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 查询
  public onSearchBtnClick(): void {
    this.searchText$.next();
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number): void {
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
}
