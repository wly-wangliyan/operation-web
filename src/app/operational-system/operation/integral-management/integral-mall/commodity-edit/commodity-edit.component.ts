import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { IntegralMallHttpService, EditCommodityParams, CouponEntity } from '../integral-mall-http.service';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../utils/error-message-helper';
import { ChooseMallGoodModalComponent } from '../choose-mall-good-modal/choose-mall-good-modal.component';
import { timer } from 'rxjs';

@Component({
  selector: 'app-commodity-edit',
  templateUrl: './commodity-edit.component.html',
  styleUrls: ['./commodity-edit.component.less']
})
export class CommodityEditComponent implements OnInit, OnDestroy {
  public sourceType: 1 | 2 | 3; // 1:新建2:编辑3:查看
  public commodity_id: string; // 商品id
  public commodity_type: number; // 商品类型
  public commodityInfo: EditCommodityParams; // 商品详情
  public errMessageGroup: ErrMessageGroup = new ErrMessageGroup(); // 错误处理
  public coverImgList: Array<any> = []; // 封面图片
  public aspectRatio = 1.93 / 1; // 截取图片比例
  public imgReg = /(png|jpg|jpeg|gif)$/; // 默认图片校验格式
  private onSubmitSubscription: any;

  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  @ViewChild('commodityImg', { static: false }) public commodityImgSelectComponent: ZPhotoSelectComponent;

  @ViewChild('chooseGood', { static: false }) public chooseGoodComponent: ChooseMallGoodModalComponent;

