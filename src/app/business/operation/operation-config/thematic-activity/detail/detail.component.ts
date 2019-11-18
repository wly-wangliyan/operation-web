import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { ThematicActivityService, ThematicEntity, ReadStatisticsEntity } from '../thematic-activity.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  public thematicRecord: ThematicEntity = new ThematicEntity(); // 产品详情

  public readStatisticsList: Array<ReadStatisticsEntity> = []; // 阅读统计列表

  private thematic_id: string; // thematic_id 专题活动id

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private thematicService: ThematicActivityService) {
    this.route.paramMap.subscribe(map => {
      this.thematic_id = map.get('thematic_id');
    });
  }

  public ngOnInit() {
    if (this.thematic_id) {
      // this.getThematicDetail();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 获取产品详情
  private getThematicDetail(): void {
    this.thematicService.requestThematicDetail(this.thematic_id).subscribe(data => {
      this.thematicRecord = data;
      this.readStatisticsList = data.read_stats ? data.read_stats : [];
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
