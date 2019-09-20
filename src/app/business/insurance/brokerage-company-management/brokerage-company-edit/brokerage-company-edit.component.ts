import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { BrokerageEntity, InsuranceEntity, InsuranceService, UpdateBrokerageEntity } from '../../insurance.service';

class InsuranceEntityItem {
  public checked = false;
  public source: InsuranceEntity;

  constructor(source: InsuranceEntity) {
    this.source = source;
  }
}

@Component({
  selector: 'app-brokerage-company-edit',
  templateUrl: './brokerage-company-edit.component.html',
  styleUrls: ['./brokerage-company-edit.component.css']
})
export class BrokerageCompanyEditComponent {
  public isCreateBrokerage = true;
  public currentBrokerage: BrokerageEntity = new BrokerageEntity();
  public insuranceList: Array<InsuranceEntityItem> = [];
  public insuranceErrMes = '';

  private continueRequestSubscription: Subscription;
  private sureCallback: any;
  private closeCallback: any;
  private brokerage_id: string;

  @Input() public sureName: string;

  @ViewChild('pagePromptDiv', { static: true }) public pagePromptDiv: ElementRef;

  constructor(private globalService: GlobalService,
    private insuranceService: InsuranceService) {
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 弹框close
  public onClose() {
    this.currentBrokerage = new BrokerageEntity();
    $(this.pagePromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(brokerage_id: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openPageModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.pagePromptDiv.nativeElement).modal('show');
      });
    };
    this.isCreateBrokerage = brokerage_id ? false : true;
    this.brokerage_id = brokerage_id;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.insuranceErrMes = '';
    this.insuranceList = [];
    this.rquestInsuranceList();
    openPageModal();
  }

  // 获取保险公司列表
  private rquestInsuranceList() {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription = this.insuranceService.requestInsuranceUseList()
      .subscribe(res => {
        res.results.forEach(value => {
          this.insuranceList.push(new InsuranceEntityItem(value));
        });
        this.rquestBrokerageDetail();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 获取经纪公司详情
  private rquestBrokerageDetail() {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription =
      this.insuranceService.requestBrokerDetail(this.brokerage_id).subscribe(res => {
        this.currentBrokerage = res;
        for (const i in res.ic_company) {
          if (res.ic_company.hasOwnProperty(i)) {
            for (const j in this.insuranceList) {
              if (res.ic_company[i].ic_id === this.insuranceList[j].source.ic_id) {
                this.insuranceList[j].checked = true;
              }
            }
          }
        }
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // form提交
  public onEditFormSubmit() {
    this.insuranceErrMes = '';
    const insurance_id = [];
    for (const i in this.insuranceList) {
      if (this.insuranceList[i].checked) {
        insurance_id.push(this.insuranceList[i].source.ic_id);
      }
    }
    if (this.verification(insurance_id)) {
      const params = new UpdateBrokerageEntity();
      params.describe = this.currentBrokerage.describe;
      params.ic_company = insurance_id.join(',');
      this.insuranceService.requestModifyBrokerage(params, this.brokerage_id).subscribe(() => {
        this.onClose();
        this.globalService.promptBox.open('保存成功！', () => {
          this.sureCallbackInfo();
        });
      }, err => {
        this.errorProcess(err);
      });
    }
  }

  // 表单提交校验
  private verification(insurance_id: any) {
    let isCheck = true;
    if (insurance_id.length === 0) {
      this.insuranceErrMes = '请选择授权保险公司！';
      isCheck = false;
    }
    /*if (this.insuranceList.length === 0) {
      this.insuranceErrMes = '请启用保险公司！';
      isCheck = false;
    } else if (insurance_id.length === 0) {
      this.insuranceErrMes = '请选择授权保险公司！';
      isCheck = false;
    }*/
    return isCheck;
  }

  // 确定按钮回调
  private sureCallbackInfo() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'invalid' && content.field === 'ic_name') {
            this.insuranceErrMes = '授权保险公司错误或无效！';
            return;
          }
        }
      }
    }
  }
}
