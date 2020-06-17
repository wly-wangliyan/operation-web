import { Component, OnInit } from '@angular/core';
import { NzSearchAssistant } from '../../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';
import {
  GarageManagementService,
  RepairShopEntity,
  SearchParams
} from '../../../../../../store-maintenance/garage-management/garage-management.service';
import { BusinessEntity, BusinessManagementService } from '../../../../../mall/business-management/business-management.service';
import { ActivityBusinessService, BatchBusinessParams, MallSearchParams } from '../../activity-business.service';

export class RepairItem {
  source: RepairShopEntity = new RepairShopEntity();
  is_check = false;

  constructor(data: RepairShopEntity) {
    this.source = data;
  }
}

export class MallItem {
  source: BusinessEntity = new BusinessEntity();
  is_check = false;

  constructor(data: BusinessEntity) {
    this.source = data;
  }
}

@Component({
  selector: 'app-business-choose',
  templateUrl: './business-choose.component.html',
  styleUrls: ['./business-choose.component.css']
})
export class BusinessChooseComponent implements OnInit {

  public repairSearchParams: SearchParams = new SearchParams(); // 汽修店商家条件筛选参数
  public mallSearchParams: MallSearchParams = new MallSearchParams(); // 商城商家条件筛选参数
  public batchBusinessParams: BatchBusinessParams = new BatchBusinessParams(); // 批量保存商家
  public nzSearchAssistant: NzSearchAssistant;
  public name: string; // 商家名称
  public repairList: Array<RepairItem> = [];
  public mallList: Array<MallItem> = [];
  public checked_all: boolean;

  private sureCallback: any;
  private closeCallback: any;
  private movement_id: string;

  constructor(private globalService: GlobalService,
              private garageService: GarageManagementService,
              private mallService: BusinessManagementService,
              private businessService: ActivityBusinessService) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
  }

  ngOnInit() {
  }

  // 打开弹窗
  public open(movement_id: string, sureFunc: any, closeFunc: any = null) {
    const openBoothModal = () => {
      timer(0).subscribe(() => {
        $('#businessPromptDiv').modal('show');
      });
    };
    this.movement_id = movement_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.repairList = [];
    this.mallList = [];
    this.nzSearchAssistant.submitSearch(true);
    openBoothModal();
  }

  public onTypeChange() {
    this.name = '';
    this.nzSearchAssistant.submitSearch(false);
  }

  // 全选
  public onCheckAllClick(checked_all: boolean) {
    this.checked_all = checked_all;
    if (this.batchBusinessParams.type === '1') {
      const temp = this.repairList.slice((this.nzSearchAssistant.currentPage - 1) * 15, this.nzSearchAssistant.currentPage * 15);
      this.repairList.forEach(value => {
        if (temp.includes(value)) {
          value.is_check = checked_all;
        }
      });
    } else {
      const temp = this.mallList.slice((this.nzSearchAssistant.currentPage - 1) * 15, this.nzSearchAssistant.currentPage * 15);
      this.mallList.forEach(value => {
        if (temp.includes(value)) {
          value.is_check = checked_all;
        }
      });
    }
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onChooseSubmit();
      return false;
    }
  }

  // 数据提交
  public onChooseSubmit() {
    this.batchBusinessParams.movement_id = this.movement_id;
    let ids = this.repairList.filter(v => v.is_check).map(v => v.source.repair_shop_id);
    if (this.batchBusinessParams.type === '2') {
      ids = this.mallList.filter(v => v.is_check).map(v => v.source.mall_business_id);
    }
    this.batchBusinessParams.movement_shop_ids = ids.length > 0 ? ids.join(',') : '';
    if (ids.length === 0) {
      this.globalService.promptBox.open('请选择商家!', null, 2000, null, false);
      return;
    }
    this.businessService.requestBatchAddBusiness(this.batchBusinessParams).subscribe(() => {
      this.globalService.promptBox.open('保存成功!');
      this.sureCallback();
      $('#businessPromptDiv').modal('hide');
    }, err => {
      this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
      this.globalService.httpErrorProcess(err);
    });
  }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    if (this.batchBusinessParams.type === '1') {
      this.repairSearchParams.repair_shop_name = this.name;
      return this.garageService.requestRepairShopsList(this.repairSearchParams);
    } else {
      this.mallSearchParams.business_name = this.name;
      return this.mallService.requestBusinessList(this.mallSearchParams);
    }
  }

  public continueSearch(url: string): any {
    if (this.batchBusinessParams.type === '1') {
      this.repairSearchParams.repair_shop_name = this.name;
      return this.garageService.continueRepairShopsList(url);
    } else {
      this.mallSearchParams.business_name = this.name;
      return this.mallService.continueBusinessList(url);
    }
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) {
    this.repairList = [];
    this.mallList = [];
    results.forEach(value => {
      if (this.batchBusinessParams.type === '1') {
        this.repairList.push(new RepairItem(value));
      } else {
        this.mallList.push(new MallItem(value));
      }
    });
  }
}
