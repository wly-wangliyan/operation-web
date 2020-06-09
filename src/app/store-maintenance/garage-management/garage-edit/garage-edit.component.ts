import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MapItem, ZMapSelectPointComponent } from '../../../share/components/z-map-select-point/z-map-select-point.component';
import { ProCityDistSelectComponent, RegionEntity } from '../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { GlobalService } from '../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateHelper } from '../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../core/http.service';
import { isUndefined } from 'util';
import {
  GarageManagementService, RepairShopEntity, EditRepairShopParams,
  WashCarEntity, MaintainInfoEntity
} from '../garage-management.service';
import { DateFormatHelper, TimeItem } from '../../../../utils/date-format-helper';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GarageGiftComponent } from './garage-gift/garage-gift.component';

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
  public currentGarage = new RepairShopEntity(); // 汽修店详情
  public editParams: EditRepairShopParams = new EditRepairShopParams(); // 基本信息编辑参数
  public mapItem: MapItem = new MapItem(); // map参数
  public company_name: string; // 所属企业
  public regionsObj: RegionEntity = new RegionEntity(); // 基本信息-门店地址
  public tabs = [{ key: 3, value: '洗车服务' }, { key: 1, value: '到店保养服务' }]; // tab列表
  public tab_index = 0; // 标记当前tab索引
  public serviceList: Array<ServiceItem> = []; // 基本信息-服务类型 1:到店保养服务 2:救援服务 3:洗车服务 4:上门保养
  private serviceNames = ['default', '到店保养服务', '救援服务', '洗车服务', '上门保养服务']; // 基本信息-服务类型名称
  public service_initial_value: Array<number> = []; // 标记服务类型初始值，控制tab显示与隐藏
  public washInfo: WashCarEntity = new WashCarEntity(); // 洗车服务详情
  public maintainInfo: MaintainInfoEntity = new MaintainInfoEntity(); // 到店保养服务详情
  public tagList: Array<any> = []; // 标签列表
  public tag: any; // 未保存的标签内容

  public door_start_time: TimeItem = new TimeItem(); // 基本信息-上门保养开始时间
  public door_end_time: TimeItem = new TimeItem(); // 基本信息-上门保养结束时间

  public wash_start_time: TimeItem = new TimeItem(); // 洗车服务-洗车营业开始时间
  public wash_end_time: TimeItem = new TimeItem(); // 洗车服务-洗车营业结束时间

  public maintain_start_time: TimeItem = new TimeItem(); // 到店保养-营业开始时间
  public maintain_end_time: TimeItem = new TimeItem(); // 到店保养-营业结束时间

  private repair_shop_id: string; // 汽修店id
  private requestSubscription: Subscription;
  private searchText$ = new Subject<any>();

  @ViewChild('projectInfoPro', { static: true }) public proCityDistSelectComponent: ProCityDistSelectComponent
    = new ProCityDistSelectComponent();
  @ViewChild(ZMapSelectPointComponent, { static: true }) public zMapSelectPointComponent: ZMapSelectPointComponent;

  @ViewChild(GarageGiftComponent, { static: true }) public giftComponent: GarageGiftComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private garageService: GarageManagementService
  ) {
    this.route.paramMap.subscribe(map => {
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

  // 获取详情
  private requestDetail(): void {
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
        this.service_initial_value = res.service_type ? res.service_type : [];
        // 处理服务类型
        let service_index = 1;
        this.serviceList = [];
        while (service_index <= 4) {
          const serviceItem = new ServiceItem(service_index, false);
          serviceItem.name = this.serviceNames[service_index];
          if (res.service_type.includes(service_index)) {
            serviceItem.isChecked = true;
          }
          this.serviceList.push(serviceItem);
          service_index++;
        }
        this.company_name = res.repair_company ? res.repair_company.repair_company_name : '';
        // 处理门店地址
        this.regionsObj = new RegionEntity(this.currentGarage);
        this.loading = false;
        if (this.tab_index === 1) {
          this.initMaintainInfo();
        } else if (this.tab_index === 3) {
          this.initWashInfo();
        }
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

  // 切换tab页时，重新获取数据
  public onTabChange(event: any): void {
    this.tagList = [];
    this.searchText$.next();
  }

  // 初始化洗车服务
  private initWashInfo(): void {
    this.tag = null;
    this.washInfo = this.currentGarage.wash_car ? this.currentGarage.wash_car.clone() : new WashCarEntity();
    this.tagList = this.washInfo.wash_car_tags ? this.washInfo.wash_car_tags : [];
    this.wash_start_time = this.washInfo.start_time ? DateFormatHelper.getMinuteOrTime(this.washInfo.start_time)
      : new TimeItem();
    this.wash_end_time = this.washInfo.end_time ? DateFormatHelper.getMinuteOrTime(this.washInfo.end_time)
      : new TimeItem();
    const tempContent = this.washInfo.shop_instruction.replace('/\r\n/g', '<br>').replace(/\n/g, '');
    timer(200).subscribe(() => {
      CKEDITOR.instances.shairShopEditor.setData(tempContent);
    });
  }

  // 初始化到店保养服务相关
  private initMaintainInfo(): void {
    this.tag = null;
    this.maintainInfo = this.currentGarage.maintain_info ? this.currentGarage.maintain_info.clone() : new MaintainInfoEntity();
    this.tagList = this.maintainInfo.maintain_tags ? this.maintainInfo.maintain_tags : [];
    this.maintain_start_time = this.maintainInfo.start_time ? DateFormatHelper.getMinuteOrTime(this.maintainInfo.start_time)
      : new TimeItem();
    this.maintain_end_time = this.maintainInfo.end_time ? DateFormatHelper.getMinuteOrTime(this.maintainInfo.end_time)
      : new TimeItem();
    const tempContent = this.maintainInfo.shop_instruction.replace('/\r\n/g', '<br>').replace(/\n/g, '');
    timer(200).subscribe(() => {
      CKEDITOR.instances.maintainInfoEditor.setData(tempContent);
    });
  }

  // 保存基本信息
  public onEditFormSubmit() {
    if (this.verification()) {
      this.garageService.requestEditRepairShops(this.repair_shop_id, this.editParams).subscribe(() => {
        this.globalService.promptBox.open('保存成功！');
        this.searchText$.next();
      }, err => {
        this.errorProcess(err);
      });
    }
  }

  // 基本信息表单提交校验
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

  // 保存洗车服务
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

  // 保存到店保养服务
  public onMaintainFormSubmit(): void {
    const maintain_start_time = DateFormatHelper.getSecondTimeSum(this.maintain_start_time);
    const maintain_end_time = DateFormatHelper.getSecondTimeSum(this.maintain_end_time);

    if (maintain_start_time >= maintain_end_time) {
      this.globalService.promptBox.open('营业的开始时间需小于结束时间！', null, 2000, null, false);
      return;
    }
    this.maintainInfo.start_time = maintain_start_time;
    this.maintainInfo.end_time = maintain_end_time;
    if (!ValidateHelper.Phone(this.maintainInfo.maintain_telephone)) {
      this.globalService.promptBox.open('客服电话格式错误！', null, 2000, null, false);
      return;
    }
    const tempContent = CKEDITOR.instances.maintainInfoEditor.getData();
    if (tempContent) {
      this.maintainInfo.shop_instruction = tempContent.replace('/\r\n/g', '').replace(/\n/g, '');
    } else {
      this.maintainInfo.shop_instruction = '';
    }
    this.maintainInfo.maintain_tags = this.tagList;
    this.garageService.requestEditMaintainInfo(this.repair_shop_id, this.maintainInfo).subscribe(() => {
      this.globalService.promptBox.open('保存成功！');
      this.searchText$.next();
    }, err => {
      this.errorProcess(err);
    });
  }

  // 取消按钮
  public onClose() {
    this.router.navigate(['/garage-management/list']);
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
          } else if (content.field === 'wash_car_tags' && content.code === 'invalid') {
            this.globalService.promptBox.open('标签数据缺失！', null, 2000, null, false);
            return;
          } else if (content.resource === 'maintain_tags' && content.code === 'exceed_the_limit') {
            this.globalService.promptBox.open('标签个数超过上限！', null, 2000, null, false);
            return;
          } else if (content.field === 'maintain_tags' && content.code === 'invalid') {
            this.globalService.promptBox.open('标签数据缺失！', null, 2000, null, false);
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

  // 改变服务类型
  public onChangeService(service: ServiceItem): void {
    const result = [];
    this.serviceList.forEach(serviceItem => {
      if (serviceItem.isChecked) {
        result.push(serviceItem.id);
      }
    });
    this.editParams.service_type = result;
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

  // 服务类型至少选择一项
  public ifDisabled(): boolean {
    return !this.serviceList.some(service => service.isChecked);
  }
}
