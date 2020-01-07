import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../../core/global.service';
import { NotifyEntity, NoticeService } from '../../notice.service';
import { HttpErrorEntity } from '../../../../../../core/http.service';

@Component({
  selector: 'app-notice-edit',
  templateUrl: './notice-edit.component.html',
  styleUrls: ['./notice-edit.component.css']
})

export class NoticeEditComponent implements OnInit {
  public noticeData = new NotifyEntity();
  private sureCallback: any;
  private subscription: Subscription;

  @Input() public notice_id: string;
  @Input() public type: number;

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService, private noticeService: NoticeService) {

  }

  ngOnInit() {
  }

  // 保存数据
  public onSaveNoticeTitle() {
    // 新建
    if (!this.notice_id) {
      this.noticeService.requestAddNoticeTitle(this.noticeData.title, this.type, this.noticeData.display_place).subscribe(() => {
        this.getSuccessInfo();
      }, err => {
        this.getErrorInfo(err);
      });
    } else {
      // 编辑
      this.noticeService.requestUpdateNoticeTitle(this.noticeData.notify_id, this.noticeData.title,
        this.noticeData.display_place).subscribe(() => {
          this.getSuccessInfo();
        }, err => {
          this.getErrorInfo(err);
        });
    }
  }

  // 接口成功的回调
  private getSuccessInfo() {
    this.globalService.promptBox.open('通知内容保存成功！');
    if (this.sureCallback) {
      const temp = this.sureCallback;
      temp();
    }
    this.onCloseNoticeModal();
  }

  // 捕获错误信息
  private getErrorInfo(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          // tslint:disable-next-line:max-line-length
          const field = content.field === 'title' ? '通知内容' : content.field === 'display_place' ? '显示位置' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}输入错误!`, null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('通知内容保存失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public onCloseNoticeModal() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sureCallback) {
      this.sureCallback = null;
    }
    this.noticeData = new NotifyEntity();
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param noticeData NotifyEntity 通知对象
   * @param type 类型
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(data: NotifyEntity, type: number, sureFunc: any) {
    this.noticeData = Object.assign(data);
    this.type = type;
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      $(this.promptDiv.nativeElement).modal('show');
    });
  }
}

