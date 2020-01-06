import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  InterfaceDecorationService,
  SingleLineScrollingProductEntity,
  TemplateEntity
} from '../../interface-decoration.service';
import { ProductService, TicketProductEntity } from '../../../../../ticket/product-management/product.service';
import { CommodityEntity } from '../../../../../mall/goods-management/goods-management-http.service';
import { GlobalService } from '../../../../../../core/global.service';

@Component({
  selector: 'app-form-single-line-scroll',
  templateUrl: './form-single-line-scroll.component.html',
  styleUrls: ['./form-single-line-scroll.component.css']
})
export class FormSingleLineScrollComponent implements OnInit {

  public currentTemplate: TemplateEntity = new TemplateEntity(); // 当前选中的模板
  public imgReg = /(jpg|jpeg|png|gif)$/;
  public canSave = true;

  @Output('cancelEdit') public cancelEdit = new EventEmitter();
  @Output('saveTemplate') public saveTemplate = new EventEmitter();
  @Output('productTitleChange') public productTitleChange = new EventEmitter();

  constructor(private interfaceService: InterfaceDecorationService,
              private globalService: GlobalService,
              private productService: ProductService) { }

  ngOnInit() {
  }

  public initForm(currentTemplate: TemplateEntity) {
    this.currentTemplate = currentTemplate;
  }

  // 删除模板内容信息
  public onDelContentClick(index: number) {
    this.canSave = true;
    this.currentTemplate.template_content.products.splice(index, 1);
    this.currentTemplate.template_content.mallProducts.splice(index, 1);
    this.currentTemplate.template_content.ticketProducts.splice(index, 1);
  }

  // 产品名称改变，高度变化
  public onProductTitleChange() {
    this.productTitleChange.emit();
  }

  // 跳转类型改变
  public onProductTypeChange() {
    this.currentTemplate.template_content.products.forEach(value => {
      value.product_id = '';
      value.errMsg = '';
      value.product_type = this.currentTemplate.template_content.products[0].product_type;
    });
    this.onProductTitleChange();
    const ticketProducts = [];
    const mallProducts = [];
    this.currentTemplate.template_content.products.forEach(value => {
      ticketProducts.push(new TicketProductEntity());
      mallProducts.push(new CommodityEntity());
    });
    this.currentTemplate.template_content.ticketProducts = ticketProducts;
    this.currentTemplate.template_content.mallProducts = mallProducts;
  }

  // 产品ID改变, 获取商品信息, 校验重复
  public onProductChange(product_id: string, index: number) {
    this.currentTemplate.template_content.products[index].errMsg = '';
    if (product_id) {
      const product_ids = this.currentTemplate.template_content.products.map(v => v.product_id);
      const count = product_ids.filter(v => v === product_id);
      if (count.length > 1) {
        this.currentTemplate.template_content.products[index].errMsg = '此跳转内容id重复！';
      } else if (this.currentTemplate.template_content.products[0].product_type === '1') {
        this.requestProductList(product_id, index);
      } else {
        this.requestProductsDetail(product_id, index);
      }
    }
  }

  // 获取商城商品
  private requestProductList(product_id: string, index: number) {
    const params = {commodity_ids: product_id};
    this.interfaceService.requestProductList(params).subscribe(res => {
      if (res.length === 0) {
        this.currentTemplate.template_content.products[index].errMsg = '此跳转内容id无效！';
      } else {
        this.canSave = true;
        this.currentTemplate.template_content.mallProducts[index] = res[0];
      }
    }, error => {
      this.globalService.httpErrorProcess(error);
    });
  }

  // 获取票务产品详情
  private requestProductsDetail(product_id: any, index: number) {
    this.productService.requestProductsDetail(product_id).subscribe(res => {
      if (!res.product_id) {
        this.currentTemplate.template_content.products[index].errMsg = '此跳转内容id无效！';
      } else {
        this.canSave = true;
        this.currentTemplate.template_content.ticketProducts[index] = res;
      }
    }, error => {
      this.currentTemplate.template_content.products[index].errMsg = '此跳转内容id无效！';
    });
  }

  // 添加商品id
  public onAddProductClick() {
    if (this.CheckSaveTempValid) {
      const product = new SingleLineScrollingProductEntity();
      product.product_id = '';
      this.currentTemplate.template_content.mallProducts.push(new CommodityEntity());
      this.currentTemplate.template_content.ticketProducts.push(new TicketProductEntity());
      this.currentTemplate.template_content.products.push(product);
    }
  }

  // 取消编辑模板
  public onCancelClick() {
    this.currentTemplate = new TemplateEntity();
    this.cancelEdit.emit();
  }

  // 模板Form表单提交
  public onEditFormSubmit() {
    this.currentTemplate.template_content.products.forEach(value => {
      value.product_type = this.currentTemplate.template_content.products[0].product_type;
    });
    const saveData = JSON.parse(JSON.stringify(this.currentTemplate));
    delete saveData.template_content.ticketProducts;
    delete saveData.template_content.mallProducts;
    delete saveData.height;
    saveData.template_content = JSON.stringify(saveData.template_content);
    this.saveTemplate.emit(saveData);
  }

  // 校验保存按钮
  public get CheckSaveTempValid(): boolean {
    let checkValid = true;
    if (!this.canSave) {
      checkValid = false;
    } else if (this.currentTemplate.template_content.products.findIndex(value => value.errMsg !== '') > -1) {
      checkValid = false;
    }
    return checkValid;
  }
}
