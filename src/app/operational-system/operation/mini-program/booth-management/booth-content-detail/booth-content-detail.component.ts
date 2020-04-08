import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { BoothService, BoothContentEntity, ClickStatisticsEntity } from '../booth.service';

@Component({
  selector: 'app-booth-content-detail',
  templateUrl: './booth-content-detail.component.html',
  styleUrls: ['./booth-content-detail.component.css']
})
export class BoothContentDetailComponent implements OnInit {

  public no_img_url = '../../../../../../assets/images/space_banner.png'; // 默认图片

  public boothContentRecord: BoothContentEntity = new BoothContentEntity(); // 展位详情

  public clickStatisticsList: Array<ClickStatisticsEntity> = []; // 点击统计列表

  public booth_id: string; // 展位ID

  public booth_content_id: string; // 展位内容ID

  public level3RelativePath: string; // 展位内容路由

  constructor(
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private boothService: BoothService
  ) {
    this.route.paramMap.subscribe(map => {
      this.booth_id = map.get('booth_id');
      this.booth_content_id = map.get('booth_content_id');
      this.level3RelativePath = `../../../booth-content-list/${this.booth_id}`;
    });
  }

  public ngOnInit() {
    if (this.booth_id && this.booth_content_id) {
      this.requestBoothContentDetail();
    } else {
      window.history.back();
    }
  }

  // 获取产品详情
  private requestBoothContentDetail(): void {
    this.boothService.requestBoothContentDetailData(this.booth_id, this.booth_content_id)
      .subscribe(detailData => {
        this.boothContentRecord = detailData;
        this.clickStatisticsList = detailData.click_num_statistics ? detailData.click_num_statistics : [];
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }
}
