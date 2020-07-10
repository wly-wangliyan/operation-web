import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../../core/global.service';
import { IntegralRightsHttpService, RuleEntity, RuleDetail } from '../../integral-rights-http.service';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../../utils/error-message-helper';
import { TimeItem, DateFormatHelper } from '../../../../../../../utils/date-format-helper';

@Component({
  selector: 'app-edit-rule',
  templateUrl: './edit-rule.component.html',
  styleUrls: ['./edit-rule.component.less']
})
export class EditRuleComponent implements OnInit {
  public rule_id: string; // 规则id
  public ruleData: RuleEntity; // 规则详情
  public errMessageGroup: ErrMessageGroup = new ErrMessageGroup();
  // public issued_time: TimeItem = new TimeItem(); // 发放时间
  public rule_detail: RuleDetail = new RuleDetail(); // 领取设置
  private isSaving = false;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private globalService: GlobalService,
    private integralRightsHttpService: IntegralRightsHttpService
  ) {
    this.router.paramMap.subscribe(map => {
      this.rule_id = map.get('rule_id');
    });
  }

  ngOnInit() {
    if (this.rule_id) {
      this.requestRuleDetail();
    } else {
      this.ruleData = new RuleEntity();
    }
  }

  // 获取规则详情
  private requestRuleDetail(): void {
    this.integralRightsHttpService.requestCustomIntegralRuleDetailData(this.rule_id)
      .subscribe(res => {
        this.ruleData = res;
        // this.issued_time = res.issued_time ? DateFormatHelper.getMinuteOrTime(res.issued_time)
        //   : new TimeItem();
        // 第一版只有停车缴费
        this.ruleData.business_type = this.ruleData.business_type || 1;
        if (this.ruleData.rule_detail) {
          this.ruleData.rule_detail.fee_amount = this.ruleData.rule_detail.fee_amount ? this.ruleData.rule_detail.fee_amount / 100 : null;
          this.rule_detail = this.ruleData.rule_detail.clone();
        }
        this.ruleData.sub_business_type = this.ruleData.sub_business_type || -1;
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.ruleData = null;
          this.globalService.promptBox.open('规则详情获取失败,请返回重试！', null, 2000, null, false);
        }
      });
  }

  // 变更领取设置
  public onChangeRuleType(event: any): void {
    this.rule_detail.order_number = null;
    this.rule_detail.fee_amount = null;
  }

  // 保存
  public onEditFormSubmit(): void {
    if (this.isSaving) { return; }
    if (this.generateAnfCheckParamsValid()) {
      this.isSaving = true;
      console.log(this.ruleData);

      if (!this.rule_id) {
        this.requestAddRule();
      } else {
        this.requestEditRule();
      }
    } else {
      this.isSaving = false;
    }

  }

  // 新建规则
  private requestAddRule() {
    this.integralRightsHttpService.requestAddCustomIntegralRule(this.ruleData)
      .subscribe(res => {
        this.globalService.promptBox.open('保存成功', () => {
          this.onCancelClick();
        });
      }, err => {
        this.isSaving = false;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 编辑规则
  private requestEditRule() {
    this.integralRightsHttpService.requestEditCustomIntegralRule(this.rule_id, this.ruleData)
      .subscribe(res => {
        this.globalService.promptBox.open('保存成功', () => {
          this.onCancelClick();
        });
      }, err => {
        this.isSaving = false;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 基本信息表单提交校验
  private generateAnfCheckParamsValid(): boolean {
    // const issued_time = DateFormatHelper.getSecondTimeSum(this.issued_time, 'mm');

    if (this.rule_detail.type === 2) {
      if (!this.rule_detail.fee_amount || Number(this.rule_detail.fee_amount) <= 0) {
        this.errMessageGroup.errJson.rule_detail.errMes = '每笔每购买金额应大于0！';
        return false;
      }
      this.ruleData.rule_detail = this.rule_detail.clone();
      this.ruleData.rule_detail.fee_amount = Math.round(this.ruleData.rule_detail.fee_amount * 100);
    } else {
      this.ruleData.rule_detail = this.rule_detail.clone();
    }

    // this.ruleData.issued_time = issued_time;
    return true;
  }

  // 清除错误信息
  public clear(): void {
    this.errMessageGroup.errJson = {};
    this.errMessageGroup.errJson.award_integral = new ErrMessageBase();
    this.errMessageGroup.errJson.rule_detail = new ErrMessageBase();
  }

  // 取消
  public onCancelClick(): void {
    window.history.back();
  }
}
