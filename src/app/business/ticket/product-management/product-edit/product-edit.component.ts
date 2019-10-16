import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { isUndefined } from 'util';
import { Subject, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { ProductService, TicketProductEntity } from '../product.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { HttpErrorEntity } from '../../../../core/http.service';
import { CanDeactivateComponent } from '../../../../share/interfaces/can-deactivate-component';

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
  icon: ErrMessageItem = new ErrMessageItem();
  ic_name: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, ic_name?: ErrMessageItem,
              corner?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(ic_name)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
  }
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, CanDeactivateComponent {

  constructor(private globalService: GlobalService, private productService: ProductService,
              private routerInfo: ActivatedRoute, private router: Router) { }
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public productData: TicketProductEntity = new TicketProductEntity();
  public productInfoList: Array<any> = [];
  public productTicketList: Array<any> = [];
  public imgUrls: Array<any> = [];
  public noResultInfoText = '数据加载中...';
  public noResultTicketText = '数据加载中...';
  public product_image_url: Array<any> = [];
  public tempContent1 = ''; // 交通指南富文本框内容
  public tempContent2 = ''; // 预定须知富文本框内容
  public tempContent3 = ''; // 景区介绍富文本框内容
  public loading = true;
  public product_id: string;
  public productNameErrors = '';
  public trafficGuideErrors = '';
  public noticeErrors = '';
  public productIntroduceErrors = '';

  private searchText$ = new Subject<any>();
  private product_name = '';
  private product_subtitle = '';
  private isReImportant = false;

  @ViewChild('productImg', { static: true }) public coverImgSelectComponent: ZPhotoSelectComponent;

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.product_id = params.product_id;
    });

    // 产品详情
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestProductsDetail(this.product_id))
    ).subscribe(res => {
      this.productData = res;
      this.imgUrls = this.productData.image_urls ? this.productData.image_urls.split(',') : [];
      this.product_name = this.productData.product_name;
      this.product_subtitle = this.productData.product_subtitle;
      this.productInfoList = [
        {
          product_id: this.productData.product_id,
          product_name: this.product_name,
          product_image: this.imgUrls.length !== 0 ? this.imgUrls[0] : '',
          address: this.productData.address,
          status: this.productData.status,
        }
      ];
      this.productData.product_name = this.productData.product_name.substring(0, 20);
      this.productTicketList = this.productData.tickets.map(i => ({
        ...i,
        isShowInsutructions: false
      }));
      this.noResultInfoText = '暂无数据';
      this.noResultTicketText = '暂无数据';
      this.getEditorData();
      this.loading = false;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 富文本数据处理
  public getEditorData() {
    CKEDITOR.instances.editor1.destroy(true);
    CKEDITOR.instances.editor2.destroy(true);
    CKEDITOR.instances.editor3.destroy(true);
    this.tempContent1 = this.productData.traffic_guide;
    this.tempContent2 = this.productData.notice;
    this.tempContent3 = this.productData.product_introduce;
    CKEDITOR.replace('editor1').setData(this.tempContent1);
    CKEDITOR.replace('editor2').setData(this.tempContent2);
    CKEDITOR.replace('editor3').setData(this.tempContent3);
  }

  // 允许跳转
  public canDeactivate(): boolean {
    const pro_image = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
    const pro_image_str = pro_image.join(',');
    if (this.tempContent1.includes('<p>')) {
      return this.productData.product_name === this.product_name &&
        this.productData.product_subtitle === this.product_subtitle &&
        CKEDITOR.instances.editor1.getData().trim() === this.tempContent1.trim()
        && CKEDITOR.instances.editor2.getData().trim() === this.tempContent2.trim() &&
        CKEDITOR.instances.editor3.getData().trim() === this.tempContent3.trim() &&
        !this.isReImportant && pro_image_str === this.imgUrls.join(',');
    } else {
      return this.productData.product_name === this.product_name &&
        this.productData.product_subtitle === this.product_subtitle &&
        CKEDITOR.instances.editor1.getData().replace(/<p>/g, '').trim() === this.tempContent1.trim()
        && CKEDITOR.instances.editor2.getData().replace(/<p>/g, '').trim() === this.tempContent2.trim() &&
        CKEDITOR.instances.editor3.getData().replace(/<p>/g, '').trim() === this.tempContent3.trim() &&
        !this.isReImportant && pro_image_str === this.imgUrls.join(',');
    }

  }

  // 展开
  public onShowInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = true;
  }

  // 收起
  public onHideInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = false;
  }

  // 重新导入
  public onReImportData() {
    this.globalService.confirmationBox.open('提示', '重新导入会覆盖现有票务详情，确定导入？', () => {
      this.globalService.confirmationBox.close();
      this.clear();
      // 产品图片
      this.imgUrls = this.productData.third_product.third_product_image
        ? this.productData.third_product.third_product_image.split(',') : [];
      CKEDITOR.instances.editor1.destroy(true);
      CKEDITOR.instances.editor2.destroy(true);
      CKEDITOR.instances.editor3.destroy(true);
      const editor1 = CKEDITOR.replace('editor1'); // 交通指南
      editor1.setData(this.productData.third_product.topics);
      const editor2 = CKEDITOR.replace('editor2'); // 预订须知
      editor2.setData(this.productData.third_product.notice);
      const editor3 = CKEDITOR.replace('editor3'); // 景区介绍
      editor3.setData(this.productData.third_product.introduce);
      this.isReImportant = true;
    }, '确定', () => {
      this.isReImportant = false;
    });
  }

  // 置顶
  public onIsTopProduct(product_id, ticket_id, is_top) {
    const text = is_top === 1 ? '置顶' : '取消置顶';
    this.productService.requestIsTopProduct(product_id, ticket_id, is_top).subscribe(res => {
      this.searchText$.next();
      this.globalService.promptBox.open(`${text}成功！`);
    }, err => {
      this.globalService.promptBox.open(`${text}失败，请重试!`);
    });
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
    this.productNameErrors = '';
    this.trafficGuideErrors = '';
    this.noticeErrors = '';
    this.productIntroduceErrors = '';
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event) {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 保存基础数据调用接口
  public onSaveFormData() {
    this.productData.traffic_guide = CKEDITOR.instances.editor1.getData();
    this.productData.notice = CKEDITOR.instances.editor2.getData();
    this.productData.product_introduce = CKEDITOR.instances.editor3.getData();
    if (!this.productData.product_name) {
      this.clear();
      this.productNameErrors = '请输入产品名称！';
    } else if (this.coverImgSelectComponent.imageList.length === 0) {
      this.clear();
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请上传产品图片！';
    } else if (!CKEDITOR.instances.editor1.getData()) {
      this.clear();
      this.trafficGuideErrors = '请填写交通指南！';
    } else if (!CKEDITOR.instances.editor2.getData()) {
      this.clear();
      this.noticeErrors = '请填写预订须知！';
    } else if (!CKEDITOR.instances.editor3.getData()) {
      this.clear();
      this.productIntroduceErrors = '请填写景区介绍！';
    } else {
      this.clear();
      this.coverImgSelectComponent.upload().subscribe(() => {
        this.product_image_url = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
        this.productData.image_urls = this.product_image_url.join(',');
        this.productService.requestSetProductData(this.product_id, this.productData).subscribe(() => {
          this.searchText$.next();
          this.globalService.promptBox.open('保存成功');
          timer(2000).subscribe(() => this.router.navigateByUrl('/main/ticket/product-management'));
        }, err => {
          if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
              const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
              for (const content of error.errors) {
                const field = content.field === 'product_name' ? '产品名称' : content.field === 'product_subtitle' ? '副标题' :
                  content.field === 'image_urls' ? '产品图片' : content.field === 'traffic_guide' ? '交通指南' :
                    content.field === 'notice' ? '预订须知' : content.field === 'product_introduce' ? '景区介绍' : '';
                if (content.code === 'missing_field') {
                  this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
                  return;
                } else if (content.code === 'invalid') {
                  this.globalService.promptBox.open(`${field}输入错误`, null, 2000, '/assets/images/warning.png');
                } else {
                  this.globalService.promptBox.open('保存失败,请重试!', null, 2000, '/assets/images/warning.png');
                }
              }
            }
          }
        });
      });
    }
  }
}
