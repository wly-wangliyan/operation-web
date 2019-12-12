import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MapItem, ZMapSelectPointComponent } from '../../../../share/components/z-map-select-point/z-map-select-point.component';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ProCityDistSelectComponent, RegionEntity } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { SelectBrandFirmComponent } from '../../../../share/components/select-brand-firm/select-brand-firm.component';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorEntity } from '../../../../core/http.service';
import { isUndefined } from 'util';
import { BusinessEntity, BusinessManagementService } from '../business-management.service';

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
  selector: 'app-business-edit',
  templateUrl: './business-edit.component.html',
  styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements OnInit {

  public currentBusiness = new BusinessEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public mapItem: MapItem = new MapItem();
  public company_name: string;
  public postage_status = false;

  private business_id: string;

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
    this.activatedRoute.paramMap.subscribe(map => {
      this.business_id = map.get('business_id');
    });
  }

  public ngOnInit(): void {
    this.businessManagementService.requestBusinessDetail(this.business_id)
        .subscribe(res => {
          this.currentBusiness = res;
          this.currentBusiness.images = res.images.length > 0 ? res.images : ['/assets/images/image_space.png'];
          this.company_name = res.company.company_name;
          this.postage_status = res.postage_status === 1 ? true : false;
          const regionObj = new RegionEntity(this.currentBusiness);
          this.proCityDistSelectComponent.regionsObj = regionObj;
          this.proCityDistSelectComponent.initRegions(regionObj);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
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
    this.currentBusiness.postage_status = this.postage_status ? 1 : 2;
    const params = {postage_status: this.currentBusiness.postage_status};
    this.businessManagementService.requestPostageStatus(this.business_id, params).subscribe(() => {
      this.onClose();
      this.globalService.promptBox.open('保存成功！', () => {
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 取消按钮
  public onClose() {
    this.router.navigate(['/main/mall/goods-business/list']);
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
}
