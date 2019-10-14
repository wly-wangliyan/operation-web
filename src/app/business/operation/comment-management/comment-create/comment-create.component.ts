import { Component, OnInit, ViewChild } from '@angular/core';
import { CommentService, AddCommentParams } from '../comment-management.service';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';

export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}

export class ErrPositionItem {
  icon: ErrMessageItem = new ErrMessageItem();
  ic_name: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, ic_name?: ErrMessageItem,
    corner?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(ic_name)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
  }
}

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnInit {

  public work_name: any = '检车线'; // 业务线

  public commentParams: AddCommentParams = new AddCommentParams(); // 新增评论内容

  public errPositionItem: ErrPositionItem = new ErrPositionItem(); // 图片上传错误信息

  public avatar_url = []; // 头像图片

  public image_urls = []; // 评论图片集合

  public commentErrMsg = ''; // 错误信息

  public created_time: any = ''; // 评价时间（不大于当前时间）

  @ViewChild('avatarImg', { static: false }) public avatarImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('commentImg', { static: false }) public commentImgSelectComponent: ZPhotoSelectComponent;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private commentService: CommentService) {
    this.route.queryParams.subscribe(queryParams => {
      this.work_name = queryParams.work_name;
      this.commentParams.work_id = queryParams.work_id;
    });
  }

  public ngOnInit() {
  }

  // 选择头像图片时校验图片格式
  public onSelectedPicture(event: any) {
    this.onClearErrMsg();
    if (event === 'type_error') {
      this.commentErrMsg = '格式错误，请重新上传！';
      return;
    } else if (event === 'size_over') {
      this.commentErrMsg = '图片大小不得高于1M！';
      return;
    }
  }

  // 选择晒图时校验图片格式
  public onSelectedImagePicture(event: any) {
    this.onClearErrMsg();
    if (event === 'type_error') {
      this.commentErrMsg = '格式错误，请重新上传！';
      return;
    } else if (event === 'size_over') {
      this.commentErrMsg = '图片大小不得高于2M！';
      return;
    }
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any) {
    if (err.status === 422) {
      this.commentErrMsg = '参数错误，可能文件格式错误！';
    } else if (err.status === 413) {
      this.commentErrMsg = '上传资源文件太大，服务器无法保存！';
    } else {
      this.globalService.httpErrorProcess(err);
    }
  }

  public onCommentTimeChange(date: Date): void {
    this.created_time = date;
  }

  // 评论时间的禁用部分
  public disabledCommentTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else {
      return false;
    }
  }

  // 清除错误信息
  public onClearErrMsg() {
    this.commentErrMsg = '';
  }

  // 校验数据
  private generateAndCheckParamsValid(): boolean {
    if (!this.commentParams.avatar) {
      this.commentErrMsg = '请上传头像！';
      return false;
    } else if (!this.commentParams.image_urls) {
      this.commentErrMsg = '请上传晒图！';
      return false;
    } else if (!this.created_time) {
      this.commentErrMsg = '请选择评论时间！';
      return false;
    } else if (this.created_time) {
      const commentTimestamp = new Date(this.created_time).setHours(new Date(this.created_time).getHours(),
        new Date(this.created_time).getMinutes(), 0, 0) / 1000;
      const currentTimeStamp = new Date().getTime() / 1000;
      if (commentTimestamp - currentTimeStamp > 0) {
        this.commentErrMsg = '评论时间不能大于当前时间！';
        return false;
      } else {
        this.commentParams.created_time = commentTimestamp;
      }
    }
    return true;
  }

  // 保存
  public onEditFormSubmit() {
    this.onClearErrMsg();
    this.avatarImgSelectComponent.upload().subscribe(() => {
      const avatar_urls = this.avatarImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.commentParams.avatar = avatar_urls.join(',');
      this.commentImgSelectComponent.upload().subscribe(() => {
        const image_urls = this.commentImgSelectComponent.imageList.map(i => i.sourceUrl);
        this.commentParams.image_urls = image_urls.join(',');
        if (this.generateAndCheckParamsValid()) {
          this.requestAddComment();
        }
      }, err => {
        this.upLoadErrMsg(err);
      });
    }, err => {
      this.upLoadErrMsg(err);
    });
  }

  private requestAddComment() {
    this.commentService.requestAddCommentData(this.commentParams).subscribe(res => {
      this.globalService.promptBox.open('保存成功！', () => {
        this.onCancelClick();
      });
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        this.globalService.promptBox.open('参数错误或无效！', null, 2000, null, false);
      }
    });
  }

  // 取消
  public onCancelClick() {
    this.router.navigate(['../comment-list'], { relativeTo: this.route });
  }
}
