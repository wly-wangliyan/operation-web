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
import { ActivatedRoute, Router } from '@angular/router';
import { UpkeepMerchantEntity } from '../business-management.service';

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

  public currentBusiness = new UpkeepMerchantEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public versionList: Array<any>;
  public color = '';
  public mapItem: MapItem = new MapItem();
  public is_add_tel = true;
  public service_telephone = '';
  public brandList = [{b: 1}];

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
              private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.currentBusiness = new UpkeepMerchantEntity();
   /* const regionObj = new RegionEntity(this.currentBusiness.region_id);
    this.proCityDistSelectComponent.regionsObj = regionObj;
    this.proCityDistSelectComponent.initRegions(regionObj);*/
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 获取详情\版本列表
  private rquestPageIconDetail() {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription =
        this.firstPageIconService.requestPageIconDetail(this.menu_id, this.app.application_id).subscribe(res => {
          // this.currentBusiness = res;
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

  // 取消按钮
  public onClose() {
    this.router.navigate(['/main/maintenance/business-management']);
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.title.isError = false;
    this.errPositionItem.jump_link.isError = false;
    this.errPositionItem.corner.isError = false;
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

  /**
   * 打开地图组件
   */
  public openMapModal() {
    this.mapItem.point = [];
    if (this.currentBusiness.address) {
      this.mapItem.hasDetailedAddress = true;
    }
    if (this.currentBusiness.lon && this.currentBusiness.lat) {
      this.mapItem.point.push(Number(this.currentBusiness.lon));
      this.mapItem.point.push(Number(this.currentBusiness.lat));
    }
    this.mapItem.address = this.currentBusiness.address;
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

  // 移除客服联系电话
  public onDelTelClick() {
    this.is_add_tel = true;
    this.service_telephone = '';
  }

  // 移除汽车品牌、厂商
  public onDelBrandClick(data) {

  }
}

