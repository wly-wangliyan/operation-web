import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { isUndefined } from 'util';
import { InsuranceEntity, InsuranceService, UpdateInsueranceEntity } from '../../insurance.service';
import { ValidateHelper } from '../../../../../utils/validate-helper';

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
  details_link: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, ic_name?: ErrMessageItem,
              details_link?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(ic_name) || isUndefined(details_link)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
    this.details_link = details_link;
  }
}

@Component({
  selector: 'app-insurance-company-edit',
  templateUrl: './insurance-company-edit.component.html',
  styleUrls: ['./insurance-company-edit.component.less']
})
export class InsuranceCompanyEditComponent implements OnInit {
  public isCreateInsurance = true;
  public currentInsurance: InsuranceEntity = new InsuranceEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public tagList = [];
  public tag = '';

  private continueRequestSubscription: Subscription;
  private sureCallback: any;
  private closeCallback: any;
  private insurance_id: string;

  @Input() public sureName: string;

  @ViewChild('pagePromptDiv', { static: true }) public pagePromptDiv: ElementRef;
  @ViewChild('coverImg', {static: false}) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private insuranceService: InsuranceService,
              private globalService: GlobalService) {
  }

  public ngOnInit(): void {
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 弹框close
  public onClose() {
    this.clear();
    this.currentInsurance = new InsuranceEntity();
    $(this.pagePromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(insurance_id: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openPageModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.pagePromptDiv.nativeElement).modal('show');
      });
    };
    this.isCreateInsurance = insurance_id ? false : true;
    this.insurance_id = insurance_id;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.tagList = [];
    this.tag = '';
    if (this.isCreateInsurance) {
      this.currentInsurance = new InsuranceEntity();
      this.cover_url = [];
    } else {
      this.rquestPageIconDetail();
    }
    openPageModal();
  }

  // 获取保险公司详情
  private rquestPageIconDetail() {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription =
        this.insuranceService.requestInsuranceDetail(this.insurance_id).subscribe(res => {
          this.currentInsurance = res;
          this.tagList = res.tag;
          this.cover_url = this.currentInsurance.ic_image ? this.currentInsurance.ic_image.split(',') : [];
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    if (!ValidateHelper.checkUrl(this.currentInsurance.details_link)) {
      this.errPositionItem.details_link.isError = true;
      this.errPositionItem.details_link.errMes = '详情链接格式错误！';
      return;
    }
    this.coverImgSelectComponent.upload().subscribe( () => {
      const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
      const params = new UpdateInsueranceEntity();
      params.ic_image = imageUrl.join(',');
      params.ic_name = this.currentInsurance.ic_name;
      params.describe = this.currentInsurance.describe;
      params.tag = this.tagList.join(',');
      params.details_link = this.currentInsurance.details_link;
      if (this.isCreateInsurance) {
        // 添加项目
        this.insuranceService.requestAddInsurance(params).subscribe(() => {
          this.onClose();
          this.globalService.promptBox.open('添加成功！', () => {
            this.sureCallbackInfo();
          });
        }, err => {
          this.errorProcess(err);

        });
      } else {
        // 编辑项目
        this.insuranceService.requestModifyInsurance(params, this.insurance_id).subscribe(() => {
          this.onClose();
          this.globalService.promptBox.open('修改成功！', () => {
            this.sureCallbackInfo();
          });
        }, err => {
          this.errorProcess(err);
        });
      }
    });
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
    this.errPositionItem.details_link.isError = false;
  }

  // 确定按钮回调
  private sureCallbackInfo() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'already_exits' && content.resource === 'icc') {
            this.errPositionItem.ic_name.isError = true;
            this.errPositionItem.ic_name.errMes = '保险公司名称重复！';
            return;
          }
        }
      }
    }
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event) {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于1M！';
    }
  }

  // 添加标签
  public onAddTagClick() {
    if (!this.tag) {
      return;
    }
    this.tagList.push(this.tag);
    this.tag = '';
  }
}
