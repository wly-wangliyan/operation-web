import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ProCityDistSelectComponent, RegionEntity } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { FirstPageIconService } from '../../../mx-parking/first-page-icon/first-page-icon.service';
import { GlobalService } from '../../../../core/global.service';
import { ValidateHelper } from '../../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../../core/http.service';
import { MapItem, ZMapSelectPointComponent } from '../../../../share/components/z-map-select-point/z-map-select-point.component';

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
  corner: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, jump_link?: ErrMessageItem,
              corner?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(title) || isUndefined(jump_link)
        || isUndefined(corner)) {
      return;
    }
    this.icon = icon;
    this.title = title;
    this.jump_link = jump_link;
    this.corner = corner;
  }
}

@Component({
  selector: 'app-business-edit',
  templateUrl: './business-edit.component.html',
  styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements OnInit {

  public currentPage = {};
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public versionList: Array<any>;
  public color = '';
  public mapItem: MapItem = new MapItem();
  public is_add_tel = true;

  private continueRequestSubscription: Subscription;
  private sureCallback: any;
  private closeCallback: any;
  private menu_id: string;
  private app: any;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('pagePromptDiv', { static: true }) public pagePromptDiv: ElementRef;
  @ViewChild('coverImg', {static: true}) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('projectInfoPro', { static: true }) public proCityDistSelectComponent: ProCityDistSelectComponent;
  @ViewChild(ZMapSelectPointComponent, { static: true }) public zMapSelectPointComponent: ZMapSelectPointComponent;

  constructor(private firstPageIconService: FirstPageIconService,
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
    this.currentPage = {};
    $(this.pagePromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(menu_id: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openPageModal = (data?: any) => {
      timer(0).subscribe(() => {
        this.proCityDistSelectComponent.regionsObj = new RegionEntity();
        this.proCityDistSelectComponent.initRegions();
        $(this.pagePromptDiv.nativeElement).modal('show');
      });
    };
    this.menu_id = menu_id;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    // this.rquestPageIconDetail();
    openPageModal();
  }

  // 获取详情\版本列表
  private rquestPageIconDetail() {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription =
        this.firstPageIconService.requestPageIconDetail(this.menu_id, this.app.application_id).subscribe(res => {
          this.currentPage = res;
          // this.cover_url = this.currentPage.icon ? this.currentPage.icon.split(',') : [];
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    this.continueRequestSubscription = this.firstPageIconService.requestVersionList(this.app.application_id)
        .subscribe(res => {
          this.versionList = res;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // 获取版本列表
  private rquestVersionList() {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription = this.firstPageIconService.requestVersionList(this.app.application_id)
        .subscribe(res => {
          this.versionList = res;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    if (this.verification()) {
      this.coverImgSelectComponent.upload().subscribe( () => {
        const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
        // this.currentPage.icon = imageUrl.join(',');
        // 编辑项目
       /* this.firstPageIconService.requestModifyPageIcon(this.currentPage, this.app.application_id, this.menu_id).subscribe(() => {
          this.onClose();
          this.globalService.promptBox.open('修改成功！', () => {
            this.sureCallbackInfo();
          });
        }, err => {
          this.errorProcess(err);
        });*/
      });
    }
  }

  // 表单提交校验
  private verification() {
    let cisCheck = true;
    return cisCheck;
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.title.isError = false;
    this.errPositionItem.jump_link.isError = false;
    this.errPositionItem.corner.isError = false;
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
          if (content.code === 'invalid' && content.field === 'title') {
            this.errPositionItem.title.isError = true;
            this.errPositionItem.title.errMes = '标题错误或无效！';
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
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  /**
   * 打开地图组件
   */
  public openMapModal() {
    this.mapItem.point = [];
    /*if (this.parkingCredentialInfo.address) {
      this.mapItem.hasDetailedAddress = true;
    }*/
   /* if (this.parkingCredentialInfo.lon && this.parkingCredentialInfo.lat) {
      this.mapItem.point.push(Number(this.parkingCredentialInfo.lon));
      this.mapItem.point.push(Number(this.parkingCredentialInfo.lat));
    }
    this.mapItem.address = this.parkingCredentialInfo.address;*/
    this.zMapSelectPointComponent.openMap();
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /[\d]/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 添加客服联系电话
  public onAddTelClick() {
    this.is_add_tel = false;
  }
}

