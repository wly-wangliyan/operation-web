import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import { NoticeCenterService } from '../notice-center.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit, OnDestroy {

  public noticeList: Array<any> = []; // 通知列表

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string; // 分页url

  private get pageCount(): number {
    if (this.noticeList.length % PageSize === 0) {
      return this.noticeList.length / PageSize;
    }
    return this.noticeList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private noticeCenterService: NoticeCenterService) { }

  public ngOnInit() {
    // this.requestNoticeList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取通知列表
  private generateNoticeList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestNoticeList();
    });
    this.searchText$.next();
  }

  // 请求通知列表
  private requestNoticeList() {
    this.noticeCenterService.requestNoticeListData().subscribe(res => {
      this.noticeList = res.results;
      this.linkUrl = res.linkUrl;
      this.initPageIndex();
      this.noResultText = '暂无数据';
    }, err => {
      this.initPageIndex();
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.noticeCenterService.continueNoticeListData(this.linkUrl)
        .subscribe(res => {
          this.noticeList = this.noticeList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

}
