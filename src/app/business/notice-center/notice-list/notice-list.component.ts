import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs/index';
import { NoticeCenterService, NoticeEntity, SearchParams } from '../notice-center.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IntervalService } from '../interval.service';
import { ExpandedMenuComponent } from '../../../share/components/expanded-menu/expanded-menu.component';

const PageSize = 15;

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit, OnDestroy {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选

  public noticeList: Array<NoticeEntity> = []; // 通知列表

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

  @ViewChild(ExpandedMenuComponent, { static: true }) public menuComponent: ExpandedMenuComponent;

  constructor(
    private globalService: GlobalService,
    private noticeCenterService: NoticeCenterService,
    private intervalService: IntervalService,
    private router: Router) { }

  public ngOnInit() {
    this.generateNoticeList();
    this.requestUnreadCount();
    this.intervalService.timer_5minutes.subscribe(() => {
      this.searchText$.next();
    });
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 修改通知状态
  public onChangeReadStatus(message_id: string, status: number, third_product_id: string) {
    if (status === 2) {// 变更为已读状态
      this.noticeCenterService.requestChangeReadStatusData(message_id, 1).subscribe(res => {
        this.initPageIndex();
        this.requestNoticeList();
        this.requestUnreadCount();
        timer(0).subscribe(() => {
          this.router.navigateByUrl(`/main/ticket/product-management/third-detail/${third_product_id}/1/2`);
        });
      }, err => {
        this.initPageIndex();
        this.globalService.httpErrorProcess(err);
      });
    } else {// 已读数据点击直接跳转到第三方产品详情页面
      timer(0).subscribe(() => {
        this.router.navigateByUrl(`/main/ticket/product-management/third-detail/${third_product_id}/1/2`);
      });
    }
  }

  // 通知中心未读数量
  private requestUnreadCount() {
    this.globalService.requestUnreadCount().subscribe(res => {
      this.globalService.notice_Count = res.body ? res.body.unread_num : 0;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
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
    this.noticeCenterService.requestNoticeListData(this.searchParams).subscribe(res => {
      this.noticeList = res.results;
      this.linkUrl = res.linkUrl;
      this.initPageIndex();
      this.noResultText = '暂无数据';
    }, err => {
      this.noResultText = '暂无数据';
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
