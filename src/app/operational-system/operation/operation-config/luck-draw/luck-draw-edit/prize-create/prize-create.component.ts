import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BannerParams, BannerService } from '../../../../mini-program/banner-management/banner.service';
import { Subscription, timer } from 'rxjs';
import { ZPhotoSelectComponent } from '../../../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../../core/http.service';
import { isUndefined } from 'util';
import { CommodityEntity } from '../../../../../mall/goods-management/goods-management-http.service';
import { ChooseCommodityComponent } from './choose-commodity/choose-commodity.component';

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
  title: ErrMessageItem = new ErrMessageItem();
  jump_link: ErrMessageItem = new ErrMessageItem();
  offline_time: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, jump_link?: ErrMessageItem, offline_time?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(title) || isUndefined(jump_link)
        || isUndefined(offline_time)) {
      return;
    }
    this.icon = icon;
    this.title = title;
    this.jump_link = jump_link;
    this.offline_time = offline_time;
  }
}

const PageSize = 15;

@Component({
  selector: 'app-prize-create',
  templateUrl: './prize-create.component.html',
  styleUrls: ['./prize-create.component.css']
})
export class PrizeCreateComponent implements OnInit {

  public isCreatePrize = true;
  public prizeParams: BannerParams = new BannerParams();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public commodityList: Array<CommodityEntity> = []; // 商品列表
  public noResultText = '数据加载中...';
  public pageIndex = 1; // 页码

  private sureCallback: any;
  private closeCallback: any;
  private requestSubscription: Subscription;
  private banner_id: string;
  private is_save = false; // 防止连续出发保存事件
  private commodity: any;

  @Input() public data: any;
  @Input() public sureName = '保存';
  @ViewChild('prizePromptDiv', { static: false }) public prizePromptDiv: ElementRef;
  @ViewChild(ChooseCommodityComponent, { static: false }) public chooseCommodityComponent: ChooseCommodityComponent;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  private get pageCount(): number {
    if (this.commodityList.length % PageSize === 0) {
      return this.commodityList.length / PageSize;
    }
    return this.commodityList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private bannerService: BannerService) { }

  public ngOnInit() {
  }

  // 弹框close
  public onClose() {
    this.clear();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.prizeParams = new BannerParams();
    $(this.prizePromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(banner_id: string, sureFunc: any, closeFunc: any = null) {
    const openBannerModal = () => {
      timer(0).subscribe(() => {
        $(this.prizePromptDiv.nativeElement).modal('show');
      });
    };
    this.isCreatePrize = banner_id ? false : true;
    this.banner_id = banner_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    // 首页banner与检车banner设置不同图片剪裁比例
    this.clear();
    this.is_save = false;
    if (this.isCreatePrize) {
      this.prizeParams = new BannerParams();
      this.cover_url = [];
    } else {
      this.rquestBannerDetail();
    }
    openBannerModal();
  }

  // 获取详情
  private rquestBannerDetail(): void {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.bannerService.requestBannerDetail(this.banner_id).subscribe(res => {
      this.prizeParams = res;
      this.cover_url = this.prizeParams.image ? this.prizeParams.image.split(',') : [];
      this.prizeParams.belong_to = !res.belong_to ? 0 : res.belong_to;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.clear();
    this.is_save = true;
    // const params = this.prizeParams.clone();
    this.coverImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.prizeParams.image = imageUrl.join(',');
      this.prizeParams.belong_to = this.prizeParams.belong_to === 0 ? null : this.prizeParams.belong_to;
      if (this.verification()) {
        // params.image = this.prizeParams.image;
        if (this.isCreatePrize) {
          // 添加banner
          this.bannerService.requestAddBannerData(this.prizeParams).subscribe(() => {
            this.onClose();
            this.globalService.promptBox.open('添加成功！', () => {
              this.sureCallbackInfo();
            });
          }, err => {
            this.is_save = false;
            this.errorProcess(err);
          });
        } else {
          // 编辑banner
          this.bannerService.requestUpdateBannerData(this.banner_id, this.prizeParams).subscribe(() => {
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

    if (!this.prizeParams.image) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请重新上传图片！';
      cisCheck = false;
    }

    if (!this.prizeParams.jump_link && this.prizeParams.belong_to) {
      this.errPositionItem.jump_link.isError = true;
      this.errPositionItem.jump_link.errMes = '请输入跳转URL！';
      cisCheck = false;
    }
    return cisCheck;
  }

  // 清空
  public clear(): void {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.title.isError = false;
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
          if (content.code === 'invalid' && content.field === 'title') {
            this.errPositionItem.title.isError = true;
            this.errPositionItem.title.errMes = '标题错误或无效！';
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
  public onAddCommodityClick() {
    this.chooseCommodityComponent.open('111', () => {
      timer(0).subscribe(() => {
        this.commodity = this.chooseCommodityComponent.currentCommodity;
        console.log(this.commodity);
        // this.searchText$.next();
      });
    }, () => {
      // this.bannerEdit.clear();
    });
  }
}
