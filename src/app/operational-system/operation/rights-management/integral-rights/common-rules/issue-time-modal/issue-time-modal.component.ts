import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonRuleEntity, IntegralRightsHttpService, IssueTimeEntity } from '../../integral-rights-http.service';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';
import { TimeItem, DateFormatHelper } from '../../../../../../../utils/date-format-helper';

@Component({
  selector: 'app-issue-time-modal',
  templateUrl: './issue-time-modal.component.html',
  styleUrls: ['./issue-time-modal.component.less']
})
export class IssueTimeModalComponent {
  public time: TimeItem = new TimeItem(); // 发放时间
  public issue_time: IssueTimeEntity = new IssueTimeEntity();
  public ruleData: CommonRuleEntity = new CommonRuleEntity();
  private isSaving = false; // 标记是否正在执行保存操作
  private sureCallback = null;

  @ViewChild('configModal', { static: true }) private configModal: ElementRef;
  constructor(
    private globalService: GlobalService,
    private integralRightsHttpService: IntegralRightsHttpService) { }

  /**
   * 打开设置积分有效期模态框
   * @param data CommonRuleEntity
   * @param sureFun 保存成功回调
   */
  public open(data: CommonRuleEntity, sureFun?: any) {
    this.initForm(data);
    this.sureCallback = sureFun;
    timer(0).subscribe(() => $(this.configModal.nativeElement).modal());
  }

  // 初始化表单
  private initForm(data: CommonRuleEntity) {
    this.isSaving = false;
    this.ruleData = new CommonRuleEntity();
    this.ruleData.config_id = data.config_id;
    this.issue_time = new IssueTimeEntity();
    this.issue_time.business_type = 1;
    this.time = data.issue_time && data.issue_time.time ? DateFormatHelper.getMinuteOrTime(data.issue_time.time, 'mm')
      : new TimeItem();
  }

  // 确定
  public onCheckClick(): void {
    if (this.isSaving) { return; }
    this.issue_time.time = DateFormatHelper.getSecondTimeSum(this.time, 'mm');
    this.ruleData.issue_time = this.issue_time;
    this.isSaving = true;
    this.integralRightsHttpService.requestEditCommonIntegralRule(this.ruleData.config_id, this.ruleData, 3)
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
