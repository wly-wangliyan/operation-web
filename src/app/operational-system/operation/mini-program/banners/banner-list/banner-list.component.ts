import { Component, OnInit } from '@angular/core';
import { SearchBannerParams, BannerEntity, BannersService } from '../banners.service';
import { GlobalService } from '../../../../../core/global.service';
import { TabelHelper } from '../../../../../../utils/table-helper';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css']
})
export class BannerListComponent implements OnInit {
  public bannerList: Array<BannerEntity> = []; // 展位列表(只展示已开启的)
  public searchParams: SearchBannerParams = new SearchBannerParams();
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;

  private get pageCount(): number {
    return Math.ceil(this.bannerList.length / TabelHelper.NgPageSize);
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

}
