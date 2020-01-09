import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { TopicManagementHttpService, TopicEntity, TopicSearchParams } from '../topic-management-http.service';
import { GlobalService } from 'src/app/core/global.service';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { HttpErrorEntity } from 'src/app/core/http.service';

const PageSize = 15;
@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css'],
})
export class TopicListComponent implements OnInit, OnDestroy {

  public topicList: Array<TopicEntity> = [];
  public topic_start_time: any = ''; // 下单开始时间
  public topic_end_time: any = ''; // 下单结束时间
  public searchParams = new TopicSearchParams();

  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';

  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url

  private get pageCount(): number {
    return Math.ceil(this.topicList.length / PageSize);
  }

  constructor(
    private globalService: GlobalService,
    private service: TopicManagementHttpService
  ) { }

  ngOnInit() {
    this.generateTopicList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取订单列表
  private generateTopicList() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestTopicList();
    });
    this.searchText$.next();
  }


  // 请求订单列表
  private requestTopicList() {
    this.service.requestTopicListData(this.searchParams).subscribe(res => {
      this.topicList = res.results;
      this.linkUrl = res.linkUrl;
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
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
      this.continueRequestSubscription = this.service.continueRequestTopicListData(this.linkUrl).subscribe(res => {
        this.topicList = [...this.topicList, ...res.results];
        console.log('this.topicList ', this.topicList);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  /** 点击删按钮 */
  public onDelTopic(topic: TopicEntity) {
    this.globalService.confirmationBox.open('删除', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.service.requestDelTopic(topic.topic_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功', () => {
          this.searchText$.next();
        });
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 404) {
            this.globalService.promptBox.open('请求地址错误！', null, 2000, null, false);
          }
        }
      });
    });
  }

  /** 点击查询按钮 */
  public onSearchBtnClick() {
    if (this.generateAndCheckParamsValid()) {
      this.pageIndex = 1;
      this.searchText$.next();
    }
  }

  // 开始时间的禁用部分
  public disabledTopicStartTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.topic_end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.topic_end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 结束时间的禁用部分
  public disabledTopicEndTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.topic_start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.topic_start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 生成并检查参数有效性
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.topic_start_time ? (new Date(this.topic_start_time).setHours(new Date(this.topic_start_time).getHours(),
      new Date(this.topic_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.topic_end_time ? (new Date(this.topic_end_time).setHours(new Date(this.topic_end_time).getHours(),
      new Date(this.topic_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;

    if (this.topic_start_time || this.topic_end_time) {
      this.searchParams.section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.section = '';
    }
    return true;
  }

  // 修改启停状态
  public onSwitchChange(topic_id: string, event: any) {
    let swith = 0;
    event ? swith = 1 : swith = 0;
    let sucessMsg = '开启成功!';
    let errMsg = '开启失败,请重试!';
    if (!event) {
      sucessMsg = '关闭成功';
      errMsg = '关闭失败，请重试!';
    }
    this.service.changeTopicStatus(topic_id, swith).subscribe(() => {
      this.globalService.promptBox.open(sucessMsg);
      this.onNZPageIndexChange(this.pageIndex);
      // this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {

          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          // for (const content of error.errors) {
          //   if (content.resource === 'offline_status' && content.code === 'offline') {
          //     this.globalService.promptBox.open('当前时间已超出下线时间，无法开启!', null, 2000, null, false);
          //   } else if (content.resource === 'online_status' && content.code === 'limit') {
          //     this.globalService.promptBox.open('最大可同时显示5个Banner图，无法开启!', null, 2000, null, false);
          //   } else {
          this.globalService.promptBox.open(errMsg, null, 2000, null, false);
          //   }
          //   this.searchText$.next();
          // }
        }
      }
    });
  }

}
