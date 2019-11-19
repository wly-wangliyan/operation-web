import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { HttpErrorEntity } from '../../../../../core/http.service';
import {
  ThematicActivityService, ThematicEntity,
  ThematicParams, ContentEntity, ElementItemEntity
} from '../thematic-activity.service';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {

  public thematicDetail: ThematicEntity = new ThematicEntity(); // 专题内容详情

  public thematicParams: ThematicParams = new ThematicParams(); // 添加编辑参数

  public contentList: Array<ContentEntity> = []; // 内容数组

  public routerTitle = '新建专题活动'; // 路由标题

  public loading = true;

  private requestSubscription: Subscription;

  private searchText$ = new Subject<any>();

  private activity_id: string; // 配置id

  private is_save = false; // 标记是否保存中

  private isCreate = true; // 标记是否新建

  public replaceWidth = 730; // 富文本宽度

  public titleErrMsg = ''; // 标题错误提示

  private sort = 0;

  @ViewChild('editActivityForm', { static: false }) public editForm: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private thematicService: ThematicActivityService
  ) {
    route.queryParams.subscribe(queryParams => {
      this.activity_id = queryParams.activity_id;
    });
  }

  public ngOnInit() {
    this.is_save = false;
    if (this.activity_id) {
      this.isCreate = false;
      this.routerTitle = '编辑专题活动';
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.rquestThematicDetail();
      });
      this.searchText$.next();
    } else {
      this.loading = false;
      this.isCreate = true;
      this.thematicDetail = new ThematicEntity();
      this.contentList = [];
    }
  }

  public ngAfterViewInit() {

  }

  // 获取详情
  private rquestThematicDetail(): void {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.thematicService.requestThematicDetail(this.activity_id).subscribe(res => {
      this.thematicDetail = res;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.globalService.httpErrorProcess(err);
    });
  }



  // 生成双图文链接
  public onAddTwoPictureUrl() {
    this.generateContentItem(1);
  }

  // 生成单图文链接
  public onAddOnePictureUrl() {
    this.generateContentItem(2);
  }

  // 生成富文本
  public onAddCkEditor() {
    this.generateContentItem(3);
    timer(100).subscribe(() => {
      // CKEDITOR.instances[`activityEditor${this.sort}`].destroy(true);
      // CKEDITOR.replace(`activityEditor${this.sort}`, { width: 1130 });
    });
  }

  private generateContentItem(type: number) {
    this.sort++;
    const contentItem = new ContentEntity();
    contentItem.content_type = type;
    contentItem.elements.push(new ElementItemEntity());
    contentItem.elements[0].type = type;
    contentItem.elements[0].time = new Date().getTime();
    contentItem.elements[0].sort_num = this.sort;
    contentItem.elements[0].element_id = `activityItem${this.sort}`;
    if (type === 1) {
      contentItem.elements[0].belong_to = 2;
      this.sort++;
      contentItem.elements.push(new ElementItemEntity());
      contentItem.elements[1].type = type;
      contentItem.elements[1].time = new Date().getTime() + 5;
      contentItem.elements[1].sort_num = this.sort;
      contentItem.elements[1].element_id = `activityItem${this.sort}`;
      contentItem.elements[1].belong_to = 2;
    } else if (type === 2) {
      contentItem.elements[0].belong_to = 2;
    } else if (type === 3) {
      contentItem.elements[0].rich = '';
    }
    this.contentList.push(contentItem);
  }

  // 切换落地页
  public onChangeBelongTo(event: any, index: number, elementIndex?: number): void {
    if (event.target.value) {
      if (elementIndex >= 0) {
        this.contentList[index].elements[elementIndex].belong_to = Number(event.target.value);
        this.contentList[index].elements[elementIndex].link = null;
        this.contentList[index].elements[elementIndex].errMsg = '';
      } else {
        this.contentList[index].elements[0].belong_to = Number(event.target.value);
        this.contentList[index].elements[0].link = null;
        this.contentList[index].elements[0].errMsg = '';
      }
    }
  }

  // 点击保存
  public onEditFormSubmit() {
    this.thematicParams.content = [];
    if (this.generateAndCheckParamsValid()) {
      console.log('save');
      console.log(this.thematicParams);
    }
  }

  private generateAndCheckParamsValid(): boolean {
    if (!this.thematicParams.title) {
      this.titleErrMsg = '请输入标题！';
      return false;
    }

    if (!this.contentList || this.contentList.length === 0) {
      this.globalService.promptBox.open('请至少添加一种模板！', null, 2000, null, false);
      return false;
    }

    for (const contentIndex in this.contentList) {
      if (this.contentList.hasOwnProperty(contentIndex)) {
        const content_type = this.contentList[contentIndex].content_type;
        const elements = this.contentList[contentIndex].elements;
        if (content_type === 3) {
          const tmpRichContent = CKEDITOR.instances[`${elements[0].element_id}`].getData();
          if (!tmpRichContent) {
            elements[0].rich = null;
            elements[0].errMsg = '内容不能为空!';
            return false;
          } else {
            elements[0].rich = tmpRichContent.replace('/\r\n/g', '').replace(/\n/g, '');
            elements[0].errMsg = '';
            const tmpData = this.contentList[contentIndex].clone();
            tmpData.elements[0] = elements[0].toEditJson();
            this.thematicParams.content.push(tmpData);
          }
        } else {
          for (const elementIndex in elements) {
            if (elements.hasOwnProperty(elementIndex)) {
              if (isNullOrUndefined(elements[elementIndex].image)) {
                elements[elementIndex].errMsg = '请上传图片！';
                return false;
              }

              if (!elements[elementIndex].link) {
                elements[elementIndex].errMsg = '请输入跳转URL！';
                return false;
              } else {
                elements[elementIndex].errMsg = '';
              }
            }
          }
          const tmpData = this.contentList[contentIndex].clone();
          tmpData.elements[0] = elements[0].toEditJson();
          if (content_type === 1) {
            tmpData.elements[1] = elements[1].toEditJson();
          }
          this.thematicParams.content.push(tmpData);
        }
      }
    }
    return true;
  }

  public onDeleteClick(index: number) {
    this.contentList.splice(index, 1);
  }

  // 变更图片结果
  public onSelectedPicture(event: any): void {
    if (event) {
      this.contentList.forEach(item => {
        if (item.content_type !== 3) {
          item.elements.forEach(element => {
            if (element.element_id === event.file_id) {
              element.errMsg = event.errMsg;
              if (!event.imageList || event.imageList.length === 0) {
                element.image = null;
              } else {
                element.image = event.imageList.map(i => i.sourceUrl);
              }
            }
          });
        }
      });
    }
  }

  // 上传图片结果
  public onUploadFinish(event: any): void {
    if (event) {
      this.contentList.forEach(item => {
        if (item.content_type !== 3) {
          item.elements.forEach(element => {
            if (element.element_id === event.file_id) {
              if (!event.isUpload) {
                element.image = null;
              } else {
                element.image = event.imageList;
              }
              element.errMsg = event.errMsg;
            }
          });
        }
      });
    }
  }

  // 富文本编辑器数据变更,清空错误信息
  public onEditChange(event: any): void {
    if (event) {
      this.contentList.forEach(item => {
        if (item.content_type === 3) {
          item.elements.forEach(element => {
            if (element.element_id === event.ckEditorId) {
              element.errMsg = '';
            }
          });
        }
      });
    }
  }
  // 点击取消
  public onCancelClick() {
    window.history.back();
  }
}
