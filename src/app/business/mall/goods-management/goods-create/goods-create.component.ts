import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs/index';
import { isNullOrUndefined } from 'util';
import { ValidateHelper } from '../../../../../utils/validate-helper';
import { KeyboardHelper } from '../../../../../utils/keyboard-helper';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ZVideoSelectComponent } from '../../../../share/components/z-video-select/z-video-select.component';
import { GoodsEditorComponent } from './goods-editor/goods-editor.component';
import {
    CommodityEntity,
    GoodsManagementHttpService,
    SpecificationEntity,
    SpecificationParams
} from '../goods-management-http.service';

@Component({
    selector: 'app-goods-create',
    templateUrl: './goods-create.component.html',
    styleUrls: ['./goods-create.component.css']
})
export class GoodsCreateComponent implements OnInit {

    public levelTwoName = '新建产品';

    public listRelativePath = '../list';

    public commodityInfo: CommodityEntity = new CommodityEntity();

    public commoditySpecificationList: Array<SpecificationParamsItem> = []; // 视频规格数据列表

    public commodityNameErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 产品名称错误信息

    public subtitleErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 副标题错误信息

    public imgErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加图片错误信息

    public videoErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加视频错误信息

    public specificationErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 产品规格错误信息

    public editorErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 编辑器错误信息

    private commodity_id: string;

    private onSubmitSubscription: any;

    @ViewChild('goodsImg', {static: false}) public goodsImgSelectComponent: ZPhotoSelectComponent;

    @ViewChild('goodsVideo', {static: false}) public goodsVideoSelectComponent: ZVideoSelectComponent;

    @ViewChild('goodsEditor', {static: true}) public goodsEditorComponent: GoodsEditorComponent;


    /**
     * 格式化商品规格列表数据
     * @returns {Array<SpecificationParamsItem>}
     * @constructor
     */
    public get FormatCommoditySpecificationList(): Array<SpecificationParamsItem> {
        const formatCommoditySpecificationList: Array<SpecificationParamsItem> = [];
        this.commoditySpecificationList.forEach(commoditySpecificationItem => {
            if (!commoditySpecificationItem.is_delete) {
                formatCommoditySpecificationList.push(commoditySpecificationItem);
            }
        });
        formatCommoditySpecificationList.forEach((formatItem, index) => {
            KeyboardHelper.bindElement('unit_original_price_' + index);
            KeyboardHelper.bindElement('unit_sell_price_' + index);
            KeyboardHelper.bindElement('stock_' + index);
        });
        return formatCommoditySpecificationList;
    }

