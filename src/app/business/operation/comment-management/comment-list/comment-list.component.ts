import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CommentEntity, CommentService, SearchCommentParams } from '../comment-management.service';
import { differenceInCalendarDays } from 'date-fns';
import { Router } from '@angular/router';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';

const PageSize = 15;

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  public commentList: Array<CommentEntity> = [];
  public pageIndex = 1;
  public searchParams: SearchCommentParams = new SearchCommentParams();
  public noResultText = '数据加载中...';
  public application_id: string;
  public start_pay_time = null; // 支付时间
  public end_pay_time = null;
  public imageUrls = ['/assets/images/icon_top.png'];

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  @ViewChild(ZPhotoSelectComponent, { static: true }) public ZPhotoSelectComponent: ZPhotoSelectComponent;
  @ViewChild('basicTable', { static: true }) public basicTable: ElementRef;

  private get pageCount(): number {
    if (this.commentList.length % PageSize === 0) {
      return this.commentList.length / PageSize;
    }
    return this.commentList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private commentService: CommentService,
              private router: Router) {
    this.searchParams.page_size = PageSize * 3;
  }

  ngOnInit() {
    this.searchText$.pipe(debounceTime(500), switchMap(() => this.commentService.requestCommentList(this.searchParams)))
        .subscribe(res => {
          this.commentList = res.results;
          this.linkUrl = res.linkUrl;
          this.noResultText = '暂无数据';
          this.pageIndex = 1;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    this.searchText$.next();
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.commentService.continueCommentList(this.linkUrl).subscribe(res => {
        this.commentList = this.commentList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 查看详情
  public onShowDetailClick(data) {
    this.router.navigate(['/main/operation/comment/comment-detail'],
        { queryParams: { comment_id: data.comment_id} });
  }

  // 通过、驳回按钮触发事件
  public onPassClick(data: CommentEntity, status: number) {
    this.commentService.requestUpdateStatus(data.comment_id, status).subscribe((e) => {
      const msg = status === 2 ? '通过成功！' : '驳回成功！';
      this.globalService.promptBox.open(msg);
      this.searchText$.next();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 置顶、取消置顶按钮触发事件
  public onTopClick(data: CommentEntity, status: number) {
    if (status === 1) {
      this.globalService.confirmationBox.open('提示', '确认置顶？', () => {
        this.globalService.confirmationBox.close();
        this.commentService.requestUpdateTop(data.comment_id, status).subscribe((e) => {
          this.globalService.promptBox.open('置顶成功！');
          this.searchText$.next();
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
      });
    } else {
      this.commentService.requestUpdateTop(data.comment_id, status).subscribe((e) => {
        this.globalService.promptBox.open('取消置顶成功！');
        this.searchText$.next();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  //  切换状态
  public onCheckStatusClicked(status) {
    this.searchParams = new SearchCommentParams();
    this.start_pay_time = null;
    this.end_pay_time = null;
    this.searchParams.status = status;
    this.searchText$.next();
  }

  // 查询按钮
  public onSearchBtnClick() {
    if (this.getTimeValid() === 'pay_time') {
      this.globalService.promptBox.open('查询失败', '评论开始时间不能大于结束时间!');
      return;
    }
    this.searchText$.next();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 查询时间校验
  private getTimeValid(): string {
    this.searchParams.section = (this.start_pay_time || this.end_pay_time)
        ? this.getSectionTime(this.start_pay_time, this.end_pay_time) : '';
    const pay_time = this.searchParams.section;
    if ((pay_time.split(',')[0] !== '0' && pay_time.split(',')[1] !== '0') && pay_time.split(',')[0] > pay_time.split(',')[1]) {
      return 'pay_time';
    } else {
      return '';
    }
  }

  // 获取预定时间时间戳
  public getSectionTime(start, end): string {
    const startTime = start ? (new Date(start).setHours(new Date(start).getHours(),
        new Date(start).getMinutes(), 0, 0) / 1000).toString() : 0;
    const endTime = end ? (new Date(end).setHours(new Date(end).getHours(),
        new Date(end).getMinutes(), 59, 0) / 1000).toString() : 253402185600;
    return `${startTime},${endTime}`;
  }

  // 评论开始时间校验
  public disabledStartPayDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.end_pay_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_pay_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 支付结束时间校验
  public disabledEndPayDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.start_pay_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.start_pay_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 打开放大图片组件
   */
  public openZoomPictureModal(data, index) {
    this.imageUrls = data.image_urls ? data.image_urls.split(',') : [];
    timer(0).subscribe(() => {
      this.ZPhotoSelectComponent.zoomPicture(index);
    });
  }
}
