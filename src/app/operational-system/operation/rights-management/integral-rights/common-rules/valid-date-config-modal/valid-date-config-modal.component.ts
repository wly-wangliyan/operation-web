import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
export class ValidDateConfigModalComponent implements OnInit, OnDestroy {
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
    this.yearList = DateFormatHelper.getNextFewYears(10, false);
    window.addEventListener('resize', this.generateModalPosition);
  }

  public open(data: CommonRuleEntity, sureFun?: any) {
    this.errMsg = '';
    this.ruleData = data ? data.clone() : new CommonRuleEntity();
    if (!this.ruleData.month) {
      this.datePicker.onClearForm();
    }
    this.sureCallback = sureFun;
    timer(0).subscribe(() => {
      $(this.configModal.nativeElement).modal();
      timer(0).subscribe(() => {
        this.generateModalPosition();
      });
    });
  }

  private generateModalPosition = () => {
    const modal_dialog = document.getElementById('configModal-dialog');
    this.offsetLeft = modal_dialog.offsetLeft;
    this.offsetTop = modal_dialog.offsetTop + 100;
  }

  public onChangeInterval(event: any): void {
    if (event.target.value) {
      this.ruleData.interval = Number(event.target.value);
    }
  }

  public onChangeYear(event: any): void {
    if (event.target.value) {
      this.ruleData.start_year = Number(event.target.value);
    }
  }

  public onModelChange(): void {

  }

  public onCheckClick(): void {
    if (this.isSaving) { return; }

    this.integralRightsHttpService.requestEditCommonIntegralRule(this.ruleData.config_id, this.ruleData, 2)
      .subscribe(res => {
        $(this.configModal.nativeElement).modal('hide');
        this.sureCallbackInfo();
        this.globalService.promptBox.open('保存成功');
      }, err => this.globalService.httpErrorProcess(err));
  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.sureCallback = null;
      temp();
    }
  }

  public ngOnDestroy() {
    window.removeEventListener('resize', this.generateModalPosition);
  }
}
