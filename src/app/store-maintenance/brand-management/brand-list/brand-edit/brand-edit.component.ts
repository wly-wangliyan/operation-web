import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { HttpErrorEntity } from '../../../../core/http.service';
import {
  AccessoryBrandEntity,
  BrandManagementHttpService,
  SearchBrandParams
} from '../../brand-management-http.service';

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
  tags: ErrMessageItem = new ErrMessageItem();
  constructor(icon?: ErrMessageItem, tags?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(tags)) {
      return;
    }
    this.icon = icon;
    this.tags = tags;
  }
}

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.css']
})
export class BrandEditComponent implements OnInit {
  constructor(
    private globalService: GlobalService,
    private brandManagementService: BrandManagementHttpService
  ) { }

  public searchBrandParams: SearchBrandParams = new SearchBrandParams();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public aspectRatio = 1 / 1; // 截取图片比例
  public tag = '';
  public tagList = []; // 品牌标签

  private sureCallback: any;
  private closeCallback: any;
  private requestSubscription: Subscription;
  private banner_id: string;

  private is_save = false; // 防止连续出发保存事件

  @Input() public accessory_brand_id: string;
  @ViewChild('bannerPromptDiv', { static: false })
  public bannerPromptDiv: ElementRef;
  @ViewChild('coverImg', { static: false })
  public coverImgSelectComponent: ZPhotoSelectComponent;

  public ngOnInit() { }

  // 弹框close
  public onClose() {
    this.clear();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.searchBrandParams = new SearchBrandParams();
    $(this.bannerPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(
    data: AccessoryBrandEntity,
    sureFunc: any,
    closeFunc: any = null
  ) {
    const openBannerModal = () => {
      timer(0).subscribe(() => {
        $(this.bannerPromptDiv.nativeElement).modal('show');
      });
    };
    this.accessory_brand_id = data ? data.accessory_brand_id : '';
    this.searchBrandParams = data
      ? JSON.parse(JSON.stringify(data))
      : new SearchBrandParams();
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.clear();
    this.cover_url = [];
    if (data && data.sign_image) {
      this.cover_url.push(data.sign_image);
    }
    this.is_save = false;
    openBannerModal();
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.clear();
    this.is_save = true;
    this.coverImgSelectComponent.upload().subscribe(
      () => {
        const imageUrl = this.coverImgSelectComponent.imageList.map(
          i => i.sourceUrl
        );
        this.searchBrandParams.sign_image = imageUrl.join(',');
        if (this.verification()) {
          if (!this.accessory_brand_id) {
            // 添加配件品牌
            this.brandManagementService
              .requestAddAccessoryData(this.searchBrandParams)
              .subscribe(
                () => {
                  this.onClose();
                  this.globalService.promptBox.open('新建成功！', () => {
                    this.sureCallbackInfo();
                  });
                },
                err => {
                  this.is_save = false;
                  this.errorProcess(err, 1);
                }
              );
          } else {
            // 编辑配件品牌
            this.brandManagementService
              .requestUpdateAccessoryData(
                this.accessory_brand_id,
                this.searchBrandParams
              )
              .subscribe(
                () => {
                  this.onClose();
                  this.globalService.promptBox.open('编辑成功！', () => {
                    this.sureCallbackInfo();
                  });
                },
                err => {
                  this.is_save = false;
                  this.errorProcess(err, 2);
                }
              );
          }
        } else {
          this.is_save = false;
        }
      },
      err => {
        this.is_save = false;
        this.upLoadErrMsg(err);
      }
    );
  }

  // 表单提交校验
  private verification(): boolean {
    let cisCheck = true;

    if (!this.searchBrandParams.sign_image) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请重新上传图片！';
      cisCheck = false;
    }
    return cisCheck;
  }

  // 清空
  public clear(): void {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.tags.isError = false;
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
  private errorProcess(err: any, type: number) {
    const text = type === 1 ? '新建' : '编辑';
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field =
            content.field === 'brand_name'
              ? '品牌名称'
              : content.field === 'sign_image'
                ? '品牌标志'
                : content.field === 'introduce'
                  ? '简介'
                  : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(
              `${field}字段未填写!`,
              null,
              2000,
              '/assets/images/warning.png'
            );
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(
              `${field}字段输入错误!`,
              null,
              2000,
              '/assets/images/warning.png'
            );
          } else if (content.code === 'already_existed') {
            this.globalService.promptBox.open(
              `配件品牌已经存在!`,
              null,
              2000,
              '/assets/images/warning.png'
            );
          } else {
            this.globalService.promptBox.open(
              `${text}配件品牌失败,请重试!`,
              null,
              2000,
              '/assets/images/warning.png'
            );
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
  public onSelectedPicture(event: any) {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 添加标签
  public onAddTagClick(): void {
    this.errPositionItem.tags.isError = false;
    if (this.tag === '' || this.tag === null) {
      return;
    } else if (this.tagList.some(i => i === this.tag)) {
      this.errPositionItem.tags.isError = true;
      this.errPositionItem.tags.errMes = '添加的标签重复,请重新输入';
      return;
    } else {
      this.tagList.push(this.tag);
      this.tag = '';
    }
  }

  // 删除标签
  public onDeleteTag(index: number): void {
    this.errPositionItem.tags.isError = false;
    this.tagList.splice(index, 1);
  }
}
