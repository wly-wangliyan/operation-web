import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs/index';
import { isNullOrUndefined } from 'util';
import { ValidateHelper } from '../../../../../utils/validate-helper';
import { KeyboardHelper } from '../../../../../utils/keyboard-helper';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ZVideoSelectComponent } from '../../../../share/components/z-video-select/z-video-select.component';
import {
  CommodityEntity,
  GoodsManagementHttpService, SpecificationDateEntity,
  SpecificationEntity,
  SpecificationParams
} from '../goods-management-http.service';
import { differenceInCalendarDays } from 'date-fns';
import { BusinessEntity } from '../../business-management/business-management.service';
import { SortEntity, ClassifyManagementHttpService } from '../classify-management-http.service';

@Component({
  selector: 'app-goods-create',
  templateUrl: './goods-create.component.html',
  styleUrls: ['./goods-create.component.css']
})
export class GoodsCreateComponent implements OnInit, OnDestroy {

  public levelTwoName = '新建产品';

  public listRelativePath = '../../list';

  public commodityInfo: CommodityEntity = new CommodityEntity();

  public commoditySpecificationList: Array<SpecificationParamsItem> = []; // 视频规格数据列表

  public coverImgErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加封面图片错误信息

  public imgErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加图片错误信息

  public videoErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加视频错误信息

  public videoUrlErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加视频Url错误信息

  public specificationErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 产品规格错误信息

  public editorErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 编辑器错误信息

  public start_time = null; // 价格日历开始时间

  public end_time = null; // 价格日历结束时间

  public giveaway_settings = false;

  public isTooltipShow = false;

  public specificationNameIndex: number;

  public weekList = [];

  public businessList: Array<BusinessEntity> = []; // 商家列表

  public coverImgList: Array<any> = []; // 封面图片

  public time = null;

  public currentSpecification: SpecificationDateEntity = new SpecificationDateEntity();

  public classifyList: Array<SortEntity> = [];

  public videoUrlList: Array<any> = [];

  public url = '';

  public aspectRatio = 1.78 / 1; // 截取图片比例

  private commodity_id: string;

  private onSubmitSubscription: any;

  private specificationIndex: number;

  private delete_specification_ids = [];


  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  @ViewChild('goodsImg', { static: false }) public goodsImgSelectComponent: ZPhotoSelectComponent;

  @ViewChild('goodsVideo', { static: false }) public goodsVideoSelectComponent: ZVideoSelectComponent;

  @ViewChild('pricePromptDiv', { static: true }) public pricePromptDiv: ElementRef;

  /**
   * 格式化商品规格列表数据
   * @returns Array<SpecificationParamsItem>
   */
  public get FormatCommoditySpecificationList(): Array<SpecificationParamsItem> {
    const formatCommoditySpecificationList: Array<SpecificationParamsItem> = [];
    this.commoditySpecificationList.forEach(commoditySpecificationItem => {
      if (!commoditySpecificationItem.is_delete) {
        formatCommoditySpecificationList.push(commoditySpecificationItem);
      }
    });
    formatCommoditySpecificationList.forEach(formatItem => {
      KeyboardHelper.bindElement('unit_original_price_' + formatItem.idCount);
      KeyboardHelper.bindElement('unit_sell_price_' + formatItem.idCount);
      KeyboardHelper.bindElement('settlement_price_' + formatItem.idCount);
      KeyboardHelper.bindElement('stock_' + formatItem.idCount);
    });
    return formatCommoditySpecificationList;
  }

