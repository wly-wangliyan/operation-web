import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { ProCityDistSelectComponent, RegionEntity } from '../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { GlobalService } from '../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateHelper } from '../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../core/http.service';
import { DateFormatHelper, TimeItem } from '../../../../utils/date-format-helper';
import { isUndefined } from 'util';
import { SupplierManagementHttpService, WarehouseEntity } from '../supplier-management-http.service';

export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}

export class ErrPositionItem {
  sms_telephone: ErrMessageItem = new ErrMessageItem();
  run_time: ErrMessageItem = new ErrMessageItem();

  constructor(sms_telephone?: ErrMessageItem, run_time?: ErrMessageItem) {
    if (isUndefined(sms_telephone) || isUndefined(run_time)) {
      return;
    }
    this.sms_telephone = sms_telephone;
    this.run_time = run_time;
  }
}
@Component({
  selector: 'app-warehouse-edit',
  templateUrl: './warehouse-edit.component.html',
  styleUrls: ['./warehouse-edit.component.css']
})
export class WarehouseEditComponent implements OnInit {

  public currentWarehouse = new WarehouseEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public is_add_tel = true;
  public sms_telephone = [];
  public run_start_time: TimeItem = new TimeItem(); // 营业开始时间
  public run_end_time: TimeItem = new TimeItem(); //  营业结束时间

  private continueRequestSubscription: Subscription;
  private warehouse_id: string;
  private supplier_id: string;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('pagePromptDiv', {static: true}) public pagePromptDiv: ElementRef;
  @ViewChild('coverImg', {static: true}) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('projectInfoPro', {static: true}) public proCityDistSelectComponent: ProCityDistSelectComponent;

  constructor(private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private supplierHttpService: SupplierManagementHttpService,
              private router: Router) {
    activatedRoute.paramMap.subscribe(map => {
      this.warehouse_id = map.get('warehouse_id');
      this.supplier_id = map.get('supplier_id');
    });
  }

  public ngOnInit(): void {
    this.continueRequestSubscription = this.supplierHttpService.requestWarehouseDetail(this.supplier_id, this.warehouse_id)
        .subscribe(res => {
          this.currentWarehouse = res;
          const telList = res.sms_telephone ? res.sms_telephone.split(',') : [''];
          telList.forEach(value => {
            this.sms_telephone.push({tel: value, time: new Date().getTime()});
          });
          this.is_add_tel = this.sms_telephone.length >= 2 ? false : true;
          this.run_start_time = res.run_start_time ? DateFormatHelper.getMinuteOrTime(res.run_start_time) : new TimeItem();
          this.run_end_time = res.run_end_time ? DateFormatHelper.getMinuteOrTime(res.run_end_time) : new TimeItem();
          const regionObj = new RegionEntity(this.currentWarehouse);
          this.proCityDistSelectComponent.regionsObj = regionObj;
          this.proCityDistSelectComponent.initRegions(regionObj);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    if (this.verification()) {
      // 编辑商家
      const telList = this.sms_telephone.map(value => value.tel);
      this.currentWarehouse.sms_telephone = telList.join(',');
      this.currentWarehouse.st_status = this.currentWarehouse.st_status ? 1 : 2;
      this.supplierHttpService.requestEditWarehouseData(this.supplier_id, this.warehouse_id, this.currentWarehouse).subscribe(() => {
        this.globalService.promptBox.open('保存成功！', () => {
          this.router.navigate([`/supplier-management/supplier-list/${this.supplier_id}/warehouse-list`]);
        });
      }, err => {
        this.errorProcess(err);
      });
    }
  }

  // 表单提交校验
  private verification() {
    let isCheck = true;
    const run_start_time = DateFormatHelper.getSecondTimeSum(this.run_start_time);
    const run_end_time = DateFormatHelper.getSecondTimeSum(this.run_end_time);
    if (run_start_time >= run_end_time) {
      this.errPositionItem.run_time.isError = true;
      this.errPositionItem.run_time.errMes = '营业开始时间应小于结束时间！';
      isCheck = false;
    } else {
      this.currentWarehouse.run_start_time = run_start_time;
      this.currentWarehouse.run_end_time = run_end_time;
    }
    if (this.currentWarehouse.st_status === 1 && (this.sms_telephone.length === 0 || !this.sms_telephone[0].tel)) {
      this.errPositionItem.sms_telephone.isError = true;
      this.errPositionItem.sms_telephone.errMes = '短信通知已开启，请填写手机号！';
      isCheck = false;
    }
    this.sms_telephone.forEach(value => {
      if (!ValidateHelper.Telephone(value.tel)) {
        this.errPositionItem.sms_telephone.isError = true;
        this.errPositionItem.sms_telephone.errMes = '短信通知手机号格式错误！';
        isCheck = false;
      }
    });
    return isCheck;
  }

  // 取消按钮
  public onClose() {
    this.globalService.confirmationBox.open('提示', '是否确认取消编辑？', () => {
      this.globalService.confirmationBox.close();
      this.router.navigate([`/supplier-management/supplier-list/${this.supplier_id}/warehouse-list`]);
    });
  }

  // 清空
  public clear() {
    this.errPositionItem.sms_telephone.isError = false;
    this.errPositionItem.run_time.isError = false;
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'invalid' && content.field === 'title') {
            // this.errPositionItem.title.isError = true;
            // this.errPositionItem.title.errMes = '标题错误或无效！';
            return;
          }
        }
      }
    }
  }

  // 添加联系电话
  public onAddTelClick() {
    this.is_add_tel = false;
    this.sms_telephone.push({tel: '', time: new Date().getTime()});
  }

  // 移除联系电话
  public onDelTelClick(index) {
    if (this.sms_telephone.length === 1) {
      this.sms_telephone = [];
    } else {
      this.is_add_tel = true;
      this.sms_telephone.splice(index, 1);
    }
  }
}
