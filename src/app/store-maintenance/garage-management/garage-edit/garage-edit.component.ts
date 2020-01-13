import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MapItem, ZMapSelectPointComponent } from '../../../share/components/z-map-select-point/z-map-select-point.component';
import { ProCityDistSelectComponent, RegionEntity } from '../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { GlobalService } from '../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateHelper } from '../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../core/http.service';
import { isUndefined } from 'util';
import { GarageManagementService, RepairShopEntity, EditRepairShopParams, WashCarEntity } from '../garage-management.service';
import { DateFormatHelper, TimeItem } from '../../../../utils/date-format-helper';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  constructor(service_telephone?: ErrMessageItem, tagNameErrors?: ErrMessageItem, jump_link?: ErrMessageItem,
    corner?: ErrMessageItem) {
    if (isUndefined(service_telephone) || isUndefined(tagNameErrors)) {
      return;
    }
    this.service_telephone = service_telephone;
  }
}

export class ServiceItem {
  id: number; // 服务类型 1:保养服务 2:救援服务 3:洗车服务
  name: string;
  isChecked: boolean;
  constructor(id: number, isChecked: boolean = false) {
    this.id = id;
    this.isChecked = isChecked;
  }
}

@Component({
  selector: 'app-garage-edit',
  templateUrl: './garage-edit.component.html',
  styleUrls: ['./garage-edit.component.css', '../../../../assets/less/tab-bar-list.less']
})
export class GarageEditComponent implements OnInit, OnDestroy {
  public loading = true;
  public currentGarage = new RepairShopEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public editParams: EditRepairShopParams = new EditRepairShopParams();
  public mapItem: MapItem = new MapItem();
  public is_add_tel = true;
  public service_telephones = [];
  public company_name: string;
  public time = null;
  public doorTimes = { begin_time: null, end_time: null }; // 上门保养时间
  public tab_index = 1;
  public serviceList: Array<ServiceItem> = []; // 服务类型 1:保养服务 2:救援服务 3:洗车服务
  private serviceNames = ['default', '保养服务', '救援服务', '洗车服务'];
  public washInfo: WashCarEntity = new WashCarEntity();
  public tagList: Array<any> = []; // 标签列表
  public tag: any; // 标签
  public door_start_time: TimeItem = new TimeItem(); // 上门保养开始时间
  public door_end_time: TimeItem = new TimeItem(); //  上门保养结束时间

  public wash_start_time: TimeItem = new TimeItem(); // 洗车营业开始时间
  public wash_end_time: TimeItem = new TimeItem(); //  洗车营业结束时间
  public regionsObj: RegionEntity = new RegionEntity(); // 门店地址
  public isShowWashService = false; // 只有基本服务的保存生效后，才显示或隐藏洗车相关
  private repair_shop_id: string;
  private requestSubscription: Subscription;
  private searchText$ = new Subject<any>();
  private tempContent: string;
  @ViewChild('projectInfoPro', { static: true }) public proCityDistSelectComponent: ProCityDistSelectComponent
    = new ProCityDistSelectComponent();
  @ViewChild(ZMapSelectPointComponent, { static: true }) public zMapSelectPointComponent: ZMapSelectPointComponent;

  constructor(
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private garageService: GarageManagementService,
    private router: Router,
    private route: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(map => {
      this.repair_shop_id = map.get('repair_shop_id');
    });
  }

