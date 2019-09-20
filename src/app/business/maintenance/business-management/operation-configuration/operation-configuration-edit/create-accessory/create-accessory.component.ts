import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProductEntity, ProductLibraryHttpService } from '../../../../product-library/product-library-http.service';
import { ProjectCategory } from '../../../../../../share/pipes/project-type.pipe';
import { ZPhotoSelectComponent } from '../../../../../../share/components/z-photo-select/z-photo-select.component';
import { ProjectDialogComponent } from '../../../../../../share/components/project-dialog/project-dialog.component';
import { SelectBrandFirmComponent } from '../../../../../../share/components/select-brand-firm/select-brand-firm.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../../core/http.service';
import { isNullOrUndefined } from 'util';

export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isNullOrUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}
export class ErrPositionItem {
  icon: ErrMessageItem = new ErrMessageItem();
  ic_name: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, ic_name?: ErrMessageItem, corner?: ErrMessageItem) {
    if (isNullOrUndefined(icon) || isNullOrUndefined(ic_name)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
  }
}

@Component({
  selector: 'app-create-accessory',
  templateUrl: './create-accessory.component.html',
  styleUrls: ['./create-accessory.component.css']
})
export class CreateAccessoryComponent implements OnInit {

  public productRecord: ProductEntity = new ProductEntity(); // 产品 新建/编辑参数

  private projectCategory = ProjectCategory;

  public projectTypes = [1, 2]; // 项目类型 1:配件 2:服务

  public productErrMsg = ''; // 错误信息

  public cover_url = []; // 图片集合

  public selectedCategory: number; // 所属项目》所属项目类别

  public selected_project_info: string; // 所属项目信息

  public selected_brand_firm_info: string; // 所属厂商信息

  public errPositionItem: ErrPositionItem = new ErrPositionItem();

  public selectedProjectid: string; // 所属项目》所属项目 》项目id

  @ViewChild('productImg', { static: false }) public productImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild(ProjectDialogComponent, { static: true }) public projectDialogComponent: ProjectDialogComponent;
  @ViewChild(SelectBrandFirmComponent, { static: true }) public selectBrandFirmComponent: SelectBrandFirmComponent;

