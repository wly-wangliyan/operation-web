import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { ClassifyManagementHttpService } from '../../classify-management-http.service';
import { HttpErrorEntity } from '../../../../../core/http.service';

@Component({
  selector: 'app-classify-edit',
  templateUrl: './classify-edit.component.html',
  styleUrls: ['./classify-edit.component.css']
})

export class ClassifyEditComponent implements OnInit {
  private sureCallback: any;
  private subscription: Subscription;

  @Input() public sort_id: string;
  @Input() public sort_name: string;

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService, private classifyHttpService: ClassifyManagementHttpService) {

  }

  ngOnInit() {
  }

  // 保存数据
  public onSaveClassifyName() {
    // 新建
    if (!this.sort_id) {
      this.classifyHttpService.requestAddClassifyName(this.sort_name).subscribe(() => {
        this.getSuccessInfo();
      }, err => {
        this.getErrorInfo(err);
      });
    } else {
      // 编辑
      this.classifyHttpService.requestUpdateClassifyName(this.sort_id, this.sort_name).subscribe(() => {
        this.getSuccessInfo();
      }, err => {
        this.getErrorInfo(err);
      });
    }
  }

  // 接口成功的回调
  private getSuccessInfo() {
    this.globalService.promptBox.open('分类名称保存成功！');
    if (this.sureCallback) {
      const temp = this.sureCallback;
      temp();
    }
    this.onCloseClassify();
  }

  // 捕获错误信息
  private getErrorInfo(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          // tslint:disable-next-line:max-line-length
          const field = content.field === 'sort_name' ? '分类名称' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}输入错误!`, null, 2000, '/assets/images/warning.png');
          } else if (content.code === 'already_exist') {
            this.globalService.promptBox.open('该分类名称已存在，请重新输入!', null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('分类名称保存失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public onCloseClassify() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sureCallback) {
      this.sureCallback = null;
    }
    this.sort_name = '';
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sort_id 标签id
   * @param sort_name 标签名称
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(sort_id = '', sort_name = '', sureFunc: any) {
    this.sort_id = sort_id;
    this.sort_name = sort_name;
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      return false;
    }
  }
}


