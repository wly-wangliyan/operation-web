import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommentService, WorkEntity } from '../comment-management.service';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';

@Component({
  selector: 'app-comment-setting',
  templateUrl: './comment-setting.component.html',
  styleUrls: ['./comment-setting.component.css']
})
export class CommentSettingComponent implements OnInit {

  public settingList: Array<WorkEntity> = []; // 评论配置列表

  public noResultText = '数据加载中...';

  public settingParams: WorkEntity = new WorkEntity(); // 新建/编辑 配置参数

  public isCreateSetting = true; // 标记是否是新建配置

  public settingErrMsg = '';

  private work_id: string; // 配置id

  private searchText$ = new Subject<any>();

  constructor(
    private globalService: GlobalService,
    private commentService: CommentService) { }

  public ngOnInit() {
    this.generateSettingList();
  }

  // 初始化获取配置列表
  private generateSettingList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestSettingList();
    });
    this.searchText$.next();
  }

  // 请求配置列表
  private requestSettingList() {
    this.commentService.requestCommentSettingListData().subscribe(res => {
      this.settingList = res;
      this.noResultText = '暂无数据';
    }, err => {
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 清除错误信息
  public onClearErrMsg() {
    this.settingErrMsg = '';
  }

  /** 添加、编辑 */
  public onShowModal(data?: WorkEntity) {
    this.onClearErrMsg();
    if (data) {
      this.isCreateSetting = false;
      this.work_id = data.work_id;
      this.settingParams = new WorkEntity();
      this.settingParams = data.clone();
      $('#editSettingModal').modal();
    } else {
      this.isCreateSetting = true;
      this.settingParams = new WorkEntity();
      $('#editSettingModal').modal();
    }
  }

  // 确定事件
  public onEditFormSubmit() {
    if (this.isCreateSetting) {
      this.requestAddComment();
    } else {
      this.requestUpdateComment();
    }
  }

  // 添加
  private requestAddComment() {
    this.commentService.requestAddSettingData(this.settingParams).subscribe(res => {
      $('#editSettingModal').modal('hide');
      this.globalService.promptBox.open('保存成功！');
      this.searchText$.next();
    }, err => {
      this.errorProcess(err);
    });
  }

  // 编辑
  private requestUpdateComment() {
    this.commentService.requestUpdateSettingData(this.work_id, this.settingParams).subscribe(res => {
      $('#editSettingModal').modal('hide');
      this.globalService.promptBox.open('保存成功！');
      this.searchText$.next();
    }, err => {
      this.errorProcess(err);
    });
  }

  // 接口错误信息处理
  private errorProcess(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.field === 'work_name' && content.code === 'already_exists') {
            this.settingErrMsg = '业务线名称已存在，请重新输入！';
            return;
          } else if (content.field === 'remark' && content.code === 'invalid') {
            this.settingErrMsg = '描述错误，请重新输入！';
            return;
          } else {
            this.settingErrMsg = '参数错误或无效！';
            return;
          }
        }
      }
    }
  }
}
