import { Component, OnInit } from '@angular/core';
import { BoothService, BoothContentEntity } from '../booth.service';
import { GlobalService } from '../../../../../core/global.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-booth-content-edit',
  templateUrl: './booth-content-edit.component.html',
  styleUrls: ['./booth-content-edit.component.css']
})
export class BoothContentEditComponent implements OnInit {

  public boothParams: BoothContentEntity = new BoothContentEntity(); // 展位数据
  public isCreate = true; // 标记新建\编辑

  private sureCallback: any;
  private closeCallback: any;
  constructor(
    private globalService: GlobalService,
    private boothService: BoothService) { }

  public ngOnInit() {
  }

  public open(data: BoothContentEntity, sureFunc: any, closeFunc: any = null) {
    const openBoothModal = () => {
      timer(0).subscribe(() => {
        $('#boothContentModal').modal();
      });
    };
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    openBoothModal();
  }

  // 弹框close
  public onClose() {
    this.boothParams = new BoothContentEntity();
    $('#boothContentModal').modal('hide');
  }

  //
  public onCheckClick() {

  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }
}
