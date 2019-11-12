import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs/index';
import { isNullOrUndefined } from 'util';
import { GlobalService } from '../../../../core/global.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ZVideoSelectComponent } from '../../../../share/components/z-video-select/z-video-select.component';
import { GoodsEditorComponent } from './goods-editor/goods-editor.component';
import { CommodityEntity, GoodsManagementHttpService, SpecificationEntity } from '../goods-management-http.service';

@Component({
    selector: 'app-goods-create',
    templateUrl: './goods-create.component.html',
    styleUrls: ['./goods-create.component.css']
})
export class GoodsCreateComponent implements OnInit {

    public commodityInfo: CommodityEntity = new CommodityEntity();

    public commoditySpecificationList: Array<SpecificationParamsItem> = []; // 视频规格数据列表

    public commodityNameErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 产品名称错误信息

    public subtitleErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 副标题错误信息

    public imgErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加图片错误信息

    public videoErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 添加视频错误信息

    public specificationErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 产品规格错误信息

    public editorErrMsgItem: ErrMessageItem = new ErrMessageItem(); // 编辑器错误信息

    private commodity_id: string;

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
        return formatCommoditySpecificationList;
    }

    /**
     * 校验视频规格数据列表最后一条是否有效
     * @returns {boolean}
     * @constructor
     */
    public get CheckLastCommoditySpecificationValid(): boolean {
        const lastCommoditySpecificationItem = this.FormatCommoditySpecificationList[this.FormatCommoditySpecificationList.length - 1].specification_params;
        if (isNullOrUndefined(lastCommoditySpecificationItem.specification_name) ||
            isNullOrUndefined(lastCommoditySpecificationItem.unit_original_price) ||
            isNullOrUndefined(lastCommoditySpecificationItem.unit_sell_price) ||
            isNullOrUndefined(lastCommoditySpecificationItem.stock)) {
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

        } else {
            this.commoditySpecificationList.push(new SpecificationParamsItem());
        }
    }

    // 清除错误信息
    public onClearErrMsg() {
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

    // 点击添加商品规格
    public onAddCommoditySpecification(specificationIndex: number) {
        if (!this.CheckLastCommoditySpecificationValid) {
            return;
        }
        console.log(this.FormatCommoditySpecificationList);
        this.commoditySpecificationList.push(new SpecificationParamsItem());
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

    // 点击提交添加/编辑商品数据
    public onAddOrEditCommoditySubmit() {

    }

    // 点击取消添加/编辑
    public onCancelClick() {

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
