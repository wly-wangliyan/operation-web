import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerEntity, BannerService } from '../../banner-management/banner.service';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { InterfaceDecorationService, PageEntity, SearchParams } from '../interface-decoration.service';
import { ActivatedRoute } from '@angular/router';

const PageSize = 15;

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选参数

  public recordList: Array<PageEntity> = []; // 草稿、发布记录列表

  public noResultText = '数据加载中...';

  public start_time: any = '';

  public end_time: any = '';

  public pageIndex = 1; // 页码

  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.recordList.length % PageSize === 0) {
      return this.recordList.length / PageSize;
    }
    return this.recordList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private interfaceDecorationService: InterfaceDecorationService) {
    route.queryParams.subscribe(queryParams => {
      this.searchParams.page_type = queryParams.page_type ? Number(queryParams.page_type) : 2;
    });
  }

  public ngOnInit() {
    this.generatePageList();
  }

  // 初始化获取page列表
  private generatePageList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestPageList();
    });
    this.searchText$.next();
  }

  // 请求Page列表
  private requestPageList(): void {
    this.requestSubscription = this.interfaceDecorationService.requestPageListData(this.searchParams).subscribe(res => {
      this.recordList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.interfaceDecorationService.continuePageListData(this.linkUrl)
        .subscribe(res => {
          this.recordList = this.recordList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 删除Page
  public onDeleteClick(page_id: string): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.interfaceDecorationService.requestDeletePageData(page_id).subscribe(() => {
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

  // tab页切换
  public onTabChange(page_type: number) {
    this.recordList = [];
    this.noResultText = '数据加载中...';
    this.searchParams = new SearchParams();
    this.start_time = null;
    this.end_time = null;
    this.searchParams.page_type = page_type;
    this.searchParams.category = '';
    this.searchText$.next();
  }

  // 重新发布
  public onReleaseClick(page_id: string) {
    this.globalService.confirmationBox.open('提示', '重新发布将替换当前正在生效的界面，确认发布吗？', () => {
      this.globalService.confirmationBox.close();
      this.interfaceDecorationService.requestPageReleaseData(page_id).subscribe(res => {
        this.globalService.promptBox.open('重新发布成功！');
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('重新发布失败，请重试！', null, 2000, null, false);
          this.searchText$.next();
        }
      });
    });
  }

  // 查询
  public onSearchBtnClick() {
    this.searchText$.next();
  }
}
