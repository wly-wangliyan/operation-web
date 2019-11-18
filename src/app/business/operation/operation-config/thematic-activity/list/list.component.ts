import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { GlobalService } from '../../../../../core/global.service';
import { SearchParams, ThematicEntity, ThematicActivityService } from '../thematic-activity.service';
import { Router, ActivatedRoute } from '@angular/router';

const PageSize = 15;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  public searchParams: SearchParams = new SearchParams(); // 条件检索参数

  public thematicList: Array<ThematicEntity> = []; // 专题活动列表

  public noResultText = '数据加载中...';

  public pageIndex = 1; // 页码

  public searchText$ = new Subject<any>();

  private linkUrl: string; // 分页url

  private requestSubscription: Subscription; // 获取数据

  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.thematicList.length % PageSize === 0) {
      return this.thematicList.length / PageSize;
    }
    return this.thematicList.length / PageSize + 1;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private thematicService: ThematicActivityService) { }

  public ngOnInit() {
    this.generateThematicList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.searchText$ && this.searchText$.unsubscribe();
  }

  // 初始化获取专题活动列表
  private generateThematicList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestThematicList();
    });
    this.searchText$.next();
  }

  // 请求专题活动列表
  private requestThematicList(): void {
    this.requestSubscription = this.thematicService.requestThematicListListData(this.searchParams).subscribe(res => {
      this.thematicList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.thematicService.continueThematicListData(this.linkUrl)
        .subscribe(res => {
          this.thematicList = this.thematicList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 编辑
  public onEditClick(thematic_id: string): void {
    this.router.navigate(['../edit'], { relativeTo: this.route, queryParams: { thematic_id } });
  }

  // 预览
  public onViewClick(thematic_id: string): void {

  }

  // 删除
  public onDeleteClick(thematic_id: string): void {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
    });
  }
}
