import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServiceConfigService, ConfigEntity } from './service-config.service';
import { GlobalService } from '../../core/global.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-service-config',
  templateUrl: './service-config.component.html',
  styleUrls: ['./service-config.component.css']
})
export class ServiceConfigComponent implements OnInit, OnDestroy {

  public loading = true;

  public isEdit = false;

  public configParams: ConfigEntity = new ConfigEntity(); // 服务配置

  public configErrMsg = ''; // 错误信息

  private tmpConfigRecord: ConfigEntity; // 用于缓存编辑前的数据

  private exemption_id = 'c0299b0b5fcc94d9051960f567c579a1'; // 配置id

  private requestSubscription: Subscription;

  private searchText$ = new Subject<any>();

  private is_save = false; // 标记是否保存中

  private isInstanceReady = false; // 标记富文本编辑器是否加载完成;

  constructor(private globalService: GlobalService, private serviceConfigService: ServiceConfigService) { }

  public ngOnInit() {
    this.is_save = false;
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.rquestConfigDetail();
    });
    this.searchText$.next();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.searchText$ && this.searchText$.unsubscribe();
    CKEDITOR.instances.serviceConfigEditor.destroy(true);
  }

  // 获取服务配置详情
  private rquestConfigDetail(): void {
    if (this.tmpConfigRecord) {
      this.configParams = new ConfigEntity(this.tmpConfigRecord);
      this.getEditorData();
      return;
    }
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.serviceConfigService.requestServiceConfigDetail(this.exemption_id).subscribe(res => {
      this.configParams = res;
      this.tmpConfigRecord = new ConfigEntity(res);
      this.getEditorData();
      this.loading = false;
    }, err => {
      this.loading = false;
      this.tmpConfigRecord = null;
      this.getEditorData();
      this.globalService.httpErrorProcess(err);
    });
  }

  // 富文本数据处理
  public getEditorData() {
    const tempContent = this.configParams.content.replace('/\r\n/g', '').replace(/\n/g, '');
    CKEDITOR.instances.serviceConfigEditor.setData(tempContent);
    CKEDITOR.instances.serviceConfigEditor.setReadOnly(true);
    this.isInstanceReady = true;
  }

  // 富文本编辑器是否有值
  public isAlreadyFill(): boolean {
    if (this.isInstanceReady) {
      return CKEDITOR.instances.serviceConfigEditor.getData() ? true : false;
    } else {
      return false;
    }
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 格式化金额
  public onAmountChange(event: any): void {
    // 原价
    if (this.configParams.total_amount) {
      if (isNaN(parseFloat(String(this.configParams.total_amount)))) {
        this.configParams.total_amount = null;
      } else {
        const total_amount = parseFloat(String(this.configParams.total_amount)).toFixed(2);
        this.configParams.total_amount = parseFloat(total_amount);
      }
    }

    // 结算价
    if (this.configParams.sale_amount) {
      if (isNaN(parseFloat(String(this.configParams.sale_amount)))) {
        this.configParams.sale_amount = null;
      } else {
        const sale_amount = parseFloat(String(this.configParams.sale_amount)).toFixed(2);
        this.configParams.sale_amount = parseFloat(sale_amount);
      }
    }

    // 售价
    if (this.configParams.real_amount) {
      if (isNaN(parseFloat(String(this.configParams.real_amount)))) {
        this.configParams.real_amount = null;
      } else {
        const real_amount = parseFloat(String(this.configParams.real_amount)).toFixed(2);
        this.configParams.real_amount = parseFloat(real_amount);
      }
    }
  }

  public onEditFormSubmit(): void {

    if (this.is_save) {
      return;
    }
    if (this.generateAndCheckParamsValid()) {
      this.is_save = true;
      this.serviceConfigService.requestUpdateServiceConfigDetail(this.exemption_id, this.configParams).subscribe(() => {
        this.globalService.promptBox.open('保存成功!');
        this.is_save = false;
        this.isEdit = false;
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('保存失败，请重试！', null, 2000, null, false);
          this.is_save = false;
        }
      });
    } else {
      this.is_save = false;
    }
  }

  private generateAndCheckParamsValid(): boolean {
    const tempContent = CKEDITOR.instances.serviceConfigEditor.getData();

    if (!this.configParams.total_amount || Number(this.configParams.total_amount) === 0) {
      this.configErrMsg = '原价应大于0！';
      return false;
    }

    if (!this.configParams.sale_amount || Number(this.configParams.sale_amount) === 0) {
      this.configErrMsg = '结算价应大于0！';
      return false;
    }

    if (!this.configParams.real_amount || Number(this.configParams.real_amount) === 0) {
      this.configErrMsg = '售价应大于0！';
      return false;
    }

    if (Number(this.configParams.total_amount) < Number(this.configParams.real_amount)) {
      this.configErrMsg = '原价应大于等于售价！';
      return false;
    }

    if (Number(this.configParams.real_amount) < Number(this.configParams.sale_amount)) {
      this.configErrMsg = '结算价应小于等于售价！';
      return false;
    }

    if (!tempContent) {
      this.configErrMsg = '请填写图文详情！';
      return false;
    } else {
      this.configParams.content = tempContent.replace('/\r\n/g', '').replace(/\n/g, '');
    }
    return true;
  }

  // 启用编辑
  public onEditClick(): void {
    this.isEdit = true;
    CKEDITOR.instances.serviceConfigEditor.setReadOnly(false);
  }

  // 取消编辑
  public onCancelClick(): void {
    this.isEdit = false;
    this.searchText$.next();
    CKEDITOR.instances.serviceConfigEditor.setReadOnly(true);
  }
}
