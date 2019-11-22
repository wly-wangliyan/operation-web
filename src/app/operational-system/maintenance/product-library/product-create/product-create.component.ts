import { Component, OnInit, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../core/global.service';
import { ProductLibraryHttpService, ProductEntity } from '../product-library-http.service';
import { ProjectDialogComponent } from '../../../../share/components/project-dialog/project-dialog.component';
import { ProjectCategory } from '../../../../share/pipes/project-type.pipe';
import { SelectBrandFirmComponent } from '../../../../share/components/select-brand-firm/select-brand-firm.component';
import { HttpErrorEntity } from 'src/app/core/http.service';

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
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  public isCreateProduct = true; // 标记新建

  public title = '新建产品'; // 路由标题

  private product_id: string; // 产品id

  public productRecord: ProductEntity = new ProductEntity(); // 产品 新建/编辑参数

  private projectCategory = ProjectCategory;

  public projectTypes = [1, 2]; // 项目类型 1:配件 2:服务

  public productErrMsg = ''; // 错误信息

  public cover_url = []; // 图片集合

  public selectedCategory: number; // 所属项目》所属项目类别

  public selectedProjectid: string; // 所属项目》所属项目 》项目id

  public selectedBrandId: string; // 所属厂商 》品牌

  public selectedFirmId: string; // 所属厂商 》厂商

  public selected_project_info: string; // 所属项目信息

  public selected_brand_firm_info: string; // 所属厂商信息

  public errPositionItem: ErrPositionItem = new ErrPositionItem(); // 添加图片错误信息

  @ViewChild('productImg', { static: false }) public productImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild(ProjectDialogComponent, { static: true }) public projectDialogComponent: ProjectDialogComponent;
  @ViewChild(SelectBrandFirmComponent, { static: true }) public selectBrandFirmComponent: SelectBrandFirmComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private productLibraryService: ProductLibraryHttpService) {
    this.route.paramMap.subscribe(map => {
      this.product_id = map.get('product_id');
    });
  }

  public ngOnInit() {
    if (this.product_id) {
      this.isCreateProduct = false;
      this.title = '编辑产品';
      this.getProductDetail();
    } else {
      this.isCreateProduct = true;
    }
  }

  // 获取产品详情
  private getProductDetail(): void {
    this.productLibraryService.requestProductDetailData(this.product_id).subscribe(data => {
      this.productRecord = data;
      if (this.productRecord) {
        this.initForm();
      }
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 初始化编辑表单
  private initForm(): void {
    this.selectedCategory = this.productRecord.upkeep_item.upkeep_item_category;
    this.selectedProjectid = this.productRecord.upkeep_item.upkeep_item_id;
    this.selected_project_info = this.productRecord.upkeep_item ?
      (this.projectCategory[this.productRecord.upkeep_item.upkeep_item_category] + ' > '
        + this.productRecord.upkeep_item.upkeep_item_name) : null;
    this.productRecord.upkeep_item_id = this.productRecord.upkeep_item.upkeep_item_id;
    this.productRecord.upkeep_accessory_type = this.productRecord.upkeep_item.upkeep_item_type;
    this.cover_url = this.productRecord.image_url ? this.productRecord.image_url.split(',') : [];
    if (this.productRecord.upkeep_accessory_type === this.projectTypes[0]) {
      // 原厂配件需要初始化厂商信息
      if (this.productRecord.is_original) {
        this.selectedBrandId = this.productRecord.vehicle_brand.vehicle_brand_id;
        this.selectedFirmId = this.productRecord.vehicle_firm.vehicle_firm_id;
        this.productRecord.vehicle_brand_id = this.productRecord.vehicle_brand.vehicle_brand_id;
        this.productRecord.vehicle_firm_id = this.productRecord.vehicle_firm.vehicle_firm_id;
        this.selected_brand_firm_info = this.productRecord.vehicle_brand ? (this.productRecord.vehicle_brand.vehicle_brand_name + '·'
          + this.productRecord.vehicle_firm.vehicle_firm_name) : null;
      }
    }
  }

  // 清除错误信息
  public onClearErrMsg(): void {
    this.productErrMsg = '';
  }

  // 打开所属项目选择组件
  public onOpenProjectModal(): void {
    this.onClearErrMsg();
    this.projectDialogComponent.open();
  }

  // 选择所属项目回调函数
  public onSelectedProject(event: any): void {
    if (event) {
      this.selectedProjectid = event.project.upkeep_item_id;
      this.productRecord = new ProductEntity();
      this.selected_brand_firm_info = null;
      this.cover_url = [];
      this.productRecord.upkeep_item_id = event.project.upkeep_item_id;
      this.productRecord.upkeep_accessory_type = event.project.upkeep_item_type;
      this.selectedCategory = event.category;
      this.selected_project_info = this.projectCategory[event.category] + ' > ' + event.project.upkeep_item_name;
    }
  }

  // 变更是否原厂
  public onChangeOriginal(event: any): void {
    this.productRecord.is_original = event.target.value === 'false' ? false : true;
    if (!this.productRecord.is_original) {
      this.selectedBrandId = null;
      this.selectedFirmId = null;
      this.selected_brand_firm_info = null;
      this.productRecord.is_brand_special = false;
    } else {
      this.productRecord.brand_instruction = null;
    }
  }

  // 打开所属厂商选择组件
  public onOpenBrandFirmModal(): void {
    this.onClearErrMsg();
    this.selectBrandFirmComponent.open();
  }

  // 选择所属厂商回调函数
  public onSelectedBrandFirm(event: any): void {
    if (event && event.firm) {
      const firm = event.firm[0];
      const brand = firm.vehicle_brand;
      this.productRecord.vehicle_brand_id = brand.vehicle_brand_id;
      this.selectedBrandId = brand.vehicle_brand_id;
      this.productRecord.vehicle_firm_id = firm.vehicle_firm_id;
      this.selectedFirmId = firm.vehicle_firm_id;
      this.selected_brand_firm_info = brand.vehicle_brand_name + '·' + firm.vehicle_firm_name;
    }
  }

  public onSelectedPicture(event: any): void {
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
  public onAmountChange(event: any): void {
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
  public onNumberKeyUp(): void {
    if (this.productRecord.number) {
      this.productRecord.number = Number(this.productRecord.number);
    }
  }

  // 键盘按下事件
  public onKeydownEvent(event: any): any {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 点击保存按钮
  public onEditFormSubmit(): void {
    this.onClearErrMsg();
    this.productImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.productImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.productRecord.image_url = imageUrl.join(',');
      if (this.generateAndCheckParamsValid()) {
        if (this.isCreateProduct) {
          this.requestAddProduct();
        } else {
          this.requestUpdateProduct();
        }
      }
    }, err => {
      this.upLoadErrMsg(err);
    });
  }

  // 添加
  private requestAddProduct(): void {
    this.productLibraryService.requestAddProductData(this.productRecord).subscribe(res => {
      this.globalService.promptBox.open('保存成功', () => {
        this.router.navigate(['../list'], { relativeTo: this.route });
      });
    }, err => {
      this.errorProcess(err);
    });
  }

  // 编辑
  private requestUpdateProduct(): void {
    this.productLibraryService.requestUpdateProductData(this.productRecord, this.product_id).subscribe(res => {
      this.globalService.promptBox.open('保存成功', () => {
        this.router.navigate(['../../list'], { relativeTo: this.route });
      });
    }, err => {
      this.errorProcess(err);
    });
  }

  /** 校验项目新增参数是否合法 */
  private generateAndCheckParamsValid(): boolean {

    if (!this.productRecord.upkeep_item_id || !this.selected_project_info || !this.productRecord.upkeep_accessory_type) {
      this.productErrMsg = '请选择所属项目！';
      return false;
    }

    // if (!this.productRecord.image_url) {
    //   this.productErrMsg = '请上传图片！';
    //   return false;
    // }

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
  private upLoadErrMsg(err: any): void {
    if (err.status === 422) {
      this.globalService.promptBox.open('参数错误，可能文件格式错误！', null, 2000, null, false);
    } else if (err.status === 413) {
      this.globalService.promptBox.open('上传资源文件太大，服务器无法保存！', null, 2000, null, false);
    } else {
      this.globalService.httpErrorProcess(err);
    }
  }
  // 接口错误信息处理
  private errorProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.resource === 'object' && content.code === 'already_existed') {
            this.productErrMsg = '此配置已存在！';
            return;
          } else {
            this.globalService.promptBox.open('参数错误或无效！', null, 2000, null, false);
          }
        }
      }
    }
  }

  // 取消编辑
  public onCancelClick(): void {
    if (this.isCreateProduct) {
      this.router.navigate(['../list'], { relativeTo: this.route });
    } else {
      window.history.back();
    }
  }
}
