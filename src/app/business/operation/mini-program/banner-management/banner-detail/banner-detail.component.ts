import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { BannerService, BannerEntity } from '../banner.service';
import { ZPhotoSelectComponent } from 'src/app/share/components/z-photo-select/z-photo-select.component';

@Component({
  selector: 'app-banner-detail',
  templateUrl: './banner-detail.component.html',
  styleUrls: ['./banner-detail.component.css']
})
export class BannerDetailComponent implements OnInit {

  public no_img_url = '../../../../../assets/images/space_banner.png'; // 默认图片

  public bannerRecord: BannerEntity = new BannerEntity(); // 产品详情

  private banner_id: string; // banner_id

  @ViewChild(ZPhotoSelectComponent, { static: true }) public ZPhotoSelectComponent: ZPhotoSelectComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private bannerService: BannerService
  ) {
    this.route.paramMap.subscribe(map => {
      this.banner_id = map.get('banner_id');
    });
  }

  public ngOnInit() {
    if (this.banner_id) {
      this.getBannerDetail();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 获取产品详情
  private getBannerDetail(): void {
    this.bannerService.requestBannerDetail(this.banner_id).subscribe(data => {
      this.bannerRecord = data;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
