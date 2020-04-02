import { Component, OnInit } from '@angular/core';
import { BannersService, SearchBannerContentParams, BannerContentEntity } from '../banners.service';
import { GlobalService } from '../../../../../core/global.service';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';

@Component({
  selector: 'app-banner-content-list',
  templateUrl: './banner-content-list.component.html',
  styleUrls: ['./banner-content-list.component.css']
})
export class BannerContentListComponent implements OnInit {

  public bannerContentList: Array<BannerContentEntity> = []; // 展位列表(只展示已开启的)
  public searchParams: SearchBannerContentParams = new SearchBannerContentParams();
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;
  public online_start_time = ''; // 上线开始时间
  public online_end_time = ''; // 上线结束时间

  private get pageCount(): number {
    return Math.ceil(this.bannerContentList.length / TabelHelper.NgPageSize);
  }

  constructor(
    private globalService: GlobalService,
    private bannersService: BannersService
  ) { }

  public ngOnInit() {
  }

  private requestBannerList(): void {

  }

  public onNZPageIndexChange(event: any): void {

  }

  // 上线开始时间的禁用部分
  public disabledOnlineStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.online_start_time);
  }

  // 上线结束时间的禁用部分
  public disabledOnlineEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.online_end_time);
  }
}