  public ngOnInit(): void {
    if (this.repair_shop_id) {
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.requestDetail();
      });
      this.searchText$.next();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.searchText$ && this.searchText$.unsubscribe();
  }

  private requestDetail() {
    this.requestSubscription = this.garageService.requestRepairShopsDetail(this.repair_shop_id)
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
        this.editParams.service_type = res.service_type ? res.service_type : [];
        // 处理服务类型
        let service_index = 1;
        this.serviceList = [];
        while (service_index <= 3) {
          const serviceItem = new ServiceItem(service_index, false);
          serviceItem.name = this.serviceNames[service_index];
          if (res.service_type.includes(service_index)) {
            serviceItem.isChecked = true;
          }
          this.serviceList.push(serviceItem);
          service_index++;
        }

        if (res.service_type.includes(3)) {
          this.isShowWashService = true;
        } else {
          this.isShowWashService = false;
        }
        this.company_name = res.repair_company ? res.repair_company.repair_company_name : '';
        // 处理门店地址
        this.regionsObj = new RegionEntity(this.currentGarage);
        // this.proCityDistSelectComponent.initRegions(regionObj);
        this.initWashInfo();
        this.loading = false;
      }, err => {
        this.loading = false;
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 404) {
            this.globalService.promptBox.open('汽修店不存在，请刷新重试！', null, 2000, null, false);
            return;
          }
        }
      });
  }

  // 初始化洗车相关
  private initWashInfo(): void {
    this.tag = null;
    this.washInfo = this.currentGarage.wash_car ? this.currentGarage.wash_car.clone() : new WashCarEntity();
    this.tagList = this.washInfo.wash_car_tags ? this.washInfo.wash_car_tags : [];
    this.wash_start_time = this.washInfo.start_time ? DateFormatHelper.getMinuteOrTime(this.washInfo.start_time)
      : new TimeItem();
    this.wash_end_time = this.washInfo.end_time ? DateFormatHelper.getMinuteOrTime(this.washInfo.end_time)
      : new TimeItem();
    this.tempContent = this.washInfo.shop_instruction.replace('/\r\n/g', '<br>').replace(/\n/g, '');
    if (this.tab_index === 2) {
      timer(0).subscribe(() => {
        CKEDITOR.instances.shairShopEditor.setData(this.tempContent);
      });
    }
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
        this.globalService.promptBox.open('保存成功！');
        this.searchText$.next();
      }, err => {
        this.errorProcess(err);
      });
    }
  }

  public onWashFormSubmit(): void {
    const wash_start_time = DateFormatHelper.getSecondTimeSum(this.wash_start_time);
    const wash_end_time = DateFormatHelper.getSecondTimeSum(this.wash_end_time);

    if (wash_start_time >= wash_end_time) {
      this.globalService.promptBox.open('营业的开始时间需小于结束时间！', null, 2000, null, false);
      return;
    }
    this.washInfo.start_time = wash_start_time;
    this.washInfo.end_time = wash_end_time;
    if (!ValidateHelper.Phone(this.washInfo.wash_car_telephone)) {
      this.globalService.promptBox.open('客服电话格式错误！', null, 2000, null, false);
      return;
    }
    const tempContent = CKEDITOR.instances.shairShopEditor.getData();
    if (tempContent) {
      this.washInfo.shop_instruction = tempContent.replace('/\r\n/g', '').replace(/\n/g, '');
    } else {
      this.washInfo.shop_instruction = '';
    }
    this.washInfo.wash_car_tags = this.tagList;
    this.garageService.requestEditWashInfo(this.repair_shop_id, this.washInfo).subscribe(() => {
      this.globalService.promptBox.open('保存成功！');
      this.searchText$.next();
    }, err => {
      this.errorProcess(err);
    });

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
    this.router.navigate(['/garage-management/list']);
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
          if (content.resource === 'wash_car_tags' && content.code === 'exceed_the_limit') {
            this.globalService.promptBox.open('标签个数超过上限！', null, 2000, null, false);
            return;
          } else {
            this.globalService.promptBox.open('数据错误或无效！', null, 2000, null, false);
            return;
          }
        }
      } else if (err.status === 404) {
        this.globalService.promptBox.open('汽修店不存在，请刷新重试！', null, 2000, null, false);
        return;
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

  // 改变服务类型
  public onChangeService(service: ServiceItem): void {
    const result = [];
    this.serviceList.forEach(serviceItem => {
      if (serviceItem.isChecked) {
        result.push(serviceItem.id);
      }
    });
    if (service.id === 3) {
      this.initWashInfo();
    }
    this.editParams.service_type = result;
  }

  // 切换tab页时，重新获取数据
  public onTabChange(event: any): void {
    this.searchText$.next();
  }

  // 添加标签
  public onAddTagClick(): void {
    if (this.tag === '' || this.tag === null) {
      return;
    } else if (this.tagList.some(i => i === this.tag)) {
      this.globalService.promptBox.open('添加的标签重复,请重新输入!', null, 2000, null, false);
      return;
    } else {
      this.tagList.push(this.tag);
      this.tag = '';
    }
  }

  // 富文本编辑器是否有值
  public isAlreadyFill(): boolean {
    return CKEDITOR.instances.shairShopEditor && CKEDITOR.instances.shairShopEditor.getData() ? true : false;
  }
}
