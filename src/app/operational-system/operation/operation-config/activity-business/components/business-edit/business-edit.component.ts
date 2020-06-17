import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityBusinessService, ActivityEntity, BusinessEntity, BusinessParams } from '../../activity-business.service';
import {
  MapItem,
  MapType,
  ZMapSelectPointComponent
} from '../../../../../../share/components/z-map-select-point/z-map-select-point.component';
import {
  ProCityDistSelectComponent,
  RegionEntity
} from '../../../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { timer } from 'rxjs';
import { isUndefined } from 'util';
import { ValidateHelper } from '../../../../../../../utils/validate-helper';
import { ZPhotoSelectComponent } from '../../../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../../../core/global.service';
import { ActivatedRoute } from '@angular/router';

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
  telephone: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, telephone?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(icon)) {
      return;
    }
    this.icon = icon;
    this.telephone = telephone;
  }
}

@Component({
  selector: 'app-business-edit',
  templateUrl: './business-edit.component.html',
  styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements OnInit {

  public currentBusiness: BusinessEntity = new BusinessEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public imgReg = /(jpg|jpeg|png|gif)$/;
  public tagList = [];
  public tag: string;
  public telephone_1: string; // 商家电话
  public telephone_2: string; // 商家电话
  public regionsObj: RegionEntity = new RegionEntity(); // 基本信息-门店地址

  public mapObj: MapItem = {
    point: [],
    type: MapType.edit,
    address: '',
    hasDetailedAddress: false,
    cityCode: ''
  };

  private sureCallback: any;
  private closeCallback: any;
  private movement_id: string;
  private saving: boolean;  // 是否保存中

  @ViewChild('businessImg', {static: true}) public businessImgComponent: ZPhotoSelectComponent;
  @ViewChild(ZMapSelectPointComponent, {static: true}) public zMapSelectPointComponent: ZMapSelectPointComponent;
  @ViewChild('projectInfoPro', { static: true }) public proCityDistSelectComponent: ProCityDistSelectComponent = new ProCityDistSelectComponent();

  constructor(private globalService: GlobalService,
              private businessService: ActivityBusinessService,
              private route: ActivatedRoute) {
    this.route.paramMap.subscribe(map => {
      this.movement_id = map.get('movement_id');
    });
  }

  ngOnInit() {
  }

  // 打开弹窗
  public open(data: BusinessEntity, sureFunc: any, closeFunc: any = null) {
    const openBoothModal = () => {
      timer(0).subscribe(() => {
        $('#activityBusinessPromptDiv').modal('show');
      });
    };
    this.currentBusiness = data ? data.clone() : new BusinessEntity();
    this.initForm();
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    openBoothModal();
  }

  private initForm() {
    this.regionsObj = new RegionEntity(this.currentBusiness);
    this.tag = '';
    this.tagList = this.currentBusiness.tags ? this.currentBusiness.tags.split(',') : [];
    const tel = this.currentBusiness.telephone ? this.currentBusiness.telephone.split(',') : [];
    this.telephone_1 = tel[0] ? tel[0] : '';
    this.telephone_2 = tel[1] ? tel[1] : '';
    this.cover_url = this.currentBusiness.images ? this.currentBusiness.images.split(',') : [];
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.telephone.isError = false;
    this.saving = false;
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

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditActivitySubmit();
      return false;
    }
  }

  // 校验电话号
  public onTelChange(event: any) {
    this.errPositionItem.telephone.isError = false;
    const tel = event.target.value;
    if (!ValidateHelper.Phone(tel) && !ValidateHelper.Telephone(tel)) {
      this.errPositionItem.telephone.isError = true;
      this.errPositionItem.telephone.errMes = '商家电话格式错误！';
    }
  }

  // 数据提交
  public onEditActivitySubmit() {
    if (this.saving) {
      return;
    }
    this.businessImgComponent.upload().subscribe(() => {
      this.currentBusiness.images = this.businessImgComponent.imageList.map(i => i.sourceUrl).join(',');
      this.currentBusiness.telephone = this.telephone_1 && this.telephone_2 ? this.telephone_1 + ',' + this.telephone_2 :
          this.telephone_1 ? this.telephone_1 : this.telephone_2 ? this.telephone_2 : '';
      this.currentBusiness.tags = this.tagList.join(',');
      if (!this.errPositionItem.telephone.isError) {
        this.saving = true;
        const saveParams = new BusinessParams(this.currentBusiness);
        if (!this.currentBusiness.movement_shop_id) {
          saveParams.movement_id = this.movement_id;
          this.businessService.requestAddBusiness(saveParams).subscribe(() => {
            this.globalService.promptBox.open('保存成功!');
            this.sureCallback();
            $('#activityBusinessPromptDiv').modal('hide');
          }, err => {
            this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
            this.globalService.httpErrorProcess(err);
            this.saving = false;
          });
        } else {
          this.businessService.requestUpdateBusiness(this.currentBusiness.movement_shop_id, saveParams).subscribe(() => {
            this.globalService.promptBox.open('保存成功!');
            this.sureCallback();
            $('#activityBusinessPromptDiv').modal('hide');
          }, err => {
            this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
            this.globalService.httpErrorProcess(err);
            this.saving = false;
          });
        }
      }
    }, err => {
      this.saving = false;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 打开地图组件
  public openMapModal() {
    this.mapObj.point = [];
    this.currentBusiness.address = this.currentBusiness.address ? this.currentBusiness.address : '';
    if (this.currentBusiness.address) {
      this.mapObj.hasDetailedAddress = true;
    }
    if (this.currentBusiness.lon && this.currentBusiness.lat) {
      this.mapObj.point.push(Number(this.currentBusiness.lon));
      this.mapObj.point.push(Number(this.currentBusiness.lat));
    }
    this.mapObj.address = this.proCityDistSelectComponent.selectedAddress + this.currentBusiness.address;
    // this.mapObj.cityCode = this.proCityDistSelectComponent.selectedRegionId;
    this.zMapSelectPointComponent.openMap();
  }

  // 暂存坐标点信息
  public selectedMarkerInfo(event: any) {
    this.currentBusiness.lon = event.selectedMarker.point.lng;
    this.currentBusiness.lat = event.selectedMarker.point.lat;
    this.currentBusiness.province = event.selectedMarker.regeocode.addressComponent.province;
    this.currentBusiness.city = event.selectedMarker.regeocode.addressComponent.city;
    this.currentBusiness.district = event.selectedMarker.regeocode.addressComponent.district;
    this.currentBusiness.region_id = event.selectedMarker.regeocode.addressComponent.adcode;
    this.currentBusiness.address = event.selectedMarker.regeocode.formattedAddress.replace(this.currentBusiness.province, '').replace(this.currentBusiness.city, '').replace(this.currentBusiness.district, '');
    this.regionsObj = new RegionEntity(this.currentBusiness);
  }
}
