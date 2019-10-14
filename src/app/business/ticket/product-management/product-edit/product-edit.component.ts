import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { isUndefined } from 'util';
import { Subject } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { ProductService, ThirdProductEntity } from '../product.service';
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
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public thirdProductData: ThirdProductEntity = new ThirdProductEntity();
  public thirdProductInfoList: Array<any> = [];
  public productTicketList: Array<any> = [];
  public noResultInfoText = '数据加载中...';
  public noResultTicketText = '数据加载中...';
  public product_image_url: Array<any> = [];
  public tempContent1 = ''; // 交通指南富文本框内容
  public tempContent2 = ''; // 预定须知富文本框内容
  public tempContent3 = ''; // 景区介绍富文本框内容
  public flag = 0;
  public uploadImg: string;
  public product_id: string;

  private searchText$ = new Subject<any>();
  private third_product_name = '';
  private introduce: string = undefined;

  @ViewChild('coverImg', { static: true }) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('productInfoForm', { static: false }) public productInfoForm: any;
  // @ViewChild('ticketDetailForm', { static: true }) public ticketDetailForm: any;

  constructor(private globalService: GlobalService, private productService: ProductService,
              private routerInfo: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.product_id = params.product_id;
    });

    // 第三方产品详情
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestThirdProductsDetail(this.product_id))
    ).subscribe(res => {
      this.thirdProductData = res;
      this.third_product_name = this.thirdProductData.third_product_name;
      this.introduce = this.thirdProductData.introduce;
      this.thirdProductInfoList = [
        {
          third_product_id: this.thirdProductData.third_product_id,
          third_product_name: this.thirdProductData.third_product_name,
          third_product_image: this.thirdProductData.third_product_image,
          third_address: `${this.thirdProductData.provice}${this.thirdProductData.city}${this.thirdProductData.district}
          ${this.thirdProductData.district}`,
          sale_status: this.thirdProductData.sale_status,
        }
      ];
      this.getEditorData();
      this.noResultInfoText = '暂无数据';
      this.noResultTicketText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();

    this.productTicketList = [
      {
        name: '赠项目门票', isShowInsutructions: false, time: '提前1小时', costIncludes: '15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元,15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元,15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 1
      },
      {
        name: '温泉门票', isShowInsutructions: false, time: '提前2小时', costIncludes: '25项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 2
      },
      {
        name: '游乐场门票', isShowInsutructions: false, time: '提前3小时', costIncludes: '35项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 2
      },
      {
        name: '洗浴门票', isShowInsutructions: false, time: '提前4小时', costIncludes: '45项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 1
      },
    ];
  }

  // 富文本数据处理
  private getEditorData() {
    this.tempContent1 = this.thirdProductData.traffic_guide;
    this.tempContent2 = this.thirdProductData.notice;
    this.tempContent3 = this.thirdProductData.introduce;
    const editor1 = CKEDITOR.replace('editor1'); // 创建富文本,解决刷新页面才能显示值的问题
    editor1.setData(this.tempContent1);
    const editor2 = CKEDITOR.replace('editor2'); // 创建富文本,解决刷新页面才能显示值的问题
    editor2.setData(this.tempContent2);
    const editor3 = CKEDITOR.replace('editor3'); // 创建富文本,解决刷新页面才能显示值的问题
    editor3.setData(this.tempContent3);
  }

  // 允许跳转
  public canDeactivate(): boolean {
    return this.thirdProductData.third_product_name === this.third_product_name &&
      this.thirdProductData.introduce === this.introduce && CKEDITOR.instances.editor1.getData() === this.tempContent1
      && CKEDITOR.instances.editor2.getData() === this.tempContent2 && CKEDITOR.instances.editor3.getData() === this.tempContent3;
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
      this.getEditorData();
    });
  }

  // 置顶
  public onIsTopProduct(product_id, is_top) {
    this.productService.requestIsTopProduct(product_id, is_top).subscribe(res => {
      this.globalService.promptBox.open('置顶成功！');
      this.searchText$.next();
    }, err => {
      this.globalService.promptBox.open('置顶失败，请重试！');
    });
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
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
    if (this.coverImgSelectComponent.imageList.length === 0) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请上传产品图片！';
    } else {
      this.clear();
      this.coverImgSelectComponent.upload().subscribe(() => {
        this.product_image_url = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
        this.thirdProductData.third_product_image = JSON.stringify(this.product_image_url);
        this.thirdProductData.traffic_guide = CKEDITOR.instances.editor1.getData();
        this.thirdProductData.notice = CKEDITOR.instances.editor2.getData();
        this.thirdProductData.introduce = CKEDITOR.instances.editor3.getData();
        this.productService.requestSetProductData(this.product_id, this.thirdProductData).subscribe(() => {
          this.searchText$.next();
          this.globalService.promptBox.open('保存成功');
        }, err => {
          if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
              const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
              for (const content of error.errors) {
                const field = content.field === 'project_name' ? '产品名称' : content.field === 'project_subtitle' ? '副标题' :
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
