import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { InsuranceEntity, InsuranceService, UpdateInsueranceEntity } from '../../../operational-system/insurance/insurance.service';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { HttpErrorEntity } from '../../../core/http.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  public currentInsurance: InsuranceEntity = new InsuranceEntity();
  public paramList: Array<any> = [];
  public optionList: Array<any> = []; // 选项列表

  private continueRequestSubscription: Subscription;
  private sureCallback: any;
  private closeCallback: any;
  private insurance_id: string;

  @Input() public sureName: string;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('paramPromptDiv', { static: true }) public paramPromptDiv: ElementRef;
  @ViewChild('editParamPromptDiv', { static: true }) public editParamPromptDiv: ElementRef;

  constructor(private insuranceService: InsuranceService,
              private globalService: GlobalService) {
  }

  public ngOnInit(): void {
    this.paramList.push({broker_company_name: 111});
    this.optionList.push({broker_company_name: 111, time: new Date().getTime()});
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
    this.clear();
    this.currentInsurance = new InsuranceEntity();
    $(this.projectPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开编辑保养项目确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public openProjectModal(insurance_id: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openProjectModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.projectPromptDiv.nativeElement).modal('show');
      });
    };
    this.insurance_id = insurance_id;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    // this.rquestPageIconDetail();
    openProjectModal();
  }

  /**
   * 打开参数列表模态框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public openParamModal(insurance_id: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openParamModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.paramPromptDiv.nativeElement).modal('show');
      });
    };
    this.insurance_id = insurance_id;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    // this.rquestPageIconDetail();
    openParamModal();
  }

  /**
   * 打开编辑参数模态框
   */
  public onEditParamClick(data) {
    $(this.editParamPromptDiv.nativeElement).modal('show');
  }

  // 获取保险公司详情
  private rquestPageIconDetail() {
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    this.continueRequestSubscription =
        this.insuranceService.requestInsuranceDetail(this.insurance_id).subscribe(res => {
          this.currentInsurance = res;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    const params = new UpdateInsueranceEntity();
    params.ic_name = this.currentInsurance.ic_name;
    params.describe = this.currentInsurance.describe;
    params.details_link = this.currentInsurance.details_link;
    // 编辑保险公司
    this.insuranceService.requestModifyInsurance(params, this.insurance_id).subscribe(() => {
      this.onClose();
      this.globalService.promptBox.open('修改成功！', () => {
        this.sureCallbackInfo();
      });
    }, err => {
      this.errorProcess(err);
    });
  }

  // 清空
  public clear() {
    // this.errPositionItem.icon.isError = false;
    // this.errPositionItem.ic_name.isError = false;
    // this.errPositionItem.details_link.isError = false;
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
          if (content.code === 'already_exits' && content.resource === 'icc') {
            // this.errPositionItem.ic_name.isError = true;
            // this.errPositionItem.ic_name.errMes = '保险公司名称重复！';
            return;
          }
        }
      }
    }
  }

  // 开启、关闭经济公司
  public onSwitchChange(broker_company_id, event) {
    const swith = event ? false : true;
    const params = { discontinue_use: swith };
    this.insuranceService.requestOpenBrokerCompany(broker_company_id, params).subscribe(res => {
      if (event) {
        this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
      } else {
        this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
      }
      // this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            this.globalService.promptBox.open('参数错误或无效！', null, 2000, '/assets/images/warning.png');
          }
        }
      }
      // this.searchText$.next();
    });
  }

  // 添加选项
  public onAddOptionClick() {
    this.optionList.push({time: new Date().getTime()});
  }

  // 移除选项
  public onDelOptionClick(index: number) {
    this.optionList.splice(index, 1);
  }
}
