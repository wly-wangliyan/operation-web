import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { timer } from 'rxjs';
import { CommonRuleEntity, IntegralRightsHttpService } from '../../integral-rights-http.service';
import { GlobalService } from '../../../../../../core/global.service';
import { DateFormatHelper } from '../../../../../../../utils/date-format-helper';
import { DatePickerComponent } from '../../../../../../share/components/date-picker/date-picker.component';

@Component({
  selector: 'app-valid-date-config-modal',
  templateUrl: './valid-date-config-modal.component.html',
  styleUrls: ['./valid-date-config-modal.component.less']
})
export class ValidDateConfigModalComponent implements OnInit {
  public yearList: Array<number> = [];
  public ruleData: CommonRuleEntity = new CommonRuleEntity();
  private isSaving = false;
  public offsetLeft = 0;
  public offsetTop = 0;
  public errMsg: string; // 错误提示
  private sureCallback = null;

  @ViewChild('configModal', { static: false }) private configModal: ElementRef;
  @ViewChild('datePicker', { static: false }) public datePicker: DatePickerComponent;
  constructor(
    private globalService: GlobalService,
    private integralRightsHttpService: IntegralRightsHttpService
  ) { }

  ngOnInit() {
    // 初始化为包含今年的近10年
    this.yearList = DateFormatHelper.getNextFewYears(10);
  }

  public open(data: CommonRuleEntity, sureFun?: any) {
    this.errMsg = '';
    this.isSaving = false;
    this.ruleData = data ? data.clone() : new CommonRuleEntity();
    this.ruleData.interval = data.interval || '';
    this.ruleData.start_year = this.yearList.some(year => year === data.start_year) ? data.start_year : '';
    if (!this.ruleData.month) {
      this.datePicker.onClearForm();
    }
    this.sureCallback = sureFun;
    timer(0).subscribe(() => {
      $(this.configModal.nativeElement).modal();
    });
  }

  // 变更间隔
  public onChangeInterval(event: any): void {
    if (event.target.value) {
      this.ruleData.interval = Number(event.target.value);
    }
  }

  // 变更开始年份
  public onChangeYear(event: any): void {
    if (event.target.value) {
      this.ruleData.start_year = Number(event.target.value);
    }
  }

  // 变更清零日
  public onChangeSelected(event: any) {
    this.ruleData.month = event.month ? Number(event.month) : null;
    this.ruleData.day = event.day ? Number(event.day) : null;
  }

  // 确定
  public onCheckClick(): void {
    if (this.isSaving) { return; }
    this.isSaving = true;
    this.integralRightsHttpService.requestEditCommonIntegralRule(this.ruleData.config_id, this.ruleData, 1)
      .subscribe(res => {
        $(this.configModal.nativeElement).modal('hide');
        this.sureCallbackInfo();
        this.globalService.promptBox.open('保存成功');
      }, err => {
        this.isSaving = false;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.sureCallback = null;
      temp();
    }
  }
}
