import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { GarageManagementService, RepairShopEntity, EditRepairShopParams } from '../garage-management.service';
import { DateFormatHelper, TimeItem } from '../../../../utils/date-format-helper';
import { PromptLoadingComponent } from '../../../share/components/prompt-loading/prompt-loading.component';

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
export class GarageEditComponent implements OnInit, AfterViewInit {

  public currentGarage = new RepairShopEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public editParams: EditRepairShopParams = new EditRepairShopParams();
  public mapItem: MapItem = new MapItem();
  public is_add_tel = true;
  public service_telephones = [];
  public company_name: string;
  public time = null;
  public doorTimes = { begin_time: null, end_time: null }; // 上门保养时间

  public door_start_time: TimeItem = new TimeItem();
  public door_end_time: TimeItem = new TimeItem();

  private repair_shop_id: string;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('pagePromptDiv', { static: true }) public pagePromptDiv: ElementRef;
  @ViewChild('coverImg', { static: true }) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('projectInfoPro', { static: true }) public proCityDistSelectComponent: ProCityDistSelectComponent;
  @ViewChild(ZMapSelectPointComponent, { static: true }) public zMapSelectPointComponent: ZMapSelectPointComponent;
  @ViewChild(SelectBrandFirmComponent, { static: true }) public selectBrandFirmComponent: SelectBrandFirmComponent;
  @ViewChild(PromptLoadingComponent, { static: true }) public promptLoading: PromptLoadingComponent;

  constructor(
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private garageService: GarageManagementService,
    private router: Router) {
    this.activatedRoute.paramMap.subscribe(map => {
      this.repair_shop_id = map.get('repair_shop_id');
    });
  }

  public ngOnInit(): void {
    this.garageService.requestRepairShopsDetail(this.repair_shop_id)
      .subscribe(res => {
        this.currentGarage = res;
        this.currentGarage.images = res.images.length > 0 ? res.images : ['/assets/images/image_space.png'];
        this.door_start_time = res.door_run_start_time ? DateFormatHelper.getMinuteOrTime(res.door_run_start_time)
          : new TimeItem();
        this.door_end_time = res.door_run_end_time ? DateFormatHelper.getMinuteOrTime(res.door_run_end_time)
          : new TimeItem();

        this.editParams.door_run_start_time = res.door_run_start_time;
        this.editParams.door_run_end_time = res.door_run_end_time;
        this.editParams.service_telephone = res.service_telephone || '';
        this.editParams.battery_telephone = res.battery_telephone || '';
        this.company_name = res.repair_company ? res.repair_company.repair_company_name : '';
        const regionObj = new RegionEntity(this.currentGarage);
        this.proCityDistSelectComponent.regionsObj = regionObj;
        this.proCityDistSelectComponent.initRegions(regionObj);
        this.promptLoading.close();
      }, err => {
        this.promptLoading.close();
        this.globalService.httpErrorProcess(err);
      });
  }

  public ngAfterViewInit() {
    this.promptLoading.open(null, true);
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
      this.garageService.requestEditRepairShops(this.repair_shop_id, this.editParams).subscribe(() => {
        this.onClose();
        this.globalService.promptBox.open('保存成功！', () => {
        });
      }, err => {
        this.errorProcess(err);
      });
    }
  }

  // 表单提交校验
  private verification(): boolean {
    const door_start_time = DateFormatHelper.getSecondTimeSum(this.door_start_time);
    const door_end_time = DateFormatHelper.getSecondTimeSum(this.door_end_time);

    if (door_start_time >= door_end_time) {
      this.globalService.promptBox.open('上门保养服务的开始时间需小于结束时间！', null, 2000, null, false);
      return false;
    }
    this.editParams.door_run_start_time = door_start_time;
    this.editParams.door_run_end_time = door_end_time;
    if (!ValidateHelper.Phone(this.editParams.service_telephone)) {
      this.globalService.promptBox.open('客服电话-搭电换胎通知手机号格式错误！', null, 2000, null, false);
      return false;
    }
    if (!ValidateHelper.Phone(this.editParams.battery_telephone)) {
      this.globalService.promptBox.open('客服电话-换电瓶通知手机号格式错误！', null, 2000, null, false);
      return false;
    }
    return true;
  }

  // 取消按钮
  public onClose() {
    this.router.navigate(['/store-maintenance/garage-management/list']);
  }

  // 清空
  public clear() {
    this.errPositionItem.service_telephone.isError = false;
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
    if (this.currentGarage.address) {
      this.mapItem.hasDetailedAddress = true;
    }
    if (this.currentGarage.lon && this.currentGarage.lat) {
      this.mapItem.point.push(Number(this.currentGarage.lon));
      this.mapItem.point.push(Number(this.currentGarage.lat));
    }
    this.mapItem.address = this.currentGarage.address;
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
    this.service_telephones.push({ tel: '', time: new Date().getTime() });
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
