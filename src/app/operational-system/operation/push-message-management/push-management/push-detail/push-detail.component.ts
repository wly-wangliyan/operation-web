import { Component, OnInit, ViewChild } from '@angular/core';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { PushCountEntity, PushEntity, PushManagementService, PushParams } from '../push-management.service';

@Component({
  selector: 'app-push-detail',
  templateUrl: './push-detail.component.html',
  styleUrls: ['./push-detail.component.css']
})
export class PushDetailComponent implements OnInit {

  public no_img_url = '../../../../../assets/images/image_space.png'; // 默认图片

  public pushRecord: PushEntity = new PushEntity(); // 产品详情

  public clickStatisticsList: Array<PushCountEntity> = []; // 点击统计列表

  private push_plan_id: string; // 推送id

  @ViewChild(ZPhotoSelectComponent, { static: true }) public ZhotoSelectComponent: ZPhotoSelectComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private pushService: PushManagementService
  ) {
    this.route.paramMap.subscribe(map => {
      this.push_plan_id = map.get('push_plan_id');
    });
  }

  public ngOnInit() {
    if (this.push_plan_id) {
      this.getPushDetail();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 获取产品详情
  private getPushDetail(): void {
    this.pushService.requestPushDetail(this.push_plan_id).subscribe(data => {
      this.pushRecord = data;
      this.clickStatisticsList = data.push_counts ? data.push_counts : [];
    }, err => {
      if (err.status === 404) {
        this.globalService.promptBox.open('该条数据已删除，请刷新后重试！', null, 2000, null, false);
      } else {
        this.globalService.httpErrorProcess(err);
      }
    });
  }

}
