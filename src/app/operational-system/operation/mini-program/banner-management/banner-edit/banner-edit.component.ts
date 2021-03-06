import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { ValidateHelper } from '../../../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { BannerService, SearchParams, BannerEntity, BannerParams } from '../banner.service';
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

@Component({
  selector: 'app-banner-edit',
  templateUrl: './banner-edit.component.html',
  styleUrls: ['./banner-edit.component.css']
})
export class BannerEditComponent implements OnInit {

  public isCreateBanner = true;
  public bannerParams: BannerParams = new BannerParams();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public offline_time: any = ''; // 下线时间
  public aspectRatio = 3.83 / 1; // 截取图片比例
  public imgReg = /(jpg|jpeg|png|gif)$/;

  private sureCallback: any;
  private closeCallback: any;
  private requestSubscription: Subscription;
  private banner_id: string;

  private is_save = false; // 防止连续出发保存事件

  @Input() public data: any;
  @Input() public sureName = '保存';
  @ViewChild('bannerPromptDiv', { static: false }) public bannerPromptDiv: ElementRef;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private globalService: GlobalService, private bannerService: BannerService) { }

  public ngOnInit() {
  }

  // 弹框close
  public onClose() {
    this.clear();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.bannerParams = new BannerParams();
    $(this.bannerPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(banner_id: string, banner_type: number, sureFunc: any, closeFunc: any = null) {
    const openBannerModal = () => {
      timer(0).subscribe(() => {
        $(this.bannerPromptDiv.nativeElement).modal('show');
      });
    };
    this.isCreateBanner = banner_id ? false : true;
    this.banner_id = banner_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    // 首页banner与检车banner设置不同图片剪裁比例
    this.aspectRatio = banner_type === 4 ? 3.699 / 1 : banner_type === 1 ? 3.83 / 1 : 1.917 / 1;
    this.clear();
    this.is_save = false;
    this.offline_time = '';
    this.bannerParams = new BannerParams();
    if (this.isCreateBanner) {
      this.bannerParams.banner_type = banner_type;
      // 首页banner与检车banner设置不同落地页类型默认值
      // this.bannerParams.belong_to = banner_type === 2 ? 0 : this.bannerParams.belong_to;
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
      this.bannerParams = res;
      if (res.page_layout === 3) {
        this.aspectRatio = 1.917 / 1;
      }
      this.cover_url = this.bannerParams.image ? this.bannerParams.image.split(',') : [];
      this.bannerParams.belong_to = !res.belong_to ? 0 : res.belong_to;
      if (res.offline_status === 2) {
        this.offline_time = res.offline_time ? new Date(res.offline_time * 1000) : '';
      }
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  public onChangePageLayout(event: any): void {
    // this.cover_url = [];
    this.aspectRatio = (event === 3 ? 1.917 / 1 : 3.699 / 1);
  }

  // 切换下线方式
  public onChangeOfflineStatus(offline_status: number): void {
    this.errPositionItem.offline_time.isError = true;
    this.errPositionItem.offline_time.errMes = '';
    if (offline_status === 1) {
      this.offline_time = '';
    }
    this.bannerParams.offline_status = offline_status;
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.clear();
    this.is_save = true;
    // const params = this.bannerParams.clone();
    this.coverImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.bannerParams.image = imageUrl.join(',');
      if (this.verification()) {
        // params.image = this.bannerParams.image;
        if (this.isCreateBanner) {
          // 添加banner
          this.bannerService.requestAddBannerData(this.bannerParams).subscribe(() => {
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
          this.bannerService.requestUpdateBannerData(this.banner_id, this.bannerParams).subscribe(() => {
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

    if (!this.bannerParams.image) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请重新上传图片！';
      cisCheck = false;
    }

    if (!this.bannerParams.jump_link && this.bannerParams.belong_to) {
      this.errPositionItem.jump_link.isError = true;
      this.errPositionItem.jump_link.errMes = '请输入跳转URL！';
      cisCheck = false;
    }

    if (this.bannerParams.belong_to && this.bannerParams.belong_to === 3) {
      const reg = /^(http|https)?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/;
      if (this.bannerParams.jump_link && !reg.test(this.bannerParams.jump_link)) {
        this.errPositionItem.jump_link.isError = true;
        this.errPositionItem.jump_link.errMes = '请输入正确的视频链接！';
        cisCheck = false;
      }
    }

    if (this.bannerParams.offline_status === 2) {
      if (!this.offline_time) {
        this.errPositionItem.offline_time.isError = true;
        this.errPositionItem.offline_time.errMes = '请选择下线时间！';
        cisCheck = false;
      } else {
        const offlineTimestamp = new Date(this.offline_time).setHours(new Date(this.offline_time).getHours(),
          new Date(this.offline_time).getMinutes(), 0, 0) / 1000;
        const currentTimeStamp = new Date().getTime() / 1000;
        if (offlineTimestamp - currentTimeStamp <= 0) {
          this.errPositionItem.offline_time.isError = true;
          this.errPositionItem.offline_time.errMes = '下线时间应大于当前时间！';
          cisCheck = false;
        } else {
          this.bannerParams.offline_time = offlineTimestamp;
        }
      }
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

  // 下线时间的禁用部分
  public disabledTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) < 0) {
      return true;
    } else {
      return false;
    }
  }

  // 切换落地页
  public onChangeBelongTo(event: any): void {
    if (event.target.value) {
      this.bannerParams.jump_link = null;
      this.errPositionItem.jump_link.isError = false;
      this.bannerParams.belong_to = Number(event.target.value);
    }
  }
}
