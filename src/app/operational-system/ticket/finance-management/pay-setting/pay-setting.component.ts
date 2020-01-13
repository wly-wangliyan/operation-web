import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import {
  PaySettingEntity,
  FinanceManagementService,
} from '../finance-management.service';

@Component({
  selector: 'app-pay-setting',
  templateUrl: './pay-setting.component.html',
  styleUrls: ['./pay-setting.component.css']
})
export class PaySettingComponent implements OnInit {

  constructor(private globalService: GlobalService, private financeService: FinanceManagementService) { }

  public paySettingList: Array<PaySettingEntity> = [];

  public radioValue: string;

  public loading = true;

  public isEditPaySetting = false;

  private searchText$ = new Subject<any>();

  ngOnInit() {
    // 获取支付配置列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.financeService.requestPaySettingListData())
    ).subscribe(res => {
      this.paySettingList = res.results;
      this.radioValue = this.paySettingList.filter(i => i.status === 1)[0].pay_setting_id;
      this.loading = false;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 编辑
  public onEditPaySetting() {
    this.isEditPaySetting = true;
  }

  // 保存
  public onSavePaySetting(value: string) {
    this.financeService.requestPaySettingStatus(value).subscribe(() => {
      this.isEditPaySetting = false;
      this.searchText$.next();
      this.globalService.promptBox.open('保存成功');
    }, err => {
      this.globalService.promptBox.open('保存失败，请重试！', null, 2000, null, false);
    });
  }

  // 取消
  public onCancelPaySetting() {
    this.isEditPaySetting = false;
    this.radioValue = this.paySettingList.filter(i => i.status === 1)[0].pay_setting_id;
  }

}
