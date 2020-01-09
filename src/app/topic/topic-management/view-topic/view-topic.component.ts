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
import { timer } from 'rxjs';
import { environment } from 'src/environments/environment';

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

    this.service.requestCommentList(this.commentSearchParams).subscribe(res => {
      this.commentList = res.results;

      this.commentList.map(item => {
        if (item.standpoint === this.viewPointList[0].viewpoint_id) {
          this.positiveList.push(item);
        }
      });
      this.commentList.map(item => {
        if (item.standpoint === this.viewPointList[1].viewpoint_id) {
          this.negativeList.push(item);
        }
      });

      // this.negativeList.push(this.commentList.find(item => item.standpoint === this.viewPointList[1].viewpoint_id));
      // this.positiveList.push(this.commentList.find(item => item.standpoint === this.viewPointList[0].viewpoint_id));
      console.log('this.negativeList', this.negativeList);
      console.log('this.positiveList', this.positiveList);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
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
