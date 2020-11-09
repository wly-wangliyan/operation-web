import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { IntegralMallHttpService, EditCommodityParams } from '../integral-mall-http.service';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../utils/error-message-helper';
import { timer } from 'rxjs';
import { BusinessEntity } from '../../../../mall/business-management/business-management.service';
import {
    GoodsManagementHttpService,
    SpecificationEntity,
    SpecificationParams
} from '../../../../mall/goods-management/goods-management-http.service';
import { DateFormatHelper, TimeItem } from '../../../../../../utils/date-format-helper';

@Component({
    selector: 'app-commodity-edit',
    templateUrl: './commodity-edit.component.html',
    styleUrls: ['./commodity-edit.component.less']
})
export class CommodityEditComponent implements OnInit, OnDestroy {
    public sourceType: 1 | 2 | 3; // 1:新建2:编辑3:查看
    public commodity_id: string; // 商品id
    public specification_id: string; // 规格id
    public commodity_type: number; // 商品类型
    public commodityInfo: EditCommodityParams = new EditCommodityParams(); // 商品详情
    public errMessageGroup: ErrMessageGroup = new ErrMessageGroup(); // 错误处理
    public coverImgList: Array<any> = []; // 封面图片
    public aspectRatio = 1.93 / 1; // 截取图片比例
    public businessList: Array<BusinessEntity> = []; // 商家列表
    public specificationList: Array<SpecificationEntity> = []; // 规格对象列表
    private onSubmitSubscription: any;
    public imgReg = /(png|jpg|jpeg|gif)$/; // 默认图片校验格式

    public distributionTime: TimeItem = new TimeItem(); // 发放时间

    @ViewChild('coverImg', {static: false}) public coverImgSelectComponent: ZPhotoSelectComponent;

