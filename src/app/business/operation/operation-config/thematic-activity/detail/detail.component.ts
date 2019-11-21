import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { ThematicActivityService, ThematicEntity, ReadStatisticsEntity } from '../thematic-activity.service';
import { Subscription, forkJoin } from 'rxjs';

const PageSize = 15;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  public thematicRecord: ThematicEntity = new ThematicEntity(); // 产品详情

  public readStatisticsList: Array<ReadStatisticsEntity> = []; // 阅读统计列表

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private linkUrl: string; // 分页url

  private continueRequestSubscription: Subscription;

  private activity_id: string; // 专题活动id

  private get pageCount(): number {
    if (this.readStatisticsList.length % PageSize === 0) {
      return this.readStatisticsList.length / PageSize;
    }
    return this.readStatisticsList.length / PageSize + 1;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private thematicService: ThematicActivityService) {
    this.route.paramMap.subscribe(map => {
      this.activity_id = map.get('activity_id');
    });
  }

  public ngOnInit() {
    if (this.activity_id) {
      this.getThematicDetail();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 获取产品详情及浏览量统计列表
  private getThematicDetail(): void {
    forkJoin(this.thematicService.requestThematicDetail(this.activity_id),
      this.thematicService.requestClickListData(this.activity_id)).subscribe(res => {
        this.thematicRecord = res[0];
        this.readStatisticsList = res[1].results;
        this.linkUrl = res[1].linkUrl;
        this.noResultText = '暂无数据';
      }, err => {
        this.noResultText = '暂无数据';
        this.globalService.httpErrorProcess(err);
      });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.thematicService.continueClickListData(this.linkUrl)
        .subscribe(res => {
          this.readStatisticsList = this.readStatisticsList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }
}
