import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  BusinessManagementService,
  UpkeepMerchantEntity
} from '../../../operational-system/maintenance/business-management/business-management.service';
import { MapItem, ZMapSelectPointComponent } from '../../../share/components/z-map-select-point/z-map-select-point.component';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { ProCityDistSelectComponent, RegionEntity } from '../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { SelectBrandFirmComponent } from '../../../share/components/select-brand-firm/select-brand-firm.component';
import { GlobalService } from '../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateHelper } from '../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../core/http.service';
import { isUndefined } from 'util';

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
  service_telephone: ErrMessageItem = new ErrMessageItem();
  booking: ErrMessageItem = new ErrMessageItem();

  constructor(service_telephone?: ErrMessageItem, booking?: ErrMessageItem, jump_link?: ErrMessageItem,
              corner?: ErrMessageItem) {
    if (isUndefined(service_telephone) || isUndefined(booking)) {
      return;
    }
    this.service_telephone = service_telephone;
    this.booking = booking;
  }
}

@Component({
  selector: 'app-garage-edit',
  templateUrl: './garage-edit.component.html',
  styleUrls: ['./garage-edit.component.css']
})
export class GarageEditComponent implements OnInit {

  public currentBusiness = new UpkeepMerchantEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public mapItem: MapItem = new MapItem();
  public is_add_tel = true;
  public service_telephones = [];
  public company_name: string;
  public time = null;

  private upkeep_merchant_id: string;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('pagePromptDiv', {static: true}) public pagePromptDiv: ElementRef;
  @ViewChild('coverImg', {static: true}) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('projectInfoPro', {static: true}) public proCityDistSelectComponent: ProCityDistSelectComponent;
  @ViewChild(ZMapSelectPointComponent, {static: true}) public zMapSelectPointComponent: ZMapSelectPointComponent;
  @ViewChild(SelectBrandFirmComponent, {static: true}) public selectBrandFirmComponent: SelectBrandFirmComponent;

  constructor(private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private businessManagementService: BusinessManagementService,
              private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.upkeep_merchant_id = queryParams.upkeep_merchant_id;
    });
  }

  public ngOnInit(): void {
    this.service_telephones.push({tel: '', time: new Date().getTime()});
    /*this.continueRequestSubscription = this.businessManagementService.requestUpkeepMerchantDetail(this.upkeep_merchant_id)
        .subscribe(res => {
          this.currentBusiness = res;
          this.currentBusiness.image_url = res.image_url.length > 0 ? res.image_url : ['/assets/images/image_space.png'];
          const telList = res.service_telephone ? res.service_telephone.split(',') : [''];
          telList.forEach(value => {
            this.service_telephones.push({tel: value, time: new Date().getTime()});
          });
          this.is_add_tel = this.service_telephones.length >= 2 ? false : true;
          this.company_name = res.UpkeepCompany.company_name;
          const regionObj = new RegionEntity(this.currentBusiness);
          this.proCityDistSelectComponent.regionsObj = regionObj;
          this.proCityDistSelectComponent.initRegions(regionObj);
          this.currentBusiness.VehicleFirm.forEach(value => {
            this.brand_ids.push(value.vehicle_brand.vehicle_brand_id);
            this.firm_ids.push(value.vehicle_firm_id);
          });
        }, err => {
          this.globalService.httpErrorProcess(err);
        });*/
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    if (this.verification()) {
      // 编辑商家
      const firms = [];
      this.currentBusiness.VehicleFirm.forEach(value => {
        firms.push(value.vehicle_firm_id);
      });
      const telList = this.service_telephones.map(value => value.tel);
      const params = {
        vehicle_firm_ids: firms.join(','),
        booking: this.currentBusiness.booking,
        service_telephone: telList.join(',')
      };
      this.businessManagementService.requestUpdateUpkeepMerchant(this.upkeep_merchant_id, params).subscribe(() => {
        this.onClose();
        this.globalService.promptBox.open('保存成功！', () => {
        });
      }, err => {
        this.errorProcess(err);
      });
    }
  }

  // 表单提交校验
  private verification() {
    let isCheck = true;
    if (this.currentBusiness.booking <= 0 || this.currentBusiness.booking > 60) {
      this.errPositionItem.booking.isError = true;
      this.errPositionItem.booking.errMes = '可提前预定天数范围为1到60！';
      isCheck = false;
    }
    this.service_telephones.forEach(value => {
      if (!ValidateHelper.Phone(value.tel)) {
        this.errPositionItem.service_telephone.isError = true;
        this.errPositionItem.service_telephone.errMes = '客服电话格式错误！';
        isCheck = false;
      }
    });
    return isCheck;
  }

  // 取消按钮
  public onClose() {
    this.router.navigate(['/main/maintenance/business-management']);
  }

  // 清空
  public clear() {
    this.errPositionItem.service_telephone.isError = false;
    this.errPositionItem.booking.isError = false;
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'invalid' && content.field === 'title') {
            // this.errPositionItem.title.isError = true;
            // this.errPositionItem.title.errMes = '标题错误或无效！';
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
    const reg = /\d/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 添加客服联系电话
  public onAddTelClick() {
    this.is_add_tel = false;
    this.service_telephones.push({tel: '', time: new Date().getTime()});
  }

  // 移除客服联系电话
  public onDelTelClick(index) {
    if (this.service_telephones.length === 1) {
      this.service_telephones = [];
    } else {
      this.is_add_tel = true;
      this.service_telephones.splice(index, 1);
    }
  }
}
