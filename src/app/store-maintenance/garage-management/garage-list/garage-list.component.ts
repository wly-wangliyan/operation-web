import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import { GarageManagementService, RepairShopEntity, RescueConfig, SearchParams } from '../garage-management.service';
import { DateFormatHelper } from '../../../../utils/date-format-helper';

const PageSize = 15;

class RescueConfigItem {
  public service_start_time = undefined; // 	服务开始时间 默认:空
  public service_end_time = undefined; // 服务结束时间 默认:空
  public rangeErrmsg = '';
  public timeErrmsg = '';
  public checked = false;
  public source: RescueConfig = new RescueConfig();

  constructor(source: RescueConfig) {
    this.source = source;
    this.checked = !source.is_deleted;
    this.service_start_time = DateFormatHelper.getMinuteOrTime(source.service_start_time ? source.service_start_time : 0);
    this.service_end_time = DateFormatHelper.getMinuteOrTime(source.service_end_time ? source.service_end_time : 0);
  }
}

@Component({
  selector: 'app-garage-list',
  templateUrl: './garage-list.component.html',
  styleUrls: ['./garage-list.component.css']
})
export class GarageListComponent implements OnInit {

  public garageList: Array<RepairShopEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public searchParams = new SearchParams();
  public vehicleBrandList = [];
  public vehicleFirmList = [];
  public vehicleSeriesList = [];
  public time = null;
  public rescueConfigList: Array<RescueConfigItem> = [];

  @ViewChild('helpServicePromptDiv', { static: true }) public helpServicePromptDiv: ElementRef;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private repair_shop_id: string; // 当前汽修店id

  private get pageCount(): number {
    if (this.garageList.length % PageSize === 0) {
      return this.garageList.length / PageSize;
    }
    return this.garageList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private garageService: GarageManagementService) {
  }

  ngOnInit() {
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.garageService.requestRepairShopsList(this.searchParams))
    ).subscribe(res => {
      this.garageList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.garageService.continueRepairShopsList(this.linkUrl).subscribe(res => {
        this.garageList = this.garageList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 开启、关闭经济公司
  public onSwitchChange(broker_company_id, event) {
    const swith = event ? 1 : 2;
    const params = { status: swith };
    this.garageService.requestRepairShopsStatus(broker_company_id, params).subscribe(res => {
      if (event) {
        this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
      } else {
        this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
      }
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            this.globalService.promptBox.open('参数错误或无效！', null, 2000, '/assets/images/warning.png');
          }
        }
      }
      this.searchText$.next();
    });
  }

  // 查询
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 救援服务配置
  public onHelpServiceClick(repair_shop_id: string) {
    this.rescueConfigList = [];
    this.repair_shop_id = repair_shop_id;
    this.garageService.requestRescueConfigData(repair_shop_id).subscribe(res => {
      res.forEach(value => {
        this.rescueConfigList.push(new RescueConfigItem(value));
      });
      if (res.length === 0) {
        const params = [];
        params.push({source: new RescueConfig()}, {source: new RescueConfig()});
        params.forEach((value, index) => {
          value.rescue_service_type = index + 1;
          value.is_deleted = true;
          value.rescue_range = null;
          this.rescueConfigList.push(new RescueConfigItem(value));
        });
      }
      $(this.helpServicePromptDiv.nativeElement).modal('show');
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 弹框close
  public onClose() {
    this.clear();
    $(this.helpServicePromptDiv.nativeElement).modal('hide');
  }

  // 清空
  private clear() {
    this.rescueConfigList.forEach(value => {
      value.rangeErrmsg = '';
      value.timeErrmsg = '';
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
    this.clear();
    if (this.verification()) {
      this.rescueConfigList.forEach(value => {
        value.source.is_deleted = !value.checked;
      });
      const params = {rescue_config: this.rescueConfigList.map(v => v.source)};
      this.garageService.requestEditRescueConfig(this.repair_shop_id, params).subscribe(res => {
        this.globalService.promptBox.open('保存成功！');
        this.searchText$.next();
        this.onClose();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 表单提交校验
  private verification(): boolean {
    let cisCheck = true;
    this.rescueConfigList.forEach(value => {
      if (!value.source.rescue_range && value.checked) {
        value.rangeErrmsg = '请填写救援范围！';
        cisCheck = false;
      }
      value.source.service_start_time = DateFormatHelper.getSecondTimeSum(value.service_start_time);
      value.source.service_end_time = DateFormatHelper.getSecondTimeSum(value.service_end_time);
      if (((!value.source.service_start_time || value.source.service_start_time === 0) &&
          (!value.source.service_end_time || value.source.service_end_time === 0)) && value.checked) {
        value.timeErrmsg = '请填写服务时间！';
        cisCheck = false;
      } else if (value.source.service_start_time >= value.source.service_end_time && Number(value.source.service_end_time) > 0) {
        value.timeErrmsg = '服务开始时间应小于结束时间！';
        cisCheck = false;
      }
    });
    return cisCheck;
  }
}