    @ViewChild('commodityImg', {static: false}) public commodityImgSelectComponent: ZPhotoSelectComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private globalService: GlobalService,
        private goodsManagementHttpService: GoodsManagementHttpService,
        private integralMallHttpService: IntegralMallHttpService) {
        this.route.paramMap.subscribe(map => {
            this.commodity_id = map.get('commodity_id');
            this.specification_id = map.get('specification_id');
            this.commodity_type = Number(map.get('commodity_type'));
            this.sourceType = this.specification_id ? 1 : this.commodity_type as any;
        });
    }

    public ngOnInit() {
        this.clearErr();
        this.businessList = [];
        this.requestbusinessList();
        if (this.commodity_id) {
            if (this.specification_id) {
                this.requestCommodityById();
            } else {
                this.requestIntegralCommodityById();
            }
        }
    }

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
     * 校验是否填写编辑器内容
     * @returns boolean
     */
    public get CheckEditorValid(): boolean {
        return !(!CKEDITOR.instances.commodityEditor || !CKEDITOR.instances.commodityEditor.getData());
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
                commodityInfo.people_buy_max_num = this.commodityInfo.people_buy_max_num || -1;
                commodityInfo.day_buy_max_num = this.commodityInfo.day_buy_max_num || -1;
                commodityInfo.freight_fee = Math.round(this.commodityInfo.freight_fee * 100);
                commodityInfo.day_distribution_time = DateFormatHelper.getSecondTimeSum(this.distributionTime, 'ss');
                if (!this.specification_id) {
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
            window.history.back();
        });
    }

    public ngOnDestroy() {
        CKEDITOR.instances.commodityEditor && CKEDITOR.instances.commodityEditor.destroy(true);
    }

    // 获取商家列表
    private requestbusinessList() {
        this.goodsManagementHttpService.requestBusinessListData().subscribe(data => {
            this.businessList = data;
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    // 获取积分商品详情
    private requestIntegralCommodityById() {
        this.integralMallHttpService.requestCommodityDetailData(this.commodity_id).subscribe(data => {
            this.commodityInfo = new EditCommodityParams(data);
            this.distributionTime = DateFormatHelper.getMinuteOrTime(data.day_distribution_time, 'ss');
            this.specificationList = data.specifications.map(item => new SpecificationEntity(item));
            this.coverImgList = this.commodityInfo.cover_image ? this.commodityInfo.cover_image.split(',') : [];
            timer(500).subscribe(() => {
                const tempContent = this.commodityInfo.commodity_description.replace('/\r\n/g', '').replace(/\n/g, '');
                CKEDITOR.instances.commodityEditor.setData(tempContent);
                this.sourceType === 3 && CKEDITOR.instances.commodityEditor.setReadOnly(true);
            });
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                this.globalService.promptBox.open('商品详情获取失败！', null, 2000, null, false);
            }
        });
    }

    // 获取商城商品详情
    private requestCommodityById() {
        this.goodsManagementHttpService.requestCommodityByIdData(this.commodity_id).subscribe(data => {
            this.commodityInfo = new EditCommodityParams(data);
            const specification = data.specifications.find(item => item.specification_id === this.specification_id);
            specification.specification_id = '';
            specification.remote_specification_id = this.specification_id;
            specification.sold_amount = 0;
            this.specificationList = [new SpecificationEntity(specification)];
            this.coverImgList = this.commodityInfo.cover_image ? this.commodityInfo.cover_image.split(',') : [];
            timer(500).subscribe(() => {
                const tempContent = this.commodityInfo.commodity_description.replace('/\r\n/g', '').replace(/\n/g, '');
                CKEDITOR.instances.commodityEditor.setData(tempContent);
                this.sourceType === 3 && CKEDITOR.instances.commodityEditor.setReadOnly(true);
            });
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                this.globalService.promptBox.open('商品详情获取失败！', null, 2000, null, false);
            }
        });
    }

    /**
     * 创建商品
     * @param commodityInfo
     * @private
     */
    private requestCreateCommodity(commodityInfo: EditCommodityParams) {
        this.integralMallHttpService.requestAddCommodityData(commodityInfo).subscribe((data) => {
            this.requestModifyCommoditySpecification(data.commodity_id);
        }, err => {
            this.processError(err);
        });
    }

    // 修改商品
    private requestEditCommodity(commodityInfo: EditCommodityParams) {
        this.integralMallHttpService.requestEditCommodityData(this.commodity_id, commodityInfo).subscribe(() => {
            this.requestModifyCommoditySpecification(this.commodity_id);
        }, err => {
            this.processError(err);
        });
    }

    /**
     * 添加商品对应的规格
     * @private
     */
    private requestModifyCommoditySpecification(commodity_id: string) {
        const specificationParams = new SpecificationParams();
        specificationParams.specification_objs = this.specificationList;
        this.integralMallHttpService.requestModifyCommoditySpecificationData(commodity_id, specificationParams).subscribe(() => {
            this.globalService.promptBox.open('编辑商品成功', () => {
                window.history.back();
            });
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

                    for (const content of error.errors) {
                        if (content.field === 'specification_objs' && content.code === 'invalid') {
                            this.globalService.promptBox.open('产品规格对象列表错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'delete_specification_ids' && content.code === 'invalid') {
                            this.globalService.promptBox.open('删除产品规格参数错误或无效！', null, 2000, null, false);
                        } else if (content.resource === 'specifications' && content.code === 'errors') {
                            this.globalService.promptBox.open('产品规格保存失败，请重新编辑保存！', null, 2000, null, false);
                        }
                    }
                }
            }
        });
    }

    // 校验商品参数是否有效
    private checkCommodityParamsValid(isCheckCommodity: boolean = true): boolean {
        this.clearErr();
        const specification = this.specificationList[0];
        if (isCheckCommodity) {
            if (!this.CheckImgValid) {
                this.errMessageGroup.errJson.commodity_images.errMes = '请选择商品图片！';
                return false;
            }
            if (!this.CheckEditorValid) {
                this.globalService.promptBox.open('请填写商品描述！', null, 2000, null, false);
                return false;
            }
            if (specification.integral <= 0) {
                this.globalService.promptBox.open('规格中兑换积分输入错误,请输入大于0的数！', null, 2000, null, false);
                return false;
            }
            if (specification.unit_sell_price && (specification.unit_sell_price < 0.01 || specification.unit_sell_price > 999999.99)) {
                this.globalService.promptBox.open('规格中价格输入错误，请输入0.01-999999.99！', null, 2000, null, false);
                return false;
            }
            const stockReg = /^((0|[1-9]\d{0,3})|10000)$/; // 库存可输入0-10000数字
            if (!stockReg.test(specification.stock.toString())) {
                this.globalService.promptBox.open('规格中库存输入错误，请输入0-10000！', null, 2000, null, false);
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
