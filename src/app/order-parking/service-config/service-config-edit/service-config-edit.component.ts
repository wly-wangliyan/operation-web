
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
    this.checkLabelNamesList = ['标签111'];

    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.serviceConfigService.requestParkingDetailData(this.parking_id).subscribe(res => {
        this.parkingDetailData = res;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchText$.next();
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
    this.configParams.tags = this.checkLabelNamesList;
    this.configParams.instruction = CKEDITOR.instances.orderInstructionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    this.configParams.notice = CKEDITOR.instances.purchaseInstructionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    const reg = /^(1[3-9])\d{9}$/g;
    if (!reg.test(this.configParams.main_tel)) {
      this.clear();
      this.mainTelErrors = '请输入正确的常用电话！';
    } else if (!reg.test(this.configParams.main_tel)) {
      this.clear();
      this.standbyTelErrors = '请输入正确的备用电话！';
    } else if (!CKEDITOR.instances.instruction.getData()) {
      this.clear();
      this.tagNameErrors = '请输入预约说明！';
    } else if (!CKEDITOR.instances.notice.getData()) {
      this.clear();
      this.tagNameErrors = '请输入购买须知！';
    } else {
      this.clear();
      this.serviceConfigService.requestUpdateSweviceConfigData(this.configParams, this.parking_id).subscribe(() => {
        this.globalService.promptBox.open('服务配置保存成功！');
        this.searchText$.next();
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

  // 处理错误信息
  private handleErrorFunc(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field = content.field === 'tags' ? '标签' : content.field === 'origin_price' ?
            '原价/日' : content.field === 'sale_price' ? '售价/日' : content.field === 'pre_price' ? '预付'
              : content.field === 'minus_price' ? '下单立减' : content.field === 'main_tel' ? '常用联系电话'
                : content.field === 'standby_tel' ? '备用联系电话' : content.field === 'instruction' ? '预约说明'
                  : content.field === 'notice' ? '购买须知' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}输入错误`, null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('服务配置保存失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }

}
