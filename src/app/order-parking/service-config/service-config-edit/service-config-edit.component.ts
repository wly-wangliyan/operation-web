
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import { ServiceConfigService, ParkingEntity, ServiceConfigParams } from '../service-config.service';


@Component({
  selector: 'app-service-config-edit',
  templateUrl: './service-config-edit.component.html',
  styleUrls: ['./service-config-edit.component.css']
})
export class ServiceConfigEditComponent implements OnInit {

  constructor(private globalService: GlobalService, private serviceConfigService: ServiceConfigService,
              private routerInfo: ActivatedRoute, private router: Router) {
  }

  public parkingDetailData: ParkingEntity = new ParkingEntity();
  public configParams: ServiceConfigParams = new ServiceConfigParams();
  public checkLabelNamesList: Array<any> = [];
  public tag = '';
  public loading = false;
  public parking_id: string;
  public origin_fee = '';
  public sale_fee = '';
  public pre_fee = '';
  public minus_fee = '';
  public tagNameErrors = '';
  public originPriceErrors = '';
  public salePriceErrors = '';
  public prePriceErrors = '';
  public minusPriceErrors = '';
  public minDaysErrors = '';
  public mainTelErrors = '';
  public standbyTelErrors = '';
  public instructionErrors = '';
  public noticeErrors = '';

  private searchText$ = new Subject<any>();

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.parking_id = params.parking_id;
    });

    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.serviceConfigService.requestParkingDetailData(this.parking_id).subscribe(res => {
        this.parkingDetailData = res;
        this.getDetailData();
        this.getEditorData(this.parkingDetailData.instruction, this.parkingDetailData.notice);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchText$.next();
  }

  // 配置详情数据处理
  private getDetailData() {
    this.checkLabelNamesList = this.parkingDetailData.tags ? this.parkingDetailData.tags : [];
    this.origin_fee = this.getFeeData(this.parkingDetailData.origin_fee);
    this.sale_fee = this.getFeeData(this.parkingDetailData.sale_fee);
    this.pre_fee = this.getFeeData(this.parkingDetailData.pre_fee);
    this.minus_fee = this.getFeeData(this.parkingDetailData.minus_fee);
    this.configParams.min_days = this.parkingDetailData.min_days;
    this.configParams.main_tel = this.parkingDetailData.main_tel;
    this.configParams.standby_tel = this.parkingDetailData.standby_tel;
  }

  // 价钱数据处理
  private getFeeData(fee: number) {
    return (fee || fee === 0) ? (Number(fee) / 100).toFixed(2) : '';
  }

  // 富文本数据处理
  private getEditorData(instruction: string, notice: string) {
    CKEDITOR.instances.orderInstructionEditor.destroy(true);
    CKEDITOR.instances.purchaseInstructionEditor.destroy(true);
    CKEDITOR.replace('orderInstructionEditor').setData(instruction);
    CKEDITOR.replace('purchaseInstructionEditor').setData(notice);
  }


  // 添加标签
  public onAddTagClick() {
    const labelList = this.checkLabelNamesList.filter(i => i.name === this.tag);
    if (this.tag === '' || this.tag === null) {
      this.tagNameErrors = '请勿添加空标签!';
    } else if (labelList.length !== 0) {
      this.tagNameErrors = '添加的标签重复!';
    } else {
      this.checkLabelNamesList.push(this.tag);
      this.tag = '';
      this.tagNameErrors = '';
    }
  }

  // 删除标签
  public onDelTag(i: number) {
    this.checkLabelNamesList.splice(i, 1);
  }

  // 保存数据
  public onSaveFormSubmit() {
    const regPhone = /^(1[3-9])\d{9}$/g;
    const regTel = /^\d{3}-\d{8}|(1[3-9])\d{9}$/g;
    if (Number(this.sale_fee) > Number(this.origin_fee)) {
      this.clear();
      this.salePriceErrors = '售价不得大于原价！';
    } else if (Number(this.pre_fee) > Number(this.sale_fee)) {
      this.clear();
      this.prePriceErrors = '预付费用不得大于售价！';
    } else if (Number(this.minus_fee) > (Number(this.sale_fee))) {
      this.clear();
      this.minusPriceErrors = '下单立减费用不得大于售价！';
    } else if (!regPhone.test(this.configParams.main_tel)) {
      this.clear();
      this.mainTelErrors = '请输入正确的常用电话！';
    } else if (!regTel.test(this.configParams.standby_tel)) {
      this.clear();
      this.standbyTelErrors = '请输入正确的备用电话！';
    } else if (this.configParams.main_tel === this.configParams.standby_tel) {
      this.clear();
      this.standbyTelErrors = '备用电话与常用电话重复！';
    } else if (!CKEDITOR.instances.orderInstructionEditor.getData()) {
      this.clear();
      this.instructionErrors = '请输入预约说明！';
    } else if (!CKEDITOR.instances.purchaseInstructionEditor.getData()) {
      this.clear();
      this.noticeErrors = '请输入购买须知！';
    } else {
      this.clear();
      this.handleParams();
      this.serviceConfigService.requestUpdateSweviceConfigData(this.configParams, this.parking_id).subscribe(() => {
        this.globalService.promptBox.open('服务配置保存成功！');
        this.searchText$.next();
        timer(2000).subscribe(() => this.router.navigateByUrl('/order-parking/service-config'));
      }, err => {
        this.handleErrorFunc(err);
      });
    }
  }

  // 清空
  private clear() {
    this.tagNameErrors = '';
    this.originPriceErrors = '';
    this.salePriceErrors = '';
    this.prePriceErrors = '';
    this.minusPriceErrors = '';
    this.minDaysErrors = '';
    this.mainTelErrors = '';
    this.standbyTelErrors = '';
    this.instructionErrors = '';
    this.noticeErrors = '';
  }

  // 处理服务配置入参
  private handleParams() {
    this.configParams.tags = this.checkLabelNamesList;
    this.configParams.origin_fee = Number(this.origin_fee) * 100;
    this.configParams.sale_fee = Number(this.sale_fee) * 100;
    this.configParams.pre_fee = Number(this.pre_fee) * 100;
    this.configParams.minus_fee = Number(this.minus_fee) * 100;
    this.configParams.instruction = CKEDITOR.instances.orderInstructionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    this.configParams.notice = CKEDITOR.instances.purchaseInstructionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
  }

  // 处理错误信息
  private handleErrorFunc(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field = content.field === 'tags' ? '标签' : content.field === 'origin_fee' ?
            '原价/日' : content.field === 'sale_fee' ? '售价/日' : content.field === 'pre_fee' ? '预付'
              : content.field === 'minus_fee' ? '下单立减' : content.field === 'main_tel' ? '常用联系电话'
                : content.field === 'standby_tel' ? '备用联系电话' : content.field === 'instruction' ? '预约说明'
                  : content.field === 'notice' ? '购买须知' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}字段输入错误`, null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('服务配置保存失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }

}
