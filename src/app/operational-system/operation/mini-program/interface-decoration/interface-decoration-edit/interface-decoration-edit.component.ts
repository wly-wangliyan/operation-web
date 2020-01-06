import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { forkJoin, fromEvent, Subscription, timer } from 'rxjs';
import {
  IconMagicContentEntity,
  IconMagicEntity,
  InterfaceDecorationService,
  LeftAndRightLayout1ContentEntity,
  LeftAndRightLayout1Entity,
  LeftAndRightLayout2Entity,
  PageEntity, SingleLineScrollingEntity,
  SingleLineScrollingProductEntity,
  SingleRowBroadcastContentEntity,
  SingleRowBroadcastEntity,
  TemplateEntity
} from '../interface-decoration.service';
import { GlobalService } from '../../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommodityEntity } from '../../../../mall/goods-management/goods-management-http.service';
import { ProductService, TicketProductEntity } from '../../../../ticket/product-management/product.service';
import { CanDeactivateComponent } from '../../../../../share/interfaces/can-deactivate-component';
import { FormIconMagicComponent } from './form-icon-magic/form-icon-magic.component';
import { FormSingleRowBroadcastComponent } from './form-single-row-broadcast/form-single-row-broadcast.component';
import { FormLeftRightLayout1Component } from './form-left-right-layout1/form-left-right-layout1.component';
import { FormLeftRightLayout2Component } from './form-left-right-layout2/form-left-right-layout2.component';
import { FormSingleLineScrollComponent } from './form-single-line-scroll/form-single-line-scroll.component';

@Component({
  selector: 'app-interface-decoration-edit',
  templateUrl: './interface-decoration-edit.component.html',
  styleUrls: ['./interface-decoration-edit.component.css']
})
export class InterfaceDecorationEditComponent implements OnInit, CanDeactivateComponent {

  public mouldList = ['ICON魔方', '单行轮播广告', '左右布局(1)', '左右布局(2)', '单行左右滑动', '商品推荐'];
  public mouldIndex = -1; // 当前选中的模板index
  public previewData: PageEntity = new PageEntity(); // 预览数据
  public templatesList: Array<TemplateEntity> = []; // 模板List
  public currentTemplate: TemplateEntity = new TemplateEntity(); // 当前选中的模板
  public modal_type: number; // 弹窗类型
  public page_id: string;

  private mouseDownSubscription: Subscription;
  private mouseMoveSubscription: Subscription;
  private mouseUpSubscription: Subscription;
  private mouseLeaveSubscription: Subscription;
  private template_ids = []; // 发布记录新的模板id集合
  private currentTemplate_old: TemplateEntity = new TemplateEntity(); // 当前选中的模板备份
  private templatesList_old: Array<TemplateEntity> = []; // 模板List备份
  private is_saved = false;

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;
  @ViewChild(FormIconMagicComponent, { static: true }) public iconMagicComponent: FormIconMagicComponent;
  @ViewChild(FormSingleRowBroadcastComponent, { static: true }) public singleRowBroadcastComponent: FormSingleRowBroadcastComponent;
  @ViewChild(FormLeftRightLayout1Component, { static: true }) public leftRightLayout1Component: FormLeftRightLayout1Component;
  @ViewChild(FormLeftRightLayout2Component, { static: true }) public leftRightLayout2Component: FormLeftRightLayout2Component;
  @ViewChild(FormSingleLineScrollComponent, { static: true }) public singleLineScrollComponent: FormSingleLineScrollComponent;

  constructor(
      private interfaceService: InterfaceDecorationService,
      private globalService: GlobalService,
      private route: ActivatedRoute,
      private router: Router,
      private productService: ProductService
  ) {
    route.paramMap.subscribe(map => {
      this.page_id = map.get('page_id');
    });
  }

  ngOnInit() {
    if (this.page_id) {
      this.requestPageDetail();
    }
  }