    /**
     * 校验商品规格数据列表最后一条是否有效
     * @returns {boolean}
     * @constructor
     */
    public get CheckLastCommoditySpecificationValid(): boolean {
        if (this.FormatCommoditySpecificationList.length > 0) {
            const lastCommoditySpecificationItem = this.FormatCommoditySpecificationList[this.FormatCommoditySpecificationList.length - 1].specification_params;
            if (isNullOrUndefined(lastCommoditySpecificationItem.specification_name) ||
                isNullOrUndefined(lastCommoditySpecificationItem.unit_original_price) ||
                isNullOrUndefined(lastCommoditySpecificationItem.unit_sell_price) ||
                isNullOrUndefined(lastCommoditySpecificationItem.stock)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 校验是否选择了图片
     * @returns {boolean}
     * @constructor
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
     * 校验是否填写商品规格数据
     * @returns {boolean}
     * @constructor
     */
    public get CheckCommoditySpecificationValid(): boolean {
        if (this.FormatCommoditySpecificationList.length > 0) {
            const formatCommoditySpecificationLen = this.FormatCommoditySpecificationList.length - 1;
            const lastCommoditySpecificationItem = this.FormatCommoditySpecificationList[formatCommoditySpecificationLen].specification_params;
            if ((formatCommoditySpecificationLen === 0) && (isNullOrUndefined(lastCommoditySpecificationItem.specification_name) ||
                    isNullOrUndefined(lastCommoditySpecificationItem.unit_original_price) ||
                    isNullOrUndefined(lastCommoditySpecificationItem.unit_sell_price) ||
                    isNullOrUndefined(lastCommoditySpecificationItem.stock))) {
                return false;
            }
        }
        return true;
    }

    /**
     * 校验是否填写编辑器内容
     * @returns {boolean}
     * @constructor
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
                private goodsManagementHttpService: GoodsManagementHttpService) {
        this.route.paramMap.subscribe(map => {
            this.commodity_id = map.get('commodity_id');
        });
    }

    public ngOnInit() {
        if (this.commodity_id) {
            this.levelTwoName = '编辑产品';
            this.listRelativePath = '../../list';

            timer(150).subscribe(() => {
                this.requestCommodityById();
            });
        } else {
            this.commoditySpecificationList.push(new SpecificationParamsItem());
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


    /**
     * 商品规格数据转换
     * 如01转为1
     * 1.0转为1
     * @param {number} specificationIndex
     * @param event
     * @param {number} reverseType 转换类型 1：原价；2：售价；3：库存
     */
    public reverseSpecificationParams(specificationIndex: number, event: any, reverseType: number) {
        const reverseCommoditySpecificationItem = this.commoditySpecificationList[specificationIndex].specification_params;
        if (event.target.value) {
            switch (reverseType) {
                case 1:
                    reverseCommoditySpecificationItem.unit_original_price = parseFloat(event.target.value);
                    break;
                case 2:
                    reverseCommoditySpecificationItem.unit_sell_price = parseFloat(event.target.value);
                    break;
                case 3:
                    reverseCommoditySpecificationItem.stock = parseFloat(event.target.value);
                    break;
            }
        }
    }

    // 点击添加商品规格
    public onAddCommoditySpecification() {
        if (!this.CheckLastCommoditySpecificationValid) {
            return;
        }
        if (this.checkCommodityParamsValid(false)) {
            timer(0).subscribe(() => {
                this.commoditySpecificationList.push(new SpecificationParamsItem());
            });
        }
    }

    // 点击移除商品规格
    public onDeleteCommoditySpecification(specificationIndex: number) {
        const deleteCommoditySpecificationItem = this.commoditySpecificationList[specificationIndex];
        deleteCommoditySpecificationItem.is_delete = true;
        this.commoditySpecificationList.splice(specificationIndex, 1);

        timer(0).subscribe(() => {
            this.commoditySpecificationList.push(deleteCommoditySpecificationItem);
        });
    }

    // 初始化错误消息
    public initErrMsg(initErrMsgType?: string) {
        if (initErrMsgType) {
            switch (initErrMsgType) {
                case 'commodity_name':
                    this.commodityNameErrMsgItem = new ErrMessageItem();
                    break;
                case 'subtitle':
                    this.subtitleErrMsgItem = new ErrMessageItem();
                    break;
                case 'specification':
                    this.specificationErrMsgItem = new ErrMessageItem();
                    break;
            }
        } else {
            this.commodityNameErrMsgItem = new ErrMessageItem();
            this.subtitleErrMsgItem = new ErrMessageItem();
            this.imgErrMsgItem = new ErrMessageItem();
            this.videoErrMsgItem = new ErrMessageItem();
            this.specificationErrMsgItem = new ErrMessageItem();
            this.editorErrMsgItem = new ErrMessageItem();
        }
    }

    // 点击提交添加/编辑商品数据
    public onAddOrEditCommoditySubmit() {
        if (this.onSubmitSubscription || !this.checkCommodityParamsValid()) {
            return;
        }
        this.onSubmitSubscription = this.goodsImgSelectComponent.upload().subscribe(() => {
            const createOrEditCommodity = () => {
                this.commodityInfo.commodity_images = this.goodsImgSelectComponent.imageList.map(i => i.sourceUrl);
                this.commodityInfo.commodity_description = CKEDITOR.instances.goodsEditor.getData();

                if (this.commodity_id) {
                    this.requestEditCommodity();
                } else {
                    this.requestCreateCommodity();
                }
            };
            if (this.goodsVideoSelectComponent.videoList.length > 0) {
                this.goodsVideoSelectComponent.uploadVideo().subscribe(() => {
                    this.commodityInfo.commodity_videos = this.goodsVideoSelectComponent.videoList.map(i => i.sourceUrl);
                    createOrEditCommodity();
                }, err => {
                    this.upLoadErrMsg(err);
                });
            } else {
                createOrEditCommodity();
            }
        }, err => {
            this.upLoadErrMsg(err);
        });
    }

    // 点击取消添加/编辑
    public onCancelClick() {
        this.router.navigate([this.listRelativePath], {relativeTo: this.route});
    }

    // 获取商品详情
    private requestCommodityById() {
        this.goodsManagementHttpService.requestCommodityByIdData(this.commodity_id).subscribe(data => {
            this.commodityInfo = data;
            this.commodityInfo.specifications.forEach(specificationItem => {
                const tempSpecificationItem = new SpecificationParamsItem();
                tempSpecificationItem.specification_params = new SpecificationEntity(specificationItem);
                tempSpecificationItem.is_create = false;
                this.commoditySpecificationList.push(tempSpecificationItem);
            });
            CKEDITOR.instances.goodsEditor.destroy(true);
            CKEDITOR.replace('goodsEditor').setData(this.commodityInfo.commodity_description);
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    // 创建商品
    private requestCreateCommodity() {
        this.goodsManagementHttpService.requestCreateCommodityData(this.commodityInfo).subscribe(data => {
            this.requestModifyCommoditySpecification(data.commodity_id);
        }, err => {
            this.processError(err);
        });
    }

    // 修改商品
    private requestEditCommodity() {
        this.goodsManagementHttpService.requestEditCommodityData(this.commodity_id, this.commodityInfo).subscribe(() => {
            this.requestModifyCommoditySpecification(this.commodity_id);
        }, err => {
            this.processError(err);
        });
    }

    // 创建/修改规格
    private requestModifyCommoditySpecification(commodity_id: string) {
        const delete_specification_ids = [];
        const specificationParams = new SpecificationParams();
        specificationParams.specification_objs = [];
        this.commoditySpecificationList.forEach(commoditySpecificationItem => {
            if (!commoditySpecificationItem.is_delete) {
                specificationParams.specification_objs.push(commoditySpecificationItem.specification_params);
            } else if (!commoditySpecificationItem.is_create) {
                delete_specification_ids.push(commoditySpecificationItem.specification_params.specification_id);
            }
        });
        specificationParams.delete_specification_ids = delete_specification_ids.join(',');

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
                                const navigateUrl = this.commodity_id ? `../../edit/${commodity_id}` : `../edit/${commodity_id}`;
                                this.router.navigate([navigateUrl], {relativeTo: this.route});
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
        this.initErrMsg();

        if (isCheckCommodity) {
            if (this.commodityInfo.commodity_name) {
                if (!ValidateHelper.Length(this.commodityInfo.commodity_name, 1, 20)) {
                    this.commodityNameErrMsgItem.isError = true;
                    this.commodityNameErrMsgItem.errMes = '产品名称格式错误，请输入1-20个字标题！';
                    return false;
                }
            }
            if (this.commodityInfo.subtitle) {
                if (!ValidateHelper.Length(this.commodityInfo.subtitle, 0, 80)) {
                    this.subtitleErrMsgItem.isError = true;
                    this.subtitleErrMsgItem.errMes = '副标题格式错误，请输入0-80个字副标题！';
                    return false;
                }
            }
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
        if (!this.CheckCommoditySpecificationValid) {
            this.specificationErrMsgItem.isError = true;
            this.specificationErrMsgItem.errMes = '请填写产品规格！';
            return false;
        }
        const lastCommoditySpecificationItem = this.FormatCommoditySpecificationList[this.FormatCommoditySpecificationList.length - 1].specification_params;
        if (!ValidateHelper.Length(lastCommoditySpecificationItem.specification_name, 1, 10)) {
            this.specificationErrMsgItem.isError = true;
            this.specificationErrMsgItem.errMes = '规格名称格式错误，请输入1-10字规格名称！';
            return false;
        }
        for (let specificationIndex = 0; specificationIndex < this.FormatCommoditySpecificationList.length - 1; specificationIndex++) {
            const specificationParams = this.FormatCommoditySpecificationList[specificationIndex].specification_params;
            if (lastCommoditySpecificationItem.specification_name === specificationParams.specification_name) {
                this.specificationErrMsgItem.isError = true;
                this.specificationErrMsgItem.errMes = '规格名称不能相同，请重新输入！';
                return false;
            }
        }
        if ((lastCommoditySpecificationItem.unit_original_price < 0.01) ||
            (lastCommoditySpecificationItem.unit_original_price > 999999.99)) {
            this.specificationErrMsgItem.isError = true;
            this.specificationErrMsgItem.errMes = '原价可输入0.01-999999.99！';
            return false;
        }
        if ((lastCommoditySpecificationItem.unit_sell_price < 0.01) ||
            (lastCommoditySpecificationItem.unit_sell_price > 999999.99)) {
            this.specificationErrMsgItem.isError = true;
            this.specificationErrMsgItem.errMes = '售价可输入0.01-999999.99！';
            return false;
        }
        if (!stockReg.test(lastCommoditySpecificationItem.stock.toString())) {
            this.specificationErrMsgItem.isError = true;
            this.specificationErrMsgItem.errMes = '库存可输入0-10000！';
            return false;
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
        this.onSubmitSubscription = null;
        const msg = this.commodity_id ? '编辑成功！' : '新建成功！';
        this.globalService.promptBox.open(msg, () => {
            this.router.navigate([this.listRelativePath], {relativeTo: this.route});
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