  @Output('saveSuccess') public saveSuccess = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private productLibraryService: ProductLibraryHttpService) {
  }

  public ngOnInit() {
  }

  // 清除错误信息
  public onClearErrMsg() {
    this.productErrMsg = '';
  }

  // 清除无关参数
  private clearParams() {
    this.productRecord.upkeep_item = null;
    this.productRecord.vehicle_brand = null;
    this.productRecord.vehicle_firm = null;
    this.productRecord.created_time = null;
    this.productRecord.updated_time = null;
    this.productRecord.upkeep_merchants = null;
    if (this.productRecord.upkeep_accessory_type === this.projectTypes[1]) {
      this.productRecord.is_original = null;
      this.productRecord.vehicle_brand_id = null;
      this.productRecord.vehicle_firm_id = null;
      this.productRecord.is_brand_special = null;
      this.productRecord.serial_number = null; // 零件编号
      this.productRecord.specification = null; // 规格
      this.productRecord.number = null; // 所需数量
    }
  }

  public open(event) {
    this.selectedProjectid = event.upkeep_merchant_project_id;
    this.productRecord = new ProductEntity();
    this.selected_brand_firm_info = null;
    this.cover_url = [];
    this.productRecord.upkeep_item_id = event.upkeep_handbook_item.item_id;
    this.productRecord.upkeep_accessory_type = event.upkeep_handbook_item.upkeep_item_type;
    this.selectedCategory = event.upkeep_handbook_item.item_category;
    this.selected_project_info = this.projectCategory[event.upkeep_handbook_item.item_category]
      + ' > ' + event.upkeep_handbook_item.item_name;
  }

  // 变更是否原厂
  public onChangeOriginal(event: any) {
    this.productRecord.is_original = event.target.value === 'false' ? false : true;
  }

  // 打开所属厂商选择组件
  public onOpenBrandFirmModal() {
    this.onClearErrMsg();
    this.selectBrandFirmComponent.open();
  }

  // 选择所属厂商回调函数
  public onSelectedBrandFirm(event: any) {
    if (event && event.firm) {
      const firm = event.firm[0];
      const brand = firm.vehicle_brand;
      this.productRecord.vehicle_brand_id = brand.vehicle_brand_id;
      this.productRecord.vehicle_firm_id = firm.vehicle_firm_id;
      this.selected_brand_firm_info = brand.vehicle_brand_name + '·' + firm.vehicle_firm_name;
    }
  }

  public onSelectedPicture(event: any) {
    this.onClearErrMsg();
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 格式化金额
  public onAmountChange(event: any) {
    if (!isNaN(parseFloat(String(event.target.value)))) {
      const amount = parseFloat(String(event.target.value)).toFixed(2);
      event.target.value = parseFloat(amount);
    } else {
      event.target.value = null;
    }
  }

  /** 金额 keyup 事件 */
  public onMoneyKeyUp() {
    if (this.productRecord.original_amount) {
      if (isNaN(parseFloat(String(this.productRecord.original_amount)))) {
        this.productRecord.original_amount = null;
      } else {
        const original_amount = parseFloat(String(this.productRecord.original_amount)).toFixed(2);
        this.productRecord.original_amount = parseFloat(original_amount);
      }
    }

    if (this.productRecord.sale_amount) {
      if (isNaN(parseFloat(String(this.productRecord.sale_amount)))) {
        this.productRecord.sale_amount = null;
      } else {
        const sale_amount = parseFloat(String(this.productRecord.sale_amount)).toFixed(2);
        this.productRecord.sale_amount = parseFloat(sale_amount);
      }
    }
  }

  /** 所需数量keyup事件 */
  public onNumberKeyUp() {
    if (this.productRecord.number) {
      this.productRecord.number = Number(this.productRecord.number);
    }
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 点击保存按钮
  public onEditFormSubmit() {
    this.onClearErrMsg();
    this.clearParams();
    if (this.productImgSelectComponent.imageList.length > 0) {
      this.productImgSelectComponent.upload().subscribe(() => {
        const imageUrl = this.productImgSelectComponent.imageList.map(i => i.sourceUrl);
        this.productRecord.image_url = imageUrl.join(',');
        if (this.generateAndCheckParamsValid()) {
          this.requestAddProduct();
        }
      }, err => {
        this.upLoadErrMsg(err);
      });
    } else {
      if (this.generateAndCheckParamsValid()) {
        this.requestAddProduct();
      }
    }
  }

  // 添加
  private requestAddProduct() {
    this.productLibraryService.requestAddProductData(this.productRecord).subscribe(res => {
      this.globalService.promptBox.open('保存成功', () => {
        this.saveSuccess.emit();
      });
    }, err => {
      this.errorProcess(err);
    });
  }

  /** 校验项目新增参数是否合法 */
  private generateAndCheckParamsValid(): boolean {

    if (!this.productRecord.upkeep_item_id || !this.selected_project_info) {
      this.productErrMsg = '请选择所属项目！';
      return false;
    }

    if (!this.productRecord.original_amount || Number(this.productRecord.original_amount) === 0) {
      this.productErrMsg = '原价应大于0！';
      return false;
    }

    if (!this.productRecord.sale_amount || Number(this.productRecord.sale_amount) === 0) {
      this.productErrMsg = '销售单价应大于0！';
      return false;
    }

    if (this.productRecord.original_amount < this.productRecord.sale_amount) {
      this.productErrMsg = '原价不能小于销售单价！';
      return false;
    }


    if (this.productRecord.upkeep_accessory_type === this.projectTypes[0]) {
      if (this.productRecord.is_original) {
        if (!this.selected_brand_firm_info || !this.productRecord.vehicle_brand_id || !this.productRecord.vehicle_firm_id) {
          this.productErrMsg = '请选择所属厂商！';
          return false;
        }
      }

      if (!this.productRecord.number || this.productRecord.number === 0) {
        this.productErrMsg = '所需数量应为1-99！';
        return false;
      }
    }

    return true;
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any) {
    if (err.status === 422) {
      this.globalService.promptBox.open('参数错误，可能文件格式错误！');
    } else if (err.status === 413) {
      this.globalService.promptBox.open('上传资源文件太大，服务器无法保存！');
    } else {
      this.globalService.httpErrorProcess(err);
    }
  }
  // 接口错误信息处理
  private errorProcess(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.resource === 'object' && content.code === 'already_existed') {
            this.productErrMsg = '此配置已存在！';
            return;
          } else {
            this.productErrMsg = '参数错误或无效！';
          }
        }
      }
    }
  }
}