  // 判断是不是做过修改，如果修改过数据为保存
  public canDeactivate(): boolean {
    return (JSON.stringify(this.templatesList_old) === JSON.stringify(this.templatesList) || this.is_saved);
  }

  // 获取详情
  private requestPageDetail() {
    this.interfaceService.requestPageDetail(this.page_id).subscribe(res => {
      this.previewData = res;
      this.templatesList = res.templates;
      this.requestProduct();
      this.templatesList.forEach((value, index) => {
        value.template_content.left_image = value.template_content.left_image ? value.template_content.left_image.split(',') : [];
        value.template_content.right_top_image = value.template_content.right_top_image ? value.template_content.right_top_image.split(',') : [];
        value.template_content.right_bottom_image = value.template_content.right_bottom_image ? value.template_content.right_bottom_image.split(',') : [];
        if (value.template_content.contents) {
          value.template_content.contents.forEach(value1 => {
            value1.image = value1.image ? value1.image.split(',') : [];
            value1.left_image = value1.left_image ? value1.left_image.split(',') : [];
            value1.right_image = value1.right_image ? value1.right_image.split(',') : [];
          });
        }
        // 未查询出商品时，生成假数据
        if (Number(value.template_type) === 5) {
          for (let i = 0; i < 3; i++) {
            value.template_content.mallProducts.push(new CommodityEntity());
            value.template_content.ticketProducts.push(new TicketProductEntity());
          }
        } else if (Number(value.template_type) === 6) {
          value.template_content.mallProducts.push(new CommodityEntity());
          value.template_content.ticketProducts.push(new TicketProductEntity());
        }
      });
      this.templatesList_old = JSON.parse(JSON.stringify(this.templatesList));
    }, error => {
      this.globalService.httpErrorProcess(error);
    });
  }

  // 获取票务、商城商品信息
  private requestProduct() {
    const mallProduct_ids = [];
    const ticketProductHttpList = [];
    const templatesList = this.templatesList.filter(value => value.template_type > 4);
    const products = templatesList.map(value => value.template_content.products);
    products.forEach(value => {
      value.forEach(value1 => {
        if (value1.product_type === '1') {
          mallProduct_ids.push(value1.product_id);
        } else {
          ticketProductHttpList.push(this.productService.requestProductsDetail(value1.product_id));
        }
      });
    });
    if (mallProduct_ids.length > 0) {
      this.requestMallProductAll(mallProduct_ids.join(','));
    }
    if (ticketProductHttpList.length > 0) {
      this.requestTicketProductAll(ticketProductHttpList);
    }
  }

  // 获取全部商城商品信息
  private requestMallProductAll(product_id: string) {
    const params = {commodity_ids: product_id};
    this.interfaceService.requestProductList(params).subscribe(res => {
      const templatesList = this.templatesList.filter(value => value.template_type > 4);
      if (res.length > 0) {
        this.templatesList.forEach((value1, index1) => {
          const mallProducts = [];
          res.forEach(value => {
            if (value1.template_content.products) {
              value1.template_content.products.forEach(value2 => {
                const product_ids = mallProducts.map(v => v.commodity_id);
                if (value2.product_type === '1' && value.commodity_id === value2.product_id && !product_ids.includes(value.commodity_id)) {
                  mallProducts.push(value);
                  this.onProductTitleChange(index1);
                }
              });
            }
          });
          value1.template_content.mallProducts = mallProducts;
        });
        this.templatesList_old = JSON.parse(JSON.stringify(this.templatesList));
      } else {
        templatesList.forEach(value1 => {
          value1.template_content.mallProducts.push(new CommodityEntity());
        });
      }
    }, error => {
      this.globalService.httpErrorProcess(error);
    });
  }

