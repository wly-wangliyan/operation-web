import { Component, ViewChild } from '@angular/core';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../core/global.service';
import { UpkeepOrderService, ArrivalOrderEntity } from '../upkeep-order.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-examine-goods-modal',
  templateUrl: './examine-goods-modal.component.html',
  styleUrls: ['./examine-goods-modal.component.css']
})
export class ExamineGoodsModalComponent {
  private orderRecord: ArrivalOrderEntity = new ArrivalOrderEntity(); // 到店保养订单
  public image_urls = []; // 验货图片
  public imageMaxLength = 2; // 最多可添加N+2张
  public checkMsg = ''; // 验货错误提示
  public imgReg = /(jpg|jpeg|png|gif)$/;
  private sureCallback: any;
  private closeCallback: any;
  private isSaving = false;
  @ViewChild('checkImg', { static: false }) public checkImgSelectComponent: ZPhotoSelectComponent;
  constructor(
    private globalService: GlobalService,
    private orderService: UpkeepOrderService) { }

  public open(data: ArrivalOrderEntity, sureFunc: any, closeFunc: any = null) {
    const openBoothModal = () => {
      timer(0).subscribe(() => {
        $('#checkModal').modal();
      });
    };
    this.isSaving = false;
    if (data) {
      this.orderRecord = data.clone();
      this.image_urls = [];
      this.imageMaxLength = 2;
      this.orderRecord.accessory_info.forEach(info => {
        info.supply_type === 1 && (this.imageMaxLength = this.imageMaxLength + 1);
      });
      console.log(this.imageMaxLength);
      this.sureCallback = sureFunc;
      this.closeCallback = closeFunc;
      openBoothModal();
    }
  }

  // 选择图片
  public onSelectedPicture(event: any) {
    this.checkMsg = '';
    if (event === 'type_error') {
      this.checkMsg = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.checkMsg = '图片大小不得高于2M！';
    }
  }

  // 保存
  public onCheckStatusClick() {
    this.checkMsg = '';
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    this.checkImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.checkImgSelectComponent.imageList.map(i => i.sourceUrl);

      this.orderService.requestChangeStatusToCheck(this.orderRecord.arrival_order_id, imageUrl.join(',')).subscribe(res => {
        this.isSaving = false;
        $('#checkModal').modal('hide');
        this.sureCallbackInfo();
        this.globalService.promptBox.open('验货完成');
      }, err => {
        this.isSaving = false;
        this.globalService.httpErrorProcess(err);
      });
    }, err => {
      this.isSaving = false;
      this.upLoadErrMsg(err);
    });
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

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.checkMsg = '参数错误，可能文件格式错误！';
      } else if (err.status === 413) {
        this.checkMsg = '上传资源文件太大，服务器无法保存！';
      } else {
        this.checkMsg = '上传失败，请重试！';
      }
    }
  }
}
