import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ZPhotoSelectComponent } from '../../../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../../core/http.service';
import { isUndefined } from 'util';
import { ChooseCommodityComponent } from './choose-commodity/choose-commodity.component';
import { LuckDrawService, PrizeEntity, PrizeInfoEntity } from '../../luck-draw.service';

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
  prize_name: ErrMessageItem = new ErrMessageItem();
  jump_link: ErrMessageItem = new ErrMessageItem();
  offline_time: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, prize_name?: ErrMessageItem, jump_link?: ErrMessageItem, offline_time?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(prize_name) || isUndefined(jump_link)
        || isUndefined(offline_time)) {
      return;
    }
    this.icon = icon;
    this.prize_name = prize_name;
    this.jump_link = jump_link;
    this.offline_time = offline_time;
  }
}

@Component({
  selector: 'app-prize-create',
  templateUrl: './prize-create.component.html',
  styleUrls: ['./prize-create.component.css']
})
export class PrizeCreateComponent implements OnInit {
  public prizeParams: PrizeEntity = new PrizeEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];

  private sureCallback: any;
  private closeCallback: any;
  private requestSubscription: Subscription;
  private is_save = false; // 防止连续出发保存事件
  private lottery_activity_id: string; // 活动id
  private prizeList: Array<PrizeEntity> = [];

  @Input() public data: any;
  @Input() public sureName = '保存';
  @ViewChild('prizePromptDiv', { static: false }) public prizePromptDiv: ElementRef;
  @ViewChild(ChooseCommodityComponent, { static: false }) public chooseCommodityComponent: ChooseCommodityComponent;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private globalService: GlobalService,
              private luckDrawService: LuckDrawService) { }

  public ngOnInit() {
  }

  // 弹框close
  public onClose() {
    this.clear();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.prizeParams = new PrizeEntity();
    $(this.prizePromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开创建、编辑奖品确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(lottery_activity_id: string, prizeList: Array<PrizeEntity>, index: number, sureFunc: any, closeFunc: any = null) {
    const openPrizeModal = () => {
      timer(0).subscribe(() => {
        $(this.prizePromptDiv.nativeElement).modal('show');
      });
    };
    this.lottery_activity_id = lottery_activity_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.clear();
    this.is_save = false;
    this.prizeList = prizeList;
    if (index < 0) {
      this.prizeParams = new PrizeEntity();
      this.cover_url = [];
    } else {
      this.prizeParams = prizeList[index].clone();
      this.cover_url = prizeList[index].prize_image.split(',');
    }
    openPrizeModal();
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.clear();
    this.is_save = true;
    this.coverImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.prizeParams.prize_image = imageUrl.join(',');
      if (this.verification()) {
        if (!this.prizeParams.prize_id) {
          // 添加奖品
          this.luckDrawService.requestAddPrizeData(this.lottery_activity_id, this.prizeParams).subscribe(() => {
            this.onClose();
            this.globalService.promptBox.open('添加成功！', () => {
              this.sureCallbackInfo();
            });
          }, err => {
            this.is_save = false;
            this.errorProcess(err);
          });
        } else {
          // 编辑奖品
          this.luckDrawService.requestUpdatePrizeData(this.lottery_activity_id, this.prizeParams.prize_id, this.prizeParams)
              .subscribe(() => {
            this.onClose();
            this.globalService.promptBox.open('修改成功！', () => {
              this.sureCallbackInfo();
            });
          }, err => {
            this.is_save = false;
            this.errorProcess(err);
          });
        }
      } else {
        this.is_save = false;
      }
    }, err => {
      this.is_save = false;
      this.upLoadErrMsg(err);
    });
  }

  // 表单提交校验
  private verification(): boolean {
    let cisCheck = true;
    if (!this.prizeParams.prize_image) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请重新上传图片！';
      cisCheck = false;
    }
    return cisCheck;
  }

  // 清空
  public clear(): void {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.prize_name.isError = false;
    this.errPositionItem.jump_link.isError = false;
    this.errPositionItem.offline_time.isError = false;
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

  // 接口错误状态
  private errorProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'invalid' && content.field === 'prize_name') {
            this.errPositionItem.prize_name.isError = true;
            this.errPositionItem.prize_name.errMes = '标题错误或无效！';
            return;
          }
        }
      }
    }
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.errPositionItem.icon.isError = true;
        this.errPositionItem.icon.errMes = '参数错误，可能文件格式错误！';
      } else if (err.status === 413) {
        this.errPositionItem.icon.isError = true;
        this.errPositionItem.icon.errMes = '上传资源文件太大，服务器无法保存！';
      } else {
        this.errPositionItem.icon.isError = true;
        this.errPositionItem.icon.errMes = '上传失败，请重试！';
      }
    }
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any): any {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 选择商品
  public onAddCommodityClick(prize_info: PrizeInfoEntity) {
    this.chooseCommodityComponent.open(prize_info, () => {
      timer(0).subscribe(() => {
        const specification_name = this.chooseCommodityComponent.currentCommodity.specification.specification_name;
        const commodity_name = this.chooseCommodityComponent.currentCommodity.source.commodity_name;
        this.prizeParams.prize_info.commodity_id = this.chooseCommodityComponent.currentCommodity.source.commodity_id;
        this.prizeParams.prize_info.specification_id = this.chooseCommodityComponent.currentCommodity.specification.specification_id;
        this.prizeParams.prize_info.stock = this.chooseCommodityComponent.currentCommodity.specification.stock;
        this.prizeParams.prize_info.unit_sell_price = this.chooseCommodityComponent.currentCommodity.specification.unit_sell_price;
        this.prizeParams.prize_info.name = `${commodity_name}(${specification_name})`;
      });
    });
  }
}