  // 获取全部票务商品信息
  private requestTicketProductAll(ticketProductHttpList: Array<any>) {
    forkJoin(ticketProductHttpList).subscribe( res => {
      this.templatesList.forEach((value1, index1) => {
        const ticketProducts = [];
        res.forEach(value => {
          if (value1.template_content.products) {
            value1.template_content.products.forEach(value2 => {
              const product_id = ticketProducts.map(v => v.product_id);
              if (value2.product_type === '2' && value.product_id === value2.product_id && !product_id.includes(value.product_id)) {
                ticketProducts.push(value);
                this.onProductTitleChange(index1);
              }
            });
          }
        });
        value1.template_content.ticketProducts = ticketProducts;
        if (res.length === 0 && Number(value1.template_type) >= 5) {
          value1.template_content.ticketProducts.push(new TicketProductEntity());
        }
      });
      this.templatesList_old = JSON.parse(JSON.stringify(this.templatesList));
    }, error => {
      this.globalService.httpErrorProcess(error);
    });
  }

  // 图片拖拽功能
  private drag(index: number) {
    // box是装图片的容器,fa是图片移动缩放的范围,scale是控制缩放的小图标
    const box = document.getElementById('box' + index);
    const fa = document.getElementById('father' + index);
    // 图片移动效果
    this.mouseDownSubscription = fromEvent(box, 'mousedown').subscribe((e: any) => {
      let oEvent = e;
      // 浏览器有一些图片的默认事件,这里要阻止
      oEvent.preventDefault();
      const disX = oEvent.clientX - box.offsetLeft;
      this.mouseMoveSubscription = fromEvent(fa, 'mousemove').subscribe((ev: any) => {
        oEvent = ev;
        oEvent.preventDefault();
        let x = oEvent.clientX - disX;
        // 图形移动的边界判断
        x = x > 350 ? 350 : x;
        x = x < 720 - box.offsetWidth ? 720 - box.offsetWidth : x;
        box.style.left = x + 'px';
      });
      this.mouseLeaveSubscription = fromEvent(fa, 'mouseleave').subscribe(() => {
        this.mouseMoveSubscription.unsubscribe();
      });
      this.mouseUpSubscription = fromEvent(fa, 'mouseup').subscribe(() => {
        this.mouseMoveSubscription.unsubscribe();
      });
    });
  }

  // 创建模板
  public onCreateMould(type: number) {
    if (this.templatesList.length >= 20) {
      return;
    }
    const template = new TemplateEntity();
    template.template_type = type;
    switch (template.template_type) {
      case 1:
        template.template_content = new IconMagicEntity();
        break;
      case 2:
        template.template_content = new SingleRowBroadcastEntity();
        break;
      case 3:
        template.template_content = new LeftAndRightLayout1Entity();
        break;
      case 4:
        template.template_content = new LeftAndRightLayout2Entity();
        break;
      case 5:
        template.template_content = new SingleLineScrollingEntity();
        break;
      case 6:
        template.template_content = new SingleLineScrollingEntity();
        break;
    }
    this.onImgNumChange(template);
    this.templatesList.push(template);
  }

  // 创建模板初始化数据
  public onImgNumChange(template: TemplateEntity): TemplateEntity {
    const contentsList = [];
    const productsList = [];
    if (template.template_type === 1) {
      for (let i = 0; i < template.template_content.count; i++) {
        const contents = new IconMagicContentEntity();
        contents.image = [];
        contentsList.push(contents);
        template.template_content.contents.push(contents);
      }
    } else if (template.template_type === 5 || template.template_type === 6) {
      template.template_content.mallProducts = [];
      template.template_content.ticketProducts = [];
      const count = template.template_type === 5 ? 3 : 1;
      for (let i = 0; i < count; i++) {
        const product = new SingleLineScrollingProductEntity();
        product.product_id = '';
        productsList.push(product);
        template.template_content.mallProducts.push(new CommodityEntity());
        template.template_content.ticketProducts.push(new TicketProductEntity());
      }
      template.template_content.products = productsList;
    } else if (template.template_type === 2 || template.template_type === 3) {
      let contents;
      switch (template.template_type) {
        case 2:
          contents = new SingleRowBroadcastContentEntity();
          break;
        case 3:
          contents = new LeftAndRightLayout1ContentEntity();
          break;
      }
      contents.image = [];
      contentsList.push(contents);
      template.template_content.contents = contentsList;
      return template;
    }
  }

