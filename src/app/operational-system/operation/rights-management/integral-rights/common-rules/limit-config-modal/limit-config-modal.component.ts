import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonRuleEntity, IntegralRightsHttpService } from '../../integral-rights-http.service';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-limit-config-modal',
  templateUrl: './limit-config-modal.component.html',
  styleUrls: ['./limit-config-modal.component.less']
})
export class LimitConfigModalComponent {
  public limit_type: number;
  public integral_count: number; // 每个用户每天最多获取 * 积分
  public ruleData: CommonRuleEntity = new CommonRuleEntity();
  private isSaving = false; // 标记是否正在执行保存操作
  public errMsg: string; // 错误提示
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
    this.ruleData.max_integral = data.max_integral;
    this.errMsg = '';
    this.limit_type = null;
    this.integral_count = null;
    if (this.ruleData.max_integral >= 0) {
      this.limit_type = 1;
      this.integral_count = Number(this.ruleData.max_integral);
    } else {
      this.limit_type = this.ruleData.max_integral;
    }
  }

  // radio切换
  public onModelChange(event: any): void {
    this.errMsg = '';
    this.integral_count = null;
    if (event) {
      this.limit_type = Number(event);
    }
  }

  // 确定
  public onCheckClick(): void {
    this.errMsg = '';
    if (this.isSaving) { return; }
    if (this.limit_type === 1) {
      if (this.integral_count === 0) {
        this.errMsg = '每个用户每天最多获取的积分数应大于0！';
        return;
      }
      this.ruleData.max_integral = this.integral_count;
    } else {
      this.ruleData.max_integral = -1;
    }
    this.isSaving = true;
    this.integralRightsHttpService.requestEditCommonIntegralRule(this.ruleData.config_id, this.ruleData, 2)
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
