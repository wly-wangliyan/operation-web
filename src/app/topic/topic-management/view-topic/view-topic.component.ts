import { Component, OnInit } from '@angular/core';
import {
  TopicManagementHttpService,
  CommentEntity,
  CommentSearchParams,
  TopicEntity,
  ViewpointsListEntity,
  ViewpointsSearchParams
} from '../topic-management-http.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/core/global.service';
import { timer, Subscription, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const PageSize = 15;
@Component({
  selector: 'app-view-topic',
  templateUrl: './view-topic.component.html',
  styleUrls: ['./view-topic.component.css']
})
export class ViewTopicComponent implements OnInit {

  public topic_id = ''; // 话题id
  public topicInfo = new TopicEntity();
  public commentList: Array<CommentEntity> = [];
  public commentSearchParams = new CommentSearchParams();
  public viewPointList: Array<ViewpointsListEntity> = [];
  public viewPointSearchParams = new ViewpointsSearchParams();
  public selectedTabIndex: number;
  public isMore = false;
  public positiveList: Array<CommentEntity> = [];
  public negativeList: Array<CommentEntity> = [];

  public positivePageIndex = 1; // 当前页码
  public negativePageIndex = 1; // 当前页码

  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private positiveLinkUrl: string; // 分页url
  private negativeLinkUrl: string; // 分页url

  private get ppageCount(): number {
    return Math.ceil(this.positiveList.length / PageSize);
  }
  private get npageCount(): number {
    return Math.ceil(this.negativeList.length / PageSize);
  }

  constructor(
    private service: TopicManagementHttpService,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.route.paramMap.subscribe(param => {
      this.topic_id = param.get('topic_id');
    });
  }

  ngOnInit() {
    this.getTopicInfo();
    this.getViewPoints();
  }

  /** 获取话题信息 */
  private getTopicInfo(): void {
    this.service.requestViewTopic(this.topic_id).subscribe(res => {
      this.topicInfo = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  /** 获取评论列表 */
  private getCommentList() {
    this.commentSearchParams.object_id = this.topic_id;

    if (environment.version === 'd' || environment.version === 'develop') {
      // D版work_id
      this.commentSearchParams.work_id = 'e9b51d9c2dc411eab0d60242ac120006';
    } else if (environment.version === 'r') {
      // R版work_id
      this.commentSearchParams.work_id = '462edd5031ea11eaa7570242ac130019';
    }

    this.getPositiveList();
    this.getNegativeList();

  }

  /** 获取正方评论 */
  private getPositiveList() {
    this.commentSearchParams.standpoint = this.viewPointList[0].viewpoint_id;
    this.service.requestCommentList(this.commentSearchParams).subscribe(res => {
      this.positiveList = res.results;
      this.positiveLinkUrl = res.linkUrl;
      this.positivePageIndex = 1;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  /** 获取反方评论 */
  private getNegativeList() {
    this.commentSearchParams.standpoint = this.viewPointList[1].viewpoint_id;
    this.service.requestCommentList(this.commentSearchParams).subscribe(res => {
      this.negativeList = res.results;
      this.negativeLinkUrl = res.linkUrl;
      this.negativePageIndex = 1;

      console.log('this.negativeList', this.negativeList);
      console.log('this.positiveList', this.positiveList);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }


  public onPositiveNZPageIndexChange(pageIndex: number) {
    this.positivePageIndex = pageIndex;
    if (pageIndex + 1 >= this.ppageCount && this.positiveLinkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.service.continueRequestTopicListData(this.positiveLinkUrl).subscribe(res => {
        this.positiveList = [...this.positiveList, ...res.results];
        this.positiveLinkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  public onNegativeNZPageIndexChange(pageIndex: number) {
    this.negativePageIndex = pageIndex;
    if (pageIndex + 1 >= this.npageCount && this.negativeLinkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.service.continueRequestTopicListData(this.negativeLinkUrl).subscribe(res => {
        this.negativeList = [...this.negativeList, ...res.results];
        this.negativeLinkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  /** 获取观点列表 */
  private getViewPoints() {
    this.viewPointSearchParams.topic_id = this.topic_id;
    this.service.requestViewpointList(this.viewPointSearchParams).subscribe(res => {
      this.viewPointList = res.results;
      console.log(this.viewPointList);

      this.getCommentList();

    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
