import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../../core/http.service';
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

  public isEditPaySetting = false;

  private searchText$ = new Subject<any>();

  ngOnInit() {
    this.paySettingList.push(new PaySettingEntity());
    this.paySettingList.push(new PaySettingEntity());
    this.paySettingList[0].pay_setting_id = '111';
    this.paySettingList[0].pay_type = 1;
    this.paySettingList[0].balance = 500000;
    this.paySettingList[0].status = 1;
    this.paySettingList[1].pay_setting_id = '222';
    this.paySettingList[1].pay_type = 2;
    this.paySettingList[1].balance = 120000;
    this.paySettingList[1].status = 2;

    this.radioValue = this.paySettingList.filter(i => i.status === 1)[0].pay_setting_id;
    // // 获取支付配置列表
    // this.searchText$.pipe(
    //   debounceTime(500),
    //   switchMap(() =>
    //     this.financeService.requestPaySettingListData())
    // ).subscribe(res => {
    //   this.paySettingList = res.results;
    // }, err => {
    //   this.globalService.httpErrorProcess(err);
    // });
    // this.searchText$.next();

  }

  // 编辑
  public onEditPaySetting() {
    this.isEditPaySetting = true;
  }

  // 保存
  public onSavePaySetting(value: string) {
    this.financeService.requestPaySettingStatus(value).subscribe(() => {
      this.searchText$.next();
      this.globalService.promptBox.open('保存成功');
    }, err => {
      this.globalService.promptBox.open('保存失败，请重试！');
    });
  }

  // 取消
  public onCancelPaySetting() {
    this.isEditPaySetting = false;
    this.searchText$.next();
  }

}