  /**
   * 校验是否选择了图片
   * @returns boolean
   */
  public get CheckImgValid(): boolean {
    if (this.goodsImgSelectComponent) {
      const images = this.goodsImgSelectComponent.imageList.map(item => item.sourceUrl);
      if (images.length > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * 校验选项卡
   * @returns boolean
   */
  public get CheckTabValia(): boolean {
    if (!this.commodityInfo.commodity_type || !this.commodityInfo.collection_type || !this.commodityInfo.shipping_method
      || (!this.commodityInfo.validity_type && this.commodityInfo.commodity_type === 2)) {
      return false;
    }
    return true;
  }

  /**
   * 校验是否填写商品规格数据
   * @returns boolean
   */
  public get CheckCommoditySpecificationValid(): boolean {
    for (let formatSpecificationIndex = 0; formatSpecificationIndex < this.FormatCommoditySpecificationList.length; formatSpecificationIndex++) {
      const lastCommoditySpecificationItem = this.FormatCommoditySpecificationList[formatSpecificationIndex].specification_params;
      if (isNullOrUndefined(lastCommoditySpecificationItem.specification_name) ||
        (lastCommoditySpecificationItem.specification_name === '') ||
        isNullOrUndefined(lastCommoditySpecificationItem.unit_original_price) ||
        (lastCommoditySpecificationItem.stock_json && isNullOrUndefined(lastCommoditySpecificationItem.stock_json.stock_day)
          && this.commodityInfo.validity_type === 2) ||
        (isNullOrUndefined(lastCommoditySpecificationItem.unit_sell_price) && this.commodityInfo.validity_type !== 2)
        || (!lastCommoditySpecificationItem.stock_json && this.commodityInfo.validity_type === 2) ||
          (this.commodityInfo.commodity_type === 3 && !lastCommoditySpecificationItem.coupon_group_ids && !lastCommoditySpecificationItem.template_coupon_ids)) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * 校验是否填写编辑器内容
   * @returns boolean
   */
  public get CheckEditorValid(): boolean {
    if (!CKEDITOR.instances.goodsEditor.getData()) {
      return false;
    }
    return true;
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private goodsManagementHttpService: GoodsManagementHttpService,
    private classifyHttpService: ClassifyManagementHttpService) {
    this.route.paramMap.subscribe(map => {
      this.commodity_id = map.get('commodity_id');
    });
  }

  public ngOnInit() {
    if (this.commodity_id) {
      this.levelTwoName = '编辑产品';
      this.listRelativePath = '../../list';
      timer(500).subscribe(() => {
        this.requestCommodityById();
      });
    } else {
      this.commoditySpecificationList.push(new SpecificationParamsItem());
    }
    this.requestClassifyList();
    this.requestbusinessList();
    const weekList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    weekList.forEach(value => {
      this.weekList.push({ checked: false, disabled: false, label: value });
    });
  }

  public ngOnDestroy() {
    this.onSubmitSubscription = null;
  }

  // 选择封面图片
  public onSelectedCoverPicture(event: any) {
    this.coverImgErrMsgItem.isError = false;
    if (event === 'type_error') {
      this.coverImgErrMsgItem.isError = true;
      this.coverImgErrMsgItem.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.coverImgErrMsgItem.isError = true;
      this.coverImgErrMsgItem.errMes = '图片大小不得高于2M！';
    }
  }

  // 选择图片
  public onSelectedPicture(event: any) {
    this.imgErrMsgItem.isError = false;
    if (event === 'type_error') {
      this.imgErrMsgItem.isError = true;
      this.imgErrMsgItem.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.imgErrMsgItem.isError = true;
      this.imgErrMsgItem.errMes = '图片大小不得高于2M！';
    }
  }

  // 保存视频地址
  public onSaveVideoUrl() {
    const reg = /^(http|https)?.+\.(mp4)$/;
    if (!this.url) {
      this.videoUrlErrMsgItem.isError = true;
      this.videoUrlErrMsgItem.errMes = '请输入视频地址！';
    } else if (!reg.test(this.url)) {
      this.videoUrlErrMsgItem.isError = true;
      this.videoUrlErrMsgItem.errMes = '请输入MP4格式的视频地址！';
    } else {
      this.videoUrlErrMsgItem = new ErrMessageItem();
      this.videoUrlList = [];
      this.videoUrlList.push(this.url);
    }
  }

  // 选择视频
  public onSelectedVideo(event: any) {
    this.videoErrMsgItem.isError = false;
    if (event === 'type_error') {
      this.videoErrMsgItem.isError = true;
      this.videoErrMsgItem.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.videoErrMsgItem.isError = true;
      this.videoErrMsgItem.errMes = '视频大小不得高于20M！';
    }
  }

  // 勾选赠品
  public onCheckBoxSetting() {
    this.commodityInfo.giveaway_settings = this.giveaway_settings ? 1 : 0;
  }

  /**
   * 商品规格数据转换
   * 如01转为1
   * 1.0转为1
   * @param number specificationIndex
   * @param event 事件
   * @param number reverseType 转换类型 1：原价；2：售价；3：库存 4:结算价格
   */
  public reverseSpecificationParams(specificationIndex: number, event: any, reverseType: number) {
    const reverseCommoditySpecificationItem = this.commoditySpecificationList[specificationIndex].specification_params;
    const inputValue = event.target.value;
    switch (reverseType) {
      case 1:
        reverseCommoditySpecificationItem.unit_original_price = inputValue ? parseFloat(event.target.value) : null;
        break;
      case 2:
        reverseCommoditySpecificationItem.unit_sell_price = inputValue ? parseFloat(event.target.value) : null;
        break;
      case 3:
        reverseCommoditySpecificationItem.stock = inputValue ? parseInt(event.target.value) : null;
        break;
      case 4:
        reverseCommoditySpecificationItem.settlement_price = inputValue ? parseFloat(event.target.value) : null;
        break;
    }
  }

  // 规格名称得到焦点时如果勾选了赠品给出提示
  public onFocusSpecificationName(i: number) {
    if (this.giveaway_settings) {
      this.specificationNameIndex = i;
      this.isTooltipShow = true;
    } else {
      this.isTooltipShow = false;
    }
  }

  // 点击添加商品规格
  public onAddCommoditySpecification() {
    if (this.checkCommodityParamsValid(false)) {
      timer(0).subscribe(() => {
        this.commoditySpecificationList.push(new SpecificationParamsItem());
      });
    }
    const ele = document.getElementById('table-tbody');
    if (ele.scrollHeight >= ele.clientHeight) {
      timer(0).subscribe(() => {
        // 设置滚动条到最底部
        ele.scrollTop = ele.scrollHeight;
      });
    }
  }

  // 点击移除商品规格
  public onDeleteCommoditySpecification(specificationIndex: number) {
    if (this.giveaway_settings) {
      this.globalService.confirmationBox.open('删除', '此商品已作为赠品，确定要移除此规格吗？', () => {
        this.globalService.confirmationBox.close();
        this.delCommoditySpecification(specificationIndex);
      });
    } else {
      this.delCommoditySpecification(specificationIndex);
    }
  }

  // 删除商品规格
  private delCommoditySpecification(specificationIndex: number) {
    const deleteCommoditySpecificationItem = this.commoditySpecificationList[specificationIndex];
    deleteCommoditySpecificationItem.is_delete = true;

    this.commoditySpecificationList.splice(specificationIndex, 1);
    this.initErrMsg();

    if (!deleteCommoditySpecificationItem.is_create) {
      timer(0).subscribe(() => {
        this.delete_specification_ids.push(deleteCommoditySpecificationItem.specification_params.specification_id);
      });
    }
  }

  // 初始化错误消息
  public initErrMsg(isInitCommodityErr: boolean = false) {
    if (isInitCommodityErr) {
      this.coverImgErrMsgItem = new ErrMessageItem();
      this.imgErrMsgItem = new ErrMessageItem();
      this.videoErrMsgItem = new ErrMessageItem();
      this.editorErrMsgItem = new ErrMessageItem();
    }
    this.specificationErrMsgItem = new ErrMessageItem();
  }

  // 点击提交添加/编辑商品数据
  public onAddOrEditCommoditySubmit() {
    if (this.onSubmitSubscription || !this.checkCommodityParamsValid()) {
      return;
    }
    this.onSubmitSubscription = this.coverImgSelectComponent.upload().subscribe(() => {
      this.goodsImgSelectComponent.upload().subscribe(() => {
        this.commodityInfo.cover_image = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
        this.commodityInfo.commodity_images = this.goodsImgSelectComponent.imageList.map(i => i.sourceUrl);
        this.commodityInfo.commodity_videos = this.videoUrlList;
        this.commodityInfo.commodity_description = CKEDITOR.instances.goodsEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
        const commodityInfo = this.commodityInfo.clone();
        commodityInfo.buy_max_num = this.commodityInfo.buy_max_num ? this.commodityInfo.buy_max_num : -1;
        if (this.commodity_id) {
          this.requestEditCommodity(commodityInfo);
        } else {
          this.requestCreateCommodity(commodityInfo);
        }
      }, err => {
        this.upLoadErrMsg(err);
      });
    }, err => {
      this.upLoadErrMsg(err);
    });
  }

  // 点击取消添加/编辑
  public onCancelClick() {
    this.globalService.confirmationBox.open('提示', '是否确认取消编辑？', () => {
      this.globalService.confirmationBox.close();
      this.router.navigate([this.listRelativePath], { relativeTo: this.route });
    });
  }

  // 获取商品详情
  private requestCommodityById() {
    this.goodsManagementHttpService.requestCommodityByIdData(this.commodity_id).subscribe(data => {
      this.commodityInfo = data;
      this.coverImgList = this.commodityInfo.cover_image ? this.commodityInfo.cover_image.split(',') : [];
      this.commodityInfo.buy_max_num = data.buy_max_num === -1 ? null : data.buy_max_num;
      this.commodityInfo.freight_fee = this.commodityInfo.freight_fee ? this.commodityInfo.freight_fee / 100 : this.commodityInfo.freight_fee;
      this.giveaway_settings = this.commodityInfo.giveaway_settings === 1 ? true : false;
      this.commodityInfo.specifications.forEach(specificationItem => {
        const tempSpecificationItem = new SpecificationParamsItem();
        tempSpecificationItem.specification_params = new SpecificationEntity(specificationItem);
        tempSpecificationItem.is_create = false;
        tempSpecificationItem.specification_params.template_coupon_ids = specificationItem.template_coupon_ids;
        tempSpecificationItem.specification_params.coupon_group_ids = specificationItem.coupon_group_ids;
        if (tempSpecificationItem.specification_params.stock_json) {
          tempSpecificationItem.specification_params.stock_json.unit_sell_price_day =
            tempSpecificationItem.specification_params.stock_json.unit_sell_price_day ?
              (tempSpecificationItem.specification_params.stock_json.unit_sell_price_day / 100) :
              tempSpecificationItem.specification_params.stock_json.unit_sell_price_day;
        }
        this.commoditySpecificationList.push(tempSpecificationItem);
      });
      if (this.commodityInfo.specifications.length === 0) {
        this.commoditySpecificationList.push(new SpecificationParamsItem());
      }
      this.videoUrlList = this.commodityInfo.commodity_videos;
      this.url = this.commodityInfo.commodity_videos.length !== 0 ? this.commodityInfo.commodity_videos[0] : '';
      CKEDITOR.instances.goodsEditor.destroy(true);
      CKEDITOR.replace('goodsEditor', { width: '900px' }).setData(this.commodityInfo.commodity_description);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取所属分类列表
  private requestClassifyList() {
    this.classifyHttpService.requestClassifyAllListData().subscribe(res => {
      this.classifyList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取商家列表
  private requestbusinessList() {
    this.goodsManagementHttpService.requestBusinessListData().subscribe(data => {
      this.businessList = data;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 创建商品
  private requestCreateCommodity(commodityInfo: CommodityEntity) {
    this.goodsManagementHttpService.requestCreateCommodityData(commodityInfo).subscribe(data => {
      this.requestModifyCommoditySpecification(data.commodity_id);
    }, err => {
      this.processError(err);
    });
  }

  // 修改商品
  private requestEditCommodity(commodityInfo: CommodityEntity) {
    this.goodsManagementHttpService.requestEditCommodityData(this.commodity_id, commodityInfo).subscribe(() => {
      this.requestModifyCommoditySpecification(this.commodity_id);
    }, err => {
      this.processError(err);
    });
  }

  // 创建/修改规格
  private requestModifyCommoditySpecification(commodity_id: string) {
    const specificationParams = new SpecificationParams();
    specificationParams.specification_objs = [];
    this.commoditySpecificationList.forEach(commoditySpecificationItem => {
      if (!commoditySpecificationItem.is_delete) {
        if (this.commodityInfo.validity_type === 2) {
          commoditySpecificationItem.specification_params.unit_sell_price = null;
          commoditySpecificationItem.specification_params.stock = null;
        } else {
          commoditySpecificationItem.specification_params.stock_json = new SpecificationDateEntity();
        }
        specificationParams.specification_objs.push(commoditySpecificationItem.specification_params);
      }
    });
    specificationParams.delete_specification_ids = this.delete_specification_ids.join(',');

    this.goodsManagementHttpService.requestModifyCommoditySpecificationData(commodity_id, specificationParams).subscribe(() => {
      this.processSuccess();
    }, err => {
      this.onSubmitSubscription = null;
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

          for (const content of error.errors) {
            if (content.field === 'specification_objs' && content.code === 'invalid') {
              this.globalService.promptBox.open('产品规格对象列表错误或无效！', null, 2000, null, false);
            } else if (content.field === 'delete_specification_ids' && content.code === 'invalid') {
              this.globalService.promptBox.open('删除产品规格参数错误或无效！', null, 2000, null, false);
            } else if (content.resource === 'specifications' && content.code === 'errors') {
              this.globalService.promptBox.open('产品规格保存失败，请重新编辑保存！', () => {
                const navigateUrl = this.commodity_id ? `../../list/edit/${commodity_id}` : `../list/edit/${commodity_id}`;
                this.router.navigate([navigateUrl], { relativeTo: this.route });
              }, 2000, null, false);
            }
          }
        }
      }
    });
  }

  // 校验产品参数是否有效
  private checkCommodityParamsValid(isCheckCommodity: boolean = true): boolean {
    const stockReg = /^((0|[1-9]\d{0,3})|10000)$/; // 库存可输入0-10000数字
    this.initErrMsg(true);

    if (isCheckCommodity) {
      if (!this.CheckImgValid) {
        this.imgErrMsgItem.isError = true;
        this.imgErrMsgItem.errMes = '请选择产品图片！';
        return false;
      }
      if (!this.CheckEditorValid) {
        this.editorErrMsgItem.isError = true;
        this.editorErrMsgItem.errMes = '请填写产品描述！';
        return false;
      }
    }

    for (let specificationIndex = 0; specificationIndex < this.FormatCommoditySpecificationList.length; specificationIndex++) {
      const specificationItem = this.FormatCommoditySpecificationList[specificationIndex];
      const specificationItemParams = specificationItem.specification_params;
      if (isNullOrUndefined(specificationItemParams.specification_name) ||
        (specificationItemParams.specification_name === '') ||
        isNullOrUndefined(Number(specificationItemParams.unit_original_price)) ||
        (isNullOrUndefined(Number(specificationItemParams.unit_sell_price)) && this.commodityInfo.validity_type === 1) ||
        (specificationItemParams.stock_json && isNullOrUndefined(specificationItemParams.stock_json.unit_sell_price_day)
          && this.commodityInfo.validity_type === 2) ||
        isNullOrUndefined(Number(specificationItemParams.settlement_price)) ||
        (isNullOrUndefined(specificationItemParams.stock) && this.commodityInfo.validity_type === 1) ||
        (specificationItemParams.stock_json && isNullOrUndefined(specificationItemParams.stock_json.stock_day)
          && this.commodityInfo.validity_type === 2) || (!specificationItemParams.stock_json && this.commodityInfo.validity_type === 2)) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格未填写！`;
        return false;
      }
      if (!ValidateHelper.Length(specificationItemParams.specification_name, 1, 20)) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格名称格式错误，请输入1-100字规格名称！`;
        return false;
      }
      if (this.commodityInfo.commodity_type === 3 && !specificationItemParams.coupon_group_ids && !specificationItemParams.template_coupon_ids) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格优惠券模板ID和券组ID至少填写一个！`;
        return false;
      }
      for (const specificationItemIndex in this.FormatCommoditySpecificationList) {
        const diffSpecificationItem = this.FormatCommoditySpecificationList[specificationItemIndex];
        const diffSpecificationItemParams = diffSpecificationItem.specification_params;

        if ((specificationItem.idCount !== diffSpecificationItem.idCount) &&
          (specificationItemParams.specification_name === diffSpecificationItemParams.specification_name)) {
          this.specificationErrMsgItem.isError = true;
          this.specificationErrMsgItem.errMes = `第${Number(specificationItemIndex) + 1}个规格名称与第${specificationIndex + 1}个规格名称重复！`;
          return false;
        }
      }
      if ((Number(specificationItemParams.unit_original_price) < 0.01) || (Number(specificationItemParams.unit_original_price) > 999999.99)) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格原价输入错误，请输入0.01-999999.99！`;
        return false;
      }
      if ((Number(specificationItemParams.settlement_price) < 0.01) || (Number(specificationItemParams.settlement_price) > 999999.99)) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格结算价输入错误，请输入0.01-999999.99！`;
        return false;
      }
      if ((this.commodityInfo.validity_type !== 2 && (Number(specificationItemParams.unit_sell_price) < 0.01 || Number(specificationItemParams.unit_sell_price) > 999999.99)) ||
        (this.commodityInfo.validity_type === 2 && (specificationItemParams.stock_json.unit_sell_price_day < 0.01 || specificationItemParams.stock_json.unit_sell_price_day > 999999.99))) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格售价输入错误，请输入0.01-999999.99！`;
        return false;
      }
      if (Number(specificationItemParams.settlement_price) > Number(specificationItemParams.unit_original_price)) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格结算价应小于等于原价！`;
        return false;
      }
      if ((this.commodityInfo.validity_type !== 2 && Number(specificationItemParams.unit_sell_price) > Number(specificationItemParams.unit_original_price)) ||
        (this.commodityInfo.validity_type === 2 && Number(specificationItemParams.stock_json.unit_sell_price_day) > Number(specificationItemParams.unit_original_price))) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格售价应小于等于原价！`;
        return false;
      }
      if ((this.commodityInfo.validity_type !== 2 && !stockReg.test(specificationItemParams.stock.toString())) ||
        (this.commodityInfo.validity_type === 2 && !stockReg.test(specificationItemParams.stock_json.stock_day.toString()))) {
        this.specificationErrMsgItem.isError = true;
        this.specificationErrMsgItem.errMes = `第${specificationIndex + 1}个规格库存输入错误，请输入0-10000！`;
        return false;
      }
    }
    return true;
  }

  // 上传图片/视频错误信息处理
  private upLoadErrMsg(err: any) {
    this.onSubmitSubscription = null;
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.globalService.promptBox.open('参数错误，可能文件格式错误！', null, 2000, null, false);
      } else if (err.status === 413) {
        this.globalService.promptBox.open('上传资源文件太大，服务器无法保存！', null, 2000, null, false);
      } else if (err.status === 500) {
        this.globalService.promptBox.open('服务器出问题了，请刷新后再次尝试！', null, 2000, null, false);
      } else if (err.status === 404) {
        this.globalService.promptBox.open('请求地址错误！', null, 2000, null, false);
      }
    }
  }

  // 处理成功处理
  private processSuccess() {
    const msg = this.commodity_id ? '编辑成功！' : '新建成功！';
    this.globalService.promptBox.open(msg, () => {
      this.onSubmitSubscription = null;
      this.router.navigate([this.listRelativePath], { relativeTo: this.route });
    });
  }

  // 处理错误消息
  private processError(err: any) {
    this.onSubmitSubscription = null;
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.field === 'commodity_name' && content.code === 'missing_field') {
            this.globalService.promptBox.open('产品名称未填写！', null, 2000, null, false);
          } else if (content.field === 'commodity_name' && content.code === 'invalid') {
            this.globalService.promptBox.open('产品名称错误或无效！', null, 2000, null, false);
          } else if (content.field === 'subtitle' && content.code === 'missing_field') {
            this.globalService.promptBox.open('副标题未填写！', null, 2000, null, false);
          } else if (content.field === 'subtitle' && content.code === 'invalid') {
            this.globalService.promptBox.open('副标题错误或无效！', null, 2000, null, false);
          } else if (content.field === 'sort_id' && content.code === 'missing_field') {
            this.globalService.promptBox.open('所属分类未选择！', null, 2000, null, false);
          } else if (content.field === 'sort_id' && content.code === 'invalid') {
            this.globalService.promptBox.open('所属分类错误或无效！', null, 2000, null, false);
          } else if (content.field === 'cover_image' && content.code === 'missing_field') {
            this.globalService.promptBox.open('封面图片未选择！', null, 2000, null, false);
          } else if (content.field === 'cover_image' && content.code === 'invalid') {
            this.globalService.promptBox.open('封面图片错误或无效！', null, 2000, null, false);
          } else if (content.field === 'commodity_images' && content.code === 'missing_field') {
            this.globalService.promptBox.open('产品图片未选择！', null, 2000, null, false);
          } else if (content.field === 'commodity_images' && content.code === 'invalid') {
            this.globalService.promptBox.open('产品图片错误或无效！', null, 2000, null, false);
          } else if (content.field === 'commodity_videos' && content.code === 'missing_field') {
            this.globalService.promptBox.open('视频未选择！', null, 2000, null, false);
          } else if (content.field === 'commodity_videos' && content.code === 'invalid') {
            this.globalService.promptBox.open('视频错误或无效！', null, 2000, null, false);
          } else if (content.field === 'commodity_description' && content.code === 'missing_field') {
            this.globalService.promptBox.open('产品描述未填写！', null, 2000, null, false);
          } else if (content.field === 'commodity_description' && content.code === 'invalid') {
            this.globalService.promptBox.open('产品描述错误或无效！', null, 2000, null, false);
          }
        }
      }
    }
  }

  // 更改商品类型
  public onChangeCommodityType(name: string, stutas: number) {
    this.commodityInfo[name] = stutas;
    if (name === 'shipping_method' && stutas === 1) {
      this.commodityInfo.collection_type = '1';
    }
  }

  // 设置价格日历
  public onSettingPriceClick(data: SpecificationEntity, index: number) {
    this.initErrMsg();
    this.start_time = null;
    this.end_time = null;
    this.weekList.forEach(value => {
      value.checked = false;
    });
    this.specificationIndex = index;
    data.stock_json = data.stock_json ? data.stock_json : new SpecificationDateEntity();
    this.currentSpecification = JSON.parse(JSON.stringify(data.stock_json));
    this.start_time = this.currentSpecification.start_time ? new Date(this.currentSpecification.start_time * 1000) : null;
    this.end_time = this.currentSpecification.end_time ? new Date(this.currentSpecification.end_time * 1000) : null;
    if (this.currentSpecification.week_range) {
      this.weekList.forEach((value, weekIndex) => {
        this.currentSpecification.week_range.forEach(value1 => {
          if (weekIndex === value1 - 1) {
            value.checked = true;
          }
        });
      });
    }
    // this.onDateChange();
    $(this.pricePromptDiv.nativeElement).modal('show');
  }

  // 弹框close
  public onClose() {
    this.currentSpecification = new SpecificationDateEntity();
    $(this.pricePromptDiv.nativeElement).modal('hide');
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  /**
   * 校验价格日历
   * @returns boolean
   */
  public get CheckPriceDateValid(): boolean {
    let checkValid = false;
    this.weekList.forEach(value => {
      if (value.checked) {
        checkValid = true;
      }
    });
    return checkValid;
  }

  // form提交
  public onEditFormSubmit() {
    this.currentSpecification.start_time = this.start_time ? new Date(this.start_time).getTime() / 1000 : null;
    this.currentSpecification.end_time = this.end_time ? new Date(this.end_time).getTime() / 1000 : null;
    const weeks = [];
    this.weekList.forEach((value, index) => {
      if (value.checked) {
        weeks.push(index + 1);
      }
    });
    this.currentSpecification.week_range = weeks;
    this.commoditySpecificationList[this.specificationIndex].specification_params.stock_json = this.currentSpecification;
    $(this.pricePromptDiv.nativeElement).modal('hide');
  }

  /**
  * 选择价格日历时间范围
  * type 选择类型 1：全选 2：工作日 3：周末
  */
  public onChooseDateClick(type) {
    switch (type) {
      case 1:
        this.weekList.forEach(value => {
          value.checked = true;
        });
        break;
      case 2:
        this.weekList.forEach((value, index) => {
          if (index < 5) {
            value.checked = true;
          } else {
            value.checked = false;
          }
        });
        break;
      case 3:
        this.weekList.forEach((value, index) => {
          if (index < 5) {
            value.checked = false;
          } else {
            value.checked = true;
          }
        });
        break;
    }
  }

  // 根据日期变化设置week可选范围
  public onDateChange() {
    /* const start_index = this.start_time.getDay() - 1;
     const end_index = this.end_time.getDay() > 0 ? this.end_time.getDay() - 1 : 6;
     this.weekList.forEach((value) => {
         value.disabled = false;
     });
     // 不夸周的设置，跨周全部可选
     if (this.end_time.getDate() - this.start_time.getDate() <  6) {
         // 开始日期在weekList中index大于结束日期的判断
         if (start_index > end_index) {
             this.weekList.forEach((value, index) => {
                 if (start_index > index && end_index < index) {
                     value.checked = false;
                     value.disabled = true;
                 }
             });
         } else if (start_index < end_index) { // 开始日期在weekList中index小于结束日期的判断
             this.weekList.forEach((value, index) => {
                 if (start_index > index || end_index < index) {
                     value.checked = false;
                     value.disabled = true;
                 }
             });
         } else {
             this.weekList.forEach((value, index) => { // 开始日期结束日期同一天的，只能选一天
                 if (start_index !== index) {
                     value.checked = false;
                     value.disabled = true;
                 }
             });
         }
     }*/
  }

  // 价格日历日期开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) < 0) {
      return true;
    } else if (!startValue || !this.end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 价格日历日期结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) < 0) {
      return true;
    } else if (!endValue || !this.start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * 错误信息
 */
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

/**
 * 视频规格参数
 */
export class SpecificationParamsItem {
  public static IDCount = 0;
  public idCount: number = SpecificationParamsItem.IDCount += 1;
  public specification_params: SpecificationEntity = new SpecificationEntity(); // 视频规格参数列表
  public is_create = true; // 是否新建
  public is_delete = false; // 是否删除

  constructor(sourceSpecification?: SpecificationParamsItem) {
    if (sourceSpecification) {
      this.specification_params = sourceSpecification.specification_params;
      this.is_delete = sourceSpecification.is_delete;
    }
  }
}
