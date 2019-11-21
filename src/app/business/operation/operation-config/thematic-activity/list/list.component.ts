import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { GlobalService } from '../../../../../core/global.service';
import {
  SearchParams,
  ThematicEntity,
  ThematicActivityService,
  ContentEntity,
  ElementItemEntity
} from '../thematic-activity.service';

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

  public preview_title = '';

  public isShowPreview = false; // 标记是否打开预览

  public previewList: Array<ContentEntity> = []; // 预览内容数组

  private space_one = '/assets/images/preview/icon_preview_space_one.png'; // 占位图

  private space_two = '/assets/images/preview/icon_preview_space_two.png'; // 占位图

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
    private thematicService: ThematicActivityService) {
  }

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
  public onEditClick(activity_id: string): void {
    this.router.navigate(['../edit'], { relativeTo: this.route, queryParams: { activity_id } });
  }

  /** 预览 */
  public onPreviewClick(thematicContent: ThematicEntity): void {
    this.previewList = [];
    this.preview_title = thematicContent.title;
    const content = thematicContent.content;
    content.forEach(contentItem => {
      const previewItem = new ContentEntity();
      previewItem.content_type = contentItem.content_type;
      previewItem.elements.push(new ElementItemEntity());
      if (contentItem.content_type === 3) {
        previewItem.elements[0].rich = contentItem.elements[0].rich;
      } else {
        contentItem.elements.forEach((elementItem, index) => {
          if (index === 1) {
            previewItem.elements.push(new ElementItemEntity());
          }
          if (elementItem.image) {
            previewItem.elements[index].image = elementItem.image;
          } else {
            if (contentItem.content_type === 1) {
              previewItem.elements[index].image = this.space_two;
            } else {
              previewItem.elements[index].image = this.space_one;
            }
          }
        });
      }
      this.previewList.push(previewItem);
    });
    this.isShowPreview = true;
  }

  // 关闭预览
  public onClosePreview() {
    // 重置滚动条位置
    $('.pru-con').scrollTop(0);
    this.isShowPreview = false;
  }

  // 删除
  public onDeleteClick(activity_id: string): void {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.thematicService.requestDeleteThematicData(activity_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功！');
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('删除失败，请重试！', null, 2000, null, false);
          this.searchText$.next();
        }
      });
    });
  }
}
