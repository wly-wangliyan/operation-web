
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../../../core/global.service';
import { NotifyEntity, SearchParams, NoticeService } from '../notice.service';
import { NoticeEditComponent } from './notice-edit/notice-edit.component';
import { HttpErrorEntity } from '../../../../../core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit {
  public noticeList: Array<NotifyEntity> = [];
  public searchParams: SearchParams = new SearchParams();
  public noResultText = '数据加载中...';
  public tabs: Array<any> = [];
  public selectedTabIndex = 0;

  private searchText$ = new Subject<any>();

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 页码

  private linkUrl: string;

  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.noticeList.length % PageSize === 0) {
      return this.noticeList.length / PageSize;
    }
    return this.noticeList.length / PageSize + 1;
  }


  @ViewChild('noticeEdit', { static: true }) public noticeEdit: NoticeEditComponent;

  constructor(private globalService: GlobalService, private noticeService: NoticeService) { }

  ngOnInit() {
    this.tabs = [
      { key: 0, value: '检车通知' },
    ];
    this.selectedTabIndex = 0;
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestSubscription = this.noticeService.requestNotifyList(this.searchParams).subscribe(res => {
        this.noticeList = res.results;
        this.linkUrl = res.linkUrl;
        this.noResultText = '暂无数据';
        this.pageIndex = 1;
      }, err => {
        this.noResultText = '暂无数据';
        this.pageIndex = 1;
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchText$.next();
  }

  // 新建/编辑标签
  public onEditNotice(notice_id: string, title: string, type: number, status: boolean) {
    if (notice_id && status) {
      this.globalService.promptBox.open('请关闭通知后再进行编辑！', null, 2000, '/assets/images/warning.png');
    } else {
      this.noticeEdit.open(notice_id, title, type, () => {
        timer(1000).subscribe(() => {
          this.searchText$.next();
        });
      });
    }
  }

  // 上架开关状态改变
  public onSwitchChange(event: boolean) {
    timer(2000).subscribe(() => {
      return event;
    });
  }

  // 上架开关点击调用接口
  public onSwitchClick(notice_id: string, status: boolean) {
    const text = !status ? '上架' : '下架';
    this.noticeService.requestNoticeStatus(notice_id, !status).subscribe(res => {
      this.globalService.promptBox.open(`${text}成功!`);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          this.globalService.promptBox.open(`${text}失败，请重试`, null, 2000, '/assets/images/warning.png');
        }
      }
      this.searchText$.next();
    });
  }

  // 删除标签
  public onDelNotice(notice_id: string) {
    this.globalService.confirmationBox.open('提示', '此操作不可恢复，确定要删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.noticeService.requestDeleteNoticeData(notice_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功', () => {
          this.searchText$.next();
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.noticeService.continueNotifyList(this.linkUrl)
        .subscribe(res => {
          this.noticeList = this.noticeList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }


}
