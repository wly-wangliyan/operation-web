import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BrokerageEntity, InsuranceService } from '../../../operational-system/insurance/insurance.service';
import { FileImportViewModel } from '../../../../utils/file-import.model';
import { Subject, Subscription } from 'rxjs';
import { BrokerageCompanyEditComponent } from '../../../operational-system/insurance/brokerage-company-management/brokerage-company-edit/brokerage-company-edit.component';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import { GarageManagementService, RepairShopEntity, RescueConfig, SearchParams } from '../garage-management.service';
import { DateFormatHelper } from '../../../../utils/date-format-helper';

const PageSize = 15;

class RepairShopItem {
  public door_start_time = null; // 上门服务开始时间 默认:空
  public door_end_time = null; // 上门服务结束时间 默认:空
  public shop_start_time = null; // 到店服务开始时间 默认:空
  public shop_end_time = null; // 到店服务结束时间 默认:空
  public source: RepairShopEntity;

  constructor(source: RepairShopEntity) {
    this.source = source;
    this.door_start_time = DateFormatHelper.getMinuteOrTime(source.door_start_time);
    this.door_end_time = DateFormatHelper.getMinuteOrTime(source.door_start_time);
    this.shop_start_time = DateFormatHelper.getMinuteOrTime(source.door_start_time);
    this.shop_end_time = DateFormatHelper.getMinuteOrTime(source.door_start_time);
  }
}

@Component({
  selector: 'app-garage-list',
  templateUrl: './garage-list.component.html',
  styleUrls: ['./garage-list.component.css']
})
export class GarageListComponent implements OnInit {

  public garageList: Array<RepairShopItem> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public searchParams = new SearchParams();
  public vehicleBrandList = [];
  public vehicleFirmList = [];
  public vehicleSeriesList = [];
  public time = null;
  public currentRescueConfig: RescueConfig = new RescueConfig();
  public service_start_time; // 	服务开始时间 默认:空
  public service_end_time; // 服务结束时间 默认:空

  @ViewChild('helpServicePromptDiv', { static: true }) public helpServicePromptDiv: ElementRef;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  @ViewChild(BrokerageCompanyEditComponent, {static: true}) public brokerageEditComponent: BrokerageCompanyEditComponent;

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
      // this.garageList = res.results;
      res.results.forEach(value => {
        this.garageList.push(new RepairShopItem(value));
      });
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
  public onHelpServiceClick(data: RescueConfig) {
    this.currentRescueConfig = data;
    $(this.helpServicePromptDiv.nativeElement).modal('show');
  }

  // 弹框close
  public onClose() {
    this.clear();
    $(this.helpServicePromptDiv.nativeElement).modal('hide');
  }

  // 清空
  private clear() {
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
  }
}
