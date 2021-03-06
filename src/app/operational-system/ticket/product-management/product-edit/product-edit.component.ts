import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { isUndefined } from 'util';
import { Subject, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { ProductService, TicketProductEntity, SearchLabelParams, LabelEntity } from '../product.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { HttpErrorEntity } from '../../../../core/http.service';
import { CanDeactivateComponent } from '../../../../share/interfaces/can-deactivate-component';
import { ProductCalendarComponent } from './product-calendar/product-calendar.component';
import { ZTextCkeditorComponent } from '../../../../share/components/z-text-ckeditor/z-text-ckeditor.component';
import { ChooseLabelComponent } from './choose-label/choose-label.component';

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
              private routerInfo: ActivatedRoute, private router: Router) {
  }

  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public productData: TicketProductEntity = new TicketProductEntity();
  public labelList: Array<LabelEntity> = [];
  public searchParams: SearchLabelParams = new SearchLabelParams();
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
  public tagNameErrors = '';
  public trafficGuideErrors = '';
  public noticeErrors = '';
  public productIntroduceErrors = '';
  public isEditTicketInsutruction = false;
  public initCheckLabelNamesList: Array<any> = [];
  public checkLabelNamesList: Array<any> = [];
  public isSaleTicketSwitch = true;
  public editorWidth = '500';

  private searchText$ = new Subject<any>();
  private isReImportant = false;
  private preset_time: string;
  private fee_contain: string;
  private use_notice: string;
  private rc_notice: string;
  private isChangeTicketInsutruction = false;
  private isSubmitProductInfo = false;

  @ViewChild('productImg', { static: true }) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('productPriceCalendar', { static: true }) public productPriceCalendar: ProductCalendarComponent;
  @ViewChild('chooseLabel', { static: true }) public chooseLabel: ChooseLabelComponent;
  @ViewChild('productInfoForm', { static: true }) public productInfoForm: any;
  @ViewChild('editor1', { static: true }) public productCkeditor1: ZTextCkeditorComponent;
  @ViewChild('editor2', { static: true }) public productCkeditor2: ZTextCkeditorComponent;
  @ViewChild('editor3', { static: true }) public productCkeditor3: ZTextCkeditorComponent;

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
      // 票务详情
      this.imgUrls = this.productData.image_urls ? this.productData.image_urls.split(',') : [];
      // 产品信息列表
      this.productInfoList = [
        {
          product_id: this.productData.product_id,
          product_name: this.productData.product_name,
          product_image: this.imgUrls.length !== 0 ? this.imgUrls[0] : '',
          address: this.productData.address,
          status: this.productData.status,
          sale_num: this.productData.sale_num,
        }
      ];
      this.noResultInfoText = '暂无数据';
      // 产品运营信息--产品名称最多显示20个字符
      this.productData.product_name = this.productData.product_name.substring(0, 20);
      this.getTagsName();
      // 产品门票列表
      this.productTicketList = this.productData.tickets.map(i => ({
        ...i,
        isShowInsutructions: false,
        isEditTicketInsutruction: false,
      }));
      this.noResultTicketText = '暂无数据';
      this.getEditorData(this.productData.traffic_guide, this.productData.notice, this.productData.product_introduce);
      this.loading = false;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 获取标签名称
  private getTagsName() {
    this.productService.requestLabelListData(this.searchParams).subscribe(res => {
      this.labelList = res.results;
      const checkLabelList = this.labelList.map((i, index) => {
        const isCheckLabel = this.productData.tag_ids.includes(i.tag_id);
        return (
          {
            ...i,
            time: new Date().getTime() + index,
            checked: isCheckLabel
          });
      });
      this.initCheckLabelNamesList = checkLabelList.filter(i => i.checked);
      this.checkLabelNamesList = checkLabelList.filter(i => i.checked);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }


  // 删除标签
  public onDelTag(i: number) {
    this.checkLabelNamesList.splice(i, 1);
  }

  // 选择标签
  public onChooseLabel() {
    this.chooseLabel.open(this.checkLabelNamesList.map(i => i.tag_id), () => {
      timer(1000).subscribe(() => {
        this.checkLabelNamesList = this.chooseLabel.checkedLabelList;
        this.tagNameErrors = '';
      });
    });
  }

  // 更新数据
  public onUpdateData(flag: number) {
    this.productService.requesTicketsList(this.product_id, flag).subscribe(res => {
      this.productTicketList = res.results.map(i => ({
        ...i,
        isShowInsutructions: false,
        isEditTicketInsutruction: false,
      }));
      this.noResultTicketText = '暂无数据';
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'unshelved') {
              this.globalService.promptBox.open(`该产品已下架!`, null, 2000, '/assets/images/warning.png');
            } else {
              return;
            }
          }
        }
      }
    });
  }

  // 允许跳转
  public canDeactivate(): boolean {
    const pro_image = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
    const pro_image_str = pro_image.join(',');
    // true：不提示 false：提示
    return this.isSubmitProductInfo || (!this.productInfoForm.dirty && !this.isChangeTicketInsutruction
      && !this.productCkeditor1.isEditorChange && !this.productCkeditor2.isEditorChange
      && !this.productCkeditor3.isEditorChange && (!this.isReImportant && pro_image_str === this.imgUrls.join(',')))
      && this.checkLabelNamesList.filter(i => i.tag_id).join(',') ===
      this.initCheckLabelNamesList.filter(i => i.tag_id).join(',');
  }

  // 编辑购票须知
  public onEditTicketInsutruction(item: any) {
    item.isEditTicketInsutruction = true;
    this.preset_time = item.preset_time;
    this.fee_contain = item.fee_contain;
    this.use_notice = item.use_notice;
    this.rc_notice = item.rc_notice;
  }

  // 购票须知被编辑
  public onTicketInsutructionChange() {
    this.isChangeTicketInsutruction = true;
  }

  // 保存购票须知
  public onSaveTicketInsutruction(item: any) {
    this.productService.requestSetInstructions(this.product_id, item).subscribe(() => {
      this.globalService.promptBox.open('购票须知保存成功！');
      item.editBasePriceSwitch = true;
      this.isChangeTicketInsutruction = false;
      this.onUpdateData(2);
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            const field = content.field === 'preset_time' ? '预定时间' : content.field === 'fee_contain' ?
              '费用包含' : content.field === 'use_notice' ? '使用须知' : content.field === 'rc_notice' ? '退改须知' : '';
            if (content.code === 'missing_field') {
              this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
              return;
            } else if (content.code === 'invalid') {
              this.globalService.promptBox.open(`${field}输入错误`, null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('购票须知保存失败,请重试!', null, 2000, '/assets/images/warning.png');
            }
          }
        }
      }
    });
  }

  // 取消计费规则的车辆信息
  public onCancelTicketInsutruction(item: any, i: number) {
    item.isEditTicketInsutruction = false;
    this.productTicketList[i].preset_time = this.preset_time;
    this.productTicketList[i].fee_contain = this.fee_contain;
    this.productTicketList[i].use_notice = this.use_notice;
    this.productTicketList[i].rc_notice = this.rc_notice;
  }

  // 价格日历
  public onOpenPriceCalendar(ticket_id: string) {
    this.productPriceCalendar.open(null, this.product_id, ticket_id, () => {
      timer(1000).subscribe(() => {
        this.onUpdateData(2);
      });
    });
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
      const third_product = this.productData.third_product;
      this.getEditorData(third_product.traffic_guide, third_product.notice, third_product.introduce);
      this.isReImportant = true;
    }, '确定', () => {
      this.isReImportant = false;
    });
  }

  // 富文本数据处理
  public getEditorData(traffic_guide: string, notice: string, introduce: string) {
    CKEDITOR.instances.editor1.destroy(true);
    CKEDITOR.instances.editor2.destroy(true);
    CKEDITOR.instances.editor3.destroy(true);
    // 兼容第三方数据的回车符号,均替换为<br>
    const tempContent1 = traffic_guide.replace('/\r\n/g', '<br>').replace(/\n/g, '<br>');
    const tempContent2 = notice.replace('/\r\n/g', '<br>').replace(/\n/g, '<br>');
    const tempContent3 = introduce.replace('/\r\n/g', '<br>').replace(/\n/g, '<br>');
    CKEDITOR.replace('editor1').setData(tempContent1);
    CKEDITOR.replace('editor2').setData(tempContent2);
    CKEDITOR.replace('editor3').setData(tempContent3);
  }

  // 上架开关状态改变
  public onSwitchChange(is_saled: boolean, event: boolean) {
    timer(2000).subscribe(() => {
      return is_saled = event;
    });
  }

  // 点击是否售卖开关调用接口
  public onSwitchClick(product_id, ticket_id, is_saled) {
    if (is_saled && this.productTicketList.filter(i => i.is_saled).length === 1) {
      this.globalService.promptBox.open(`产品下至少有一个门票，不允许下架！`, null, 2000, '/assets/images/warning.png');
    } else {
      const text = is_saled ? '下架' : '上架';
      this.productService.requestIsSaleTicket(product_id, ticket_id, !is_saled).subscribe(res => {
        this.globalService.promptBox.open(`${text}成功`);
        this.onUpdateData(2);
      }, err => {
        this.globalService.promptBox.open(`${text}失败，请重试！`, null, 2000, '/assets/images/warning.png');
        this.onUpdateData(2);
      });
    }
  }

  // 置顶
  public onIsTopProduct(product_id: string, ticket_id: string, is_top: number) {
    const text = is_top === 1 ? '置顶' : '取消置顶';
    this.productService.requestIsTopProduct(product_id, ticket_id, is_top).subscribe(res => {
      this.onUpdateData(2);
      this.globalService.promptBox.open(`${text}成功！`);
    }, err => {
      this.globalService.promptBox.open(`${text}失败，请重试!`, null, 2000, '/assets/images/warning.png');
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
    this.tagNameErrors = '';
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
  public onSaveValidFormData() {
    this.productData.traffic_guide = CKEDITOR.instances.editor1.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    this.productData.notice = CKEDITOR.instances.editor2.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    this.productData.product_introduce = CKEDITOR.instances.editor3.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    this.productData.tag_ids = this.checkLabelNamesList.map(i => i.tag_id);
    if (!this.productData.product_name) {
      this.clear();
      this.productNameErrors = '请输入产品名称！';
    } else if (this.productData.tag_ids.length === 0) {
      this.clear();
      this.tagNameErrors = '请选择标签！';
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
        this.onSavaProductData();
      });
    }
  }

  // 保存产品编辑页面数据
  private onSavaProductData() {
    this.productService.requestSetProductData(this.product_id, this.productData).subscribe(() => {
      this.searchText$.next();
      this.globalService.promptBox.open('保存成功');
      this.isSubmitProductInfo = true;
      timer(2000).subscribe(() => this.router.navigateByUrl('/main/ticket/product-management'));
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            const field = content.field === 'product_name' ? '产品名称' : content.field === 'product_subtitle' ? '副标题' :
              content.field === 'tag_ids' ? '分类标签' : content.field === 'image_urls' ? '产品图片' :
                content.field === 'traffic_guide' ? '交通指南' : content.field === 'notice' ? '预订须知' :
                  content.field === 'product_introduce' ? '景区介绍' : '';
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
  }
}
