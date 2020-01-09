import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TopicEntity,
  TopicManagementHttpService,
  EditTopicParams,
  ViewpointsSearchParams,
  ViewpointsListEntity,
  ViewpointsEntity
} from '../topic-management-http.service';
import { timer } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.css']
})
export class EditTopicComponent implements OnInit {

  public topic_id = ''; // 话题id
  public curTopic = new TopicEntity();
  public editTopic = new EditTopicParams();
  public viewpointsSearchParams = new ViewpointsSearchParams();
  public viewPointsList: Array<ViewpointsListEntity> = [];
  public editorErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 编辑器错误信息

  private tempContent = ''; // 活动描述富文本框内容
  private isInstanceReady = false; // 标记富文本编辑器是否加载完成;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private service: TopicManagementHttpService
  ) {
    this.route.paramMap.subscribe(param => {
      this.topic_id = param.get('topic_id');
    });
  }

  ngOnInit() {
    this.editTopic.viewpoints = [new ViewpointsEntity('', 0), new ViewpointsEntity('', 1)];
    if (this.topic_id) {
      this.getTopicInfo();
      this.getViewpointsList();
    } else {
      timer(500).subscribe(() => {
        CKEDITOR.instances.topicEditor.destroy(true);
        CKEDITOR.replace('topicEditor', { width: 1130 });
        this.isInstanceReady = true;
      });
    }
  }

  /**
   * 校验是否填写编辑器内容
   * @returns boolean
   */
  public get CheckEditorValid(): boolean {
    if (this.isInstanceReady) {
      if (CKEDITOR.instances.topicEditor) {
        return CKEDITOR.instances.topicEditor.getData() ? true : false;
      }
    } else {
      return false;
    }
  }

  /** 点击取消按钮 */
  public onCancelClick() {
    this.globalService.confirmationBox.open('提示', '是否确认取消编辑？', () => {
      this.globalService.confirmationBox.close();
      if (this.topic_id) {
        this.router.navigate(['../../topic-list'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../topic-list'], { relativeTo: this.route });
      }
    });
  }

  /** 获取观点列表 */
  private getViewpointsList() {
    this.viewpointsSearchParams.topic_id = this.topic_id;
    this.service.requestViewpointList(this.viewpointsSearchParams).subscribe(res => {
      this.viewPointsList = res.results;
      this.editTopic.viewpoints.map((item, i) => {
        this.viewPointsList.map((point, j) => {
          if (i === j) {
            item.name = point.name;
            item.viewpoint_id = point.viewpoint_id;
          }
        });
      });
      console.log(this.editTopic.viewpoints);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  /** 添加观点优先级 */
  public enterViewPoint(event: any, data: ViewpointsEntity, index: number) {
    data.priority = index;
  }

  /** 添加话题 */
  public onAddOrEditCommoditySubmit() {
    this.editTopic.content = CKEDITOR.instances.topicEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    if (this.topic_id) {
      this.service.requestEditTopic(this.topic_id, this.editTopic).subscribe(res => {
        this.globalService.promptBox.open('编辑成功！', () => {
          this.router.navigate(['../../topic-list'], { relativeTo: this.route });
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    } else {
      this.service.addTopic(this.editTopic).subscribe(res => {
        this.globalService.promptBox.open('创建成功！', () => {
          this.router.navigate(['../topic-list'], { relativeTo: this.route });
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 富文本数据处理
  public getEditorData() {
    timer(500).subscribe(() => {
      CKEDITOR.instances.topicEditor.destroy(true);
      this.tempContent = this.editTopic.content.replace('/\r\n/g', '<br>').replace(/\n/g, '<br>');
      CKEDITOR.replace('topicEditor', { width: 1130 }).setData(this.tempContent);
      this.isInstanceReady = true;
    });
  }

  /** 获取话题信息 */
  private getTopicInfo() {
    this.service.requestViewTopic(this.topic_id).subscribe(res => {
      this.curTopic = res;
      this.editTopic.title = this.curTopic.title;
      this.editTopic.content = this.curTopic.content;

      this.getEditorData();

    }, err => {
      this.getEditorData();
      this.globalService.httpErrorProcess(err);
    });
  }

}

/**
 * 错误信息
 */
export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isNullOrUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}
