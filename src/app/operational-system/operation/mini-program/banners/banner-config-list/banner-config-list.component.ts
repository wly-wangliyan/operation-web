import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { GlobalService } from '../../../../../core/global.service';
import { BannersService, BannerEntity, SearchBannerParams } from '../banners.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BannerConfigEditComponent } from '../banner-config-edit/banner-config-edit.component';

@Component({
  selector: 'app-banner-config-list',
  templateUrl: './banner-config-list.component.html',
  styleUrls: ['./banner-config-list.component.css']
})
export class BannerConfigListComponent implements OnInit, OnDestroy {
  public bannerConfigList: Array<BannerEntity> = []; // 展位设置列表
  public searchParams: SearchBannerParams = new SearchBannerParams();
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;
  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    return Math.ceil(this.bannerConfigList.length / TabelHelper.NgPageSize);
  }

  @ViewChild('bannerConfigEdit', { static: true }) public bannerConfigEditRef: BannerConfigEditComponent;

  constructor(
    private globalService: GlobalService,
    private bannerService: BannersService
  ) { }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBannerConfigList();
    });
    this.searchText$.next();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 获取展位设置列表
  private requestBannerConfigList(): void {
    this.requestSubscription = this.bannerService.requestBannerListData(this.searchParams)
      .subscribe(backData => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.bannerConfigList = backData.results;
        this.linkUrl = backData.linkUrl;
      }, err => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 启停
  public onChangeSwitchStatus(): void {

  }

  // 编辑
  public onEditClick(data?: BannerEntity): void {
    this.bannerConfigEditRef.open(data || null, () => {
      this.searchText$.next();
    });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.bannerService.continueBannerListData(this.linkUrl)
        .subscribe(res => {
          this.bannerConfigList = this.bannerConfigList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }
}
