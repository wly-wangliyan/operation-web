import { Component, OnInit } from '@angular/core';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { GlobalService } from '../../../../../core/global.service';
import { BannersService, BannerEntity } from '../banners.service';

@Component({
  selector: 'app-banner-config-list',
  templateUrl: './banner-config-list.component.html',
  styleUrls: ['./banner-config-list.component.css']
})
export class BannerConfigListComponent implements OnInit {
  public bannerConfigList: Array<BannerEntity> = []; // 展位设置列表
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;

  private get pageCount(): number {
    return Math.ceil(this.bannerConfigList.length / TabelHelper.NgPageSize);
  }

  constructor(
    private globalService: GlobalService,
    private bannersService: BannersService
  ) { }

  public ngOnInit() {
  }

  private requestBannerConfigList(): void {

  }

  public onNZPageIndexChange(event: any): void {

  }
}