  // 模板Form表单提交
  public onEditFormSubmit(saveData: any) {
    if (!this.currentTemplate.template_id || (this.previewData.page_type === 2 && !this.template_ids.includes(this.currentTemplate.template_id))) {
      this.interfaceService.requestCreateTemplateData(saveData).subscribe(res => {
        this.currentTemplate.template_id = res.body.template_id;
        this.template_ids.push(res.body.template_id);
        this.mouldIndex = -1;
        this.globalService.promptBox.open('保存成功！');
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    } else {
      this.interfaceService.requestUpdateTemplateData(saveData, this.currentTemplate.template_id).subscribe(res => {
        this.mouldIndex = -1;
        this.globalService.promptBox.open('保存成功！');
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 选中编辑模板
  public onMouldEditClick(type: number, index: number) {
    if (this.mouldIndex === index) {
      return;
    }
    this.onCancelClick();
    this.currentTemplate = this.templatesList[index];
    this.currentTemplate_old = JSON.parse(JSON.stringify(this.currentTemplate));
    this.currentTemplate.template_type = type;
    this.mouldIndex = index;
    switch (type) {
      case 1:
        this.iconMagicComponent.initForm(this.currentTemplate);
        break;
      case 2:
        this.singleRowBroadcastComponent.initForm(this.currentTemplate);
        break;
      case 3:
        this.leftRightLayout1Component.initForm(this.currentTemplate);
        break;
      case 4:
        this.leftRightLayout2Component.initForm(this.currentTemplate);
        break;
      default:
        this.drag(index);
        this.singleLineScrollComponent.initForm(this.currentTemplate);
        break;
    }
    timer(0).subscribe(() => {
      this.moveForm(type, index);
    });
  }

  // 取消编辑模板
  public onCancelClick() {
    this.currentTemplate = new TemplateEntity();
    if (this.mouldIndex <= this.templatesList.length - 1 && this.mouldIndex > -1) {
      this.templatesList[this.mouldIndex] = this.currentTemplate_old;
    }
    this.mouldIndex = -1;
  }

  // 移动编辑Form位置
  private moveForm(type: number, index: number) {
    const form = document.getElementById('form');
    const temp = document.getElementById(`template_${type}_${index}`);
    if (form && temp) {
      form.style.top = (temp.offsetTop - 135) + 'px';
    }
  }

  // 向上移动
  public onUpClick() {
    if (this.mouldIndex > 0) {
      this.templatesList[this.mouldIndex] = this.templatesList.splice(this.mouldIndex - 1, 1, this.templatesList[this.mouldIndex])[0];
      this.mouldIndex -= 1;
      timer(0).subscribe(() => {
        this.moveForm(this.currentTemplate.template_type, this.mouldIndex);
      });
    }
  }

  // 向下移动
  public onDownClick() {
    if (this.mouldIndex < this.templatesList.length - 1) {
      this.templatesList[this.mouldIndex] = this.templatesList.splice(this.mouldIndex + 1, 1, this.templatesList[this.mouldIndex])[0];
      this.mouldIndex += 1;
      timer(0).subscribe(() => {
        this.moveForm(this.currentTemplate.template_type, this.mouldIndex);
      });
    }
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public onCloseModal() {
    $(this.promptDiv.nativeElement).modal('hide');
  }

  // 删除模板
  public onDeleteTemplateClick() {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.templatesList.splice(this.mouldIndex, 1);
      this.mouldIndex = -1;
    });
  }

  /**
   * 保存草稿、保存并发布校验
   * @returns boolean
   */
  public CheckSaveDraftValid(type: number): boolean {
    let checkValid = true;
    if (JSON.stringify(this.templatesList_old) === JSON.stringify(this.templatesList) && type === 1) {
      checkValid = false;
    } else if (this.templatesList.findIndex(value => !value.template_id) > -1 || this.templatesList.length === 0) {
      checkValid = false;
    }
    return checkValid;
  }

  // 保存草稿
  public onSaveDraftClick() {
    this.modal_type = 1;
    $(this.promptDiv.nativeElement).modal('show');
  }

  // 保存并发布
  public onReleaseClick() {
    this.globalService.confirmationBox.open('提示', '确认要发布吗？发布后可在发布记录中查看此记录!', () => {
      this.globalService.confirmationBox.close();
      this.modal_type = 2;
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 保存草稿/发布
  public onSaveTitle() {
    const tip = this.previewData.page_type === 1 ? '保存草稿成功！' : '保存并发布成功！';
    const params = {category: 1,
      page_name: this.previewData.page_name,
      page_content: this.templatesList.map(v => v.template_id).join(',')};
    if (!this.page_id) {
      // 保存草稿
      this.requestCreatePage(params);
    } else if (this.previewData.page_type === 1) {
      // 更新草稿
      this.interfaceService.requestUpdatePageData(params, this.page_id).subscribe(res => {
        if (this.modal_type === 1) {
          this.successFunc(tip);
        } else {
          this.requestPageReleaseData(this.page_id);
        }
      }, error => {
        this.globalService.httpErrorProcess(error);
      });
    } else {
      this.requestCopyPage();
    }
  }

  // copy草稿信息
  private requestCopyPage() {
    const templateList = this.templatesList.map(v => v.template_id);
    const template_id = templateList.filter(key => !this.template_ids.includes(key));
    if (template_id.length > 0) {
      const params = {template_ids: template_id.join(',')};
      this.interfaceService.requestCopyPageData(params).subscribe(res => {
        const save_template_ids = res.body.new_template_ids.split(',');
        this.template_ids.forEach(value => {
          const index = templateList.findIndex(v => v === value);
          save_template_ids.splice(index, 0, value);
        });
        const copyParams = {category: 1,
          page_name: this.previewData.page_name,
          page_content: save_template_ids.join(',')};
        this.requestCreatePage(copyParams);
      }, error => {
        this.globalService.httpErrorProcess(error);
      });
    } else {
      const copyParams = {category: 1,
        page_name: this.previewData.page_name,
        page_content: templateList.join(',')};
      this.requestCreatePage(copyParams);
    }
  }

  // 创建草稿
  private requestCreatePage(params: any) {
    this.interfaceService.requestCreatePageData(params).subscribe(res => {
      if (this.modal_type === 1) {
        this.successFunc('保存草稿成功！');
      } else {
        this.page_id = res.body.page_id;
        this.requestPageReleaseData(res.body.page_id);
      }
    }, error => {
      this.globalService.httpErrorProcess(error);
    });
  }

  // 发布
  private requestPageReleaseData(page_id: string) {
    this.interfaceService.requestPageReleaseData(page_id).subscribe(res => {
      this.successFunc('保存并发布成功！');
    }, error => {
      this.globalService.httpErrorProcess(error);
    });
  }

  // 成功回调
  private successFunc(tip: string) {
    this.is_saved = true;
    $(this.promptDiv.nativeElement).modal('hide');
    this.globalService.promptBox.open(tip);
    this.router.navigate(['/main/operation/mini-program/interface-decoration/record-list'], {queryParams: {page_type: this.modal_type}});
  }

  // 产品名称改变，高度变化
  public onProductTitleChange(index: number = this.mouldIndex) {
    if (this.templatesList[index].template_content.products[0].product_type === '1') {
      if (this.templatesList[index].template_content.title) {
        this.templatesList[index].template_content.height = 233;
      } else {
        this.templatesList[index].template_content.height = 193;
      }
    } else {
      if (this.templatesList[index].template_content.title) {
        this.templatesList[index].template_content.height = 173;
      } else {
        this.templatesList[index].template_content.height = 133;
      }
    }
  }
}