  /**
   * 校验是否选择了图片
   * @returns boolean
   */
  public get CheckImgValid(): boolean {
    if (this.commodityImgSelectComponent) {
      const images = this.commodityImgSelectComponent.imageList.map(item => item.sourceUrl);
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
    if (!this.commodityInfo.commodity_type) {
      return false;
    }
    return true;
  }

  /**
   * 校验是否填写编辑器内容
   * @returns boolean
   */
  public get CheckEditorValid(): boolean {
    if (!CKEDITOR.instances.commodityEditor || !CKEDITOR.instances.commodityEditor.getData()) {
      return false;
    }
    return true;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private integralMallHttpService: IntegralMallHttpService) {
    this.sourceType = this.router.url.includes('/add') ? 1 : this.router.url.includes('/edit/') ? 2 : 3;
    this.route.paramMap.subscribe(map => {
      this.commodity_id = map.get('commodity_id');
      this.commodity_type = Number(map.get('commodity_type'));
    });
  }

  public ngOnInit() {
    this.clearErr();
    if (this.commodity_id) {
      this.requestCommodityById();
    } else {
      this.commodityInfo = new EditCommodityParams();
      this.commodityInfo.commodity_type = 3; // 优惠券商品
      this.commodityInfo.other_fields = new CouponEntity();
    }
  }

  // 获取商品详情
  private requestCommodityById() {
    this.integralMallHttpService.requestCommodityDetailData(this.commodity_id).subscribe(data => {
      this.commodityInfo = new EditCommodityParams(data);
      this.commodityInfo.other_fields = data.other_fields || new CouponEntity();
      this.coverImgList = this.commodityInfo.cover_image ? this.commodityInfo.cover_image.split(',') : [];
      this.commodityInfo.buy_max_num = data.buy_max_num === -1 ? null : data.buy_max_num;
      timer(500).subscribe(() => {
        const tempContent = this.commodityInfo.commodity_description.replace('/\r\n/g', '').replace(/\n/g, '');
        CKEDITOR.instances.commodityEditor.setData(tempContent);
        this.sourceType === 3 && CKEDITOR.instances.commodityEditor.setReadOnly(true);
      });
    }, err => {
      if (this.globalService.httpErrorProcess(err)) {
        this.globalService.promptBox.open('商品详情获取失败！', null, 2000, null, false);
      }
    });
  }

  /** 更改商品属性 */
  public onChangeCommodityType(name: string, stutas: number): void {
    if (this.commodityInfo[name] === stutas) {
      return;
    }
    this.commodityInfo[name] = stutas;
  }

  /** 点击选用，打开选用商品弹框 */
  public onChooseMallGoodsClick() {
    this.chooseGoodComponent.open(this.commodityInfo.commodity_type);
  }

  // 选用商城商品
  public onSelectedMallGoodData(event: any) {
    const commodityInfo = new EditCommodityParams(event.commodity);
    const tempContent = commodityInfo.commodity_description.replace('/\r\n/g', '').replace(/\n/g, '');
    CKEDITOR.instances.commodityEditor.setData(tempContent);

    if (commodityInfo.commodity_type === 3) {
      commodityInfo.stock = this.commodityInfo.stock;
      commodityInfo.integral_amount = this.commodityInfo.integral_amount;
      commodityInfo.other_fields = this.commodityInfo.other_fields || new CouponEntity();
    }
    this.commodityInfo = commodityInfo;
  }

  /** 初始化错误信息 */
  public clearErr(): void {
    this.errMessageGroup.errJson = {};
    this.errMessageGroup.errJson.cover_image = new ErrMessageBase();
    this.errMessageGroup.errJson.commodity_images = new ErrMessageBase();
  }

  /** 选择图片 */
  public onSelectedPicture(event: any, key: string) {
    if (event === 'type_error') {
      this.errMessageGroup.errJson[key].errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errMessageGroup.errJson[key].errMes = '图片大小不得高于2M！';
    }
  }

  // 点击提交添加/编辑商品数据
  public onAddOrEditCommoditySubmit() {
    if (this.onSubmitSubscription || !this.checkCommodityParamsValid()) {
      return;
    }
    this.onSubmitSubscription = this.coverImgSelectComponent.upload().subscribe(() => {
      this.commodityImgSelectComponent.upload().subscribe(() => {
        this.commodityInfo.cover_image = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
        this.commodityInfo.commodity_images = this.commodityImgSelectComponent.imageList.map(i => i.sourceUrl);
        this.commodityInfo.commodity_description = CKEDITOR.instances.commodityEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');

        const commodityInfo = this.commodityInfo.clone();
        commodityInfo.buy_max_num = this.commodityInfo.buy_max_num || -1;
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

  // 创建商品
  private requestCreateCommodity(commodityInfo: EditCommodityParams) {
    console.log(commodityInfo);
    this.integralMallHttpService.requestAddCommodityData(commodityInfo).subscribe(data => {
      this.globalService.promptBox.open('新建商品成功', () => {
        window.history.back();
      });
    }, err => {
      this.processError(err);
    });
  }

  // 修改商品
  private requestEditCommodity(commodityInfo: EditCommodityParams) {
    this.integralMallHttpService.requestEditCommodityData(this.commodity_id, commodityInfo).subscribe(() => {
      this.globalService.promptBox.open('编辑商品成功', () => {
        window.history.back();
      });
    }, err => {
      this.processError(err);
    });
  }

  // 校验商品参数是否有效
  private checkCommodityParamsValid(isCheckCommodity: boolean = true): boolean {
    this.clearErr();
    if (this.commodityInfo.other_fields) {
      if (this.commodityInfo.other_fields.template_coupon_ids) {
        const ids = this.commodityInfo.other_fields.template_coupon_ids.split(',');
        if (ids.some(id => !id)) {
          this.globalService.promptBox.open('优惠券模板ID格式错误！', null, 2000, null, false);
          return false;
        }
      }
      if (this.commodityInfo.other_fields.coupon_group_ids) {
        const ids = this.commodityInfo.other_fields.coupon_group_ids.split(',');
        if (ids.some(id => !id)) {
          this.globalService.promptBox.open('券组ID格式错误！', null, 2000, null, false);
          return false;
        }
      }
    }
    if (isCheckCommodity) {
      if (!this.CheckImgValid) {
        this.errMessageGroup.errJson.commodity_images.errMes = '请选择商品图片！';
        return false;
      }
      if (!this.CheckEditorValid) {
        this.globalService.promptBox.open('请填写商品描述！', null, 2000, null, false);
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
        this.globalService.promptBox.open('上传资源参数错误，可能文件格式错误！', null, 2000, null, false);
      } else if (err.status === 413) {
        this.globalService.promptBox.open('上传资源文件太大，服务器无法保存！', null, 2000, null, false);
      } else if (err.status === 404) {
        this.globalService.promptBox.open('请求地址错误！', null, 2000, null, false);
      }
    }
  }

  // 点击取消添加/编辑
  public onCancelClick() {
    this.globalService.confirmationBox.open('提示', '是否确认取消编辑？', () => {
      this.globalService.confirmationBox.close();
      window.history.back();
    });
  }

  public ngOnDestroy() {
    CKEDITOR.instances.commodityEditor && CKEDITOR.instances.commodityEditor.destroy(true);
  }

  // 处理错误消息
  private processError(err: any) {
    this.onSubmitSubscription = null;
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.field === 'commodity_name' && content.code === 'missing_field') {
            this.globalService.promptBox.open('商品名称未填写！', null, 2000, null, false);
          } else if (content.field === 'commodity_name' && content.code === 'invalid') {
            this.globalService.promptBox.open('商品名称错误或无效！', null, 2000, null, false);
          } else if (content.field === 'subtitle' && content.code === 'missing_field') {
            this.globalService.promptBox.open('副标题未填写！', null, 2000, null, false);
          } else if (content.field === 'subtitle' && content.code === 'invalid') {
            this.globalService.promptBox.open('副标题错误或无效！', null, 2000, null, false);
          } else if (content.field === 'cover_image' && content.code === 'missing_field') {
            this.globalService.promptBox.open('封面图片未选择！', null, 2000, null, false);
          } else if (content.field === 'cover_image' && content.code === 'invalid') {
            this.globalService.promptBox.open('封面图片错误或无效！', null, 2000, null, false);
          } else if (content.field === 'commodity_images' && content.code === 'missing_field') {
            this.globalService.promptBox.open('商品图片未选择！', null, 2000, null, false);
          } else if (content.field === 'commodity_images' && content.code === 'invalid') {
            this.globalService.promptBox.open('商品图片错误或无效！', null, 2000, null, false);
          } else if (content.field === 'commodity_description' && content.code === 'missing_field') {
            this.globalService.promptBox.open('商品描述未填写！', null, 2000, null, false);
          } else if (content.field === 'commodity_description' && content.code === 'invalid') {
            this.globalService.promptBox.open('商品描述错误或无效！', null, 2000, null, false);
          }
        }
      }
    }
  }
}
