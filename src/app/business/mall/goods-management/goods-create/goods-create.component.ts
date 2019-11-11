import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

    public commoditySpecificationList: Array<SpecificationParamsItem> = [];

    public imgErrPositionItem: ErrPositionItem = new ErrPositionItem(); // 添加图片错误信息

    public videoErrPositionItem: ErrPositionItem = new ErrPositionItem(); // 添加视频错误信息

    public commodityErrMsg = ''; // 错误信息

    private commodity_id: string;

    @ViewChild('goodsImg', {static: false}) public goodsImgSelectComponent: ZPhotoSelectComponent;

    @ViewChild('goodsVideo', {static: false}) public goodsVideoSelectComponent: ZVideoSelectComponent;

    @ViewChild('goodsEditor', {static: true}) public goodsEditorComponent: GoodsEditorComponent;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private goodsManagementHttpService: GoodsManagementHttpService) {
        this.route.paramMap.subscribe(map => {
            this.commodity_id = map.get('commodity_id');
        });
    }

    public ngOnInit() {
        this.commoditySpecificationList.push(new SpecificationParamsItem());
    }

    // 清除错误信息
    public onClearErrMsg() {
        this.commodityErrMsg = '';
    }

    // 选择图片
    public onSelectedPicture(event: any) {
        this.onClearErrMsg();
        this.imgErrPositionItem.icon.isError = false;
        if (event === 'type_error') {
            this.imgErrPositionItem.icon.isError = true;
            this.imgErrPositionItem.icon.errMes = '格式错误，请重新上传！';
        } else if (event === 'size_over') {
            this.imgErrPositionItem.icon.isError = true;
            this.imgErrPositionItem.icon.errMes = '图片大小不得高于2M！';
        }
    }

    // 选择视频
    public onSelectedVideo(event: any) {
        this.onClearErrMsg();
        this.videoErrPositionItem.icon.isError = false;
        if (event === 'type_error') {
            this.videoErrPositionItem.icon.isError = true;
            this.videoErrPositionItem.icon.errMes = '格式错误，请重新上传！';
        } else if (event === 'size_over') {
            this.videoErrPositionItem.icon.isError = true;
            this.videoErrPositionItem.icon.errMes = '视频大小不得高于20M！';
        }
    }

    // 点击提交添加/编辑商品数据
    public onAddOrEditCommoditySubmit() {

    }

    // 点击取消添加/编辑
    public onCancelClick() {

    }
}

/**
 * 图片/视频错误信息
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

export class ErrPositionItem {
    public icon: ErrMessageItem = new ErrMessageItem();

    public ic_name: ErrMessageItem = new ErrMessageItem();

    constructor(icon?: ErrMessageItem, title?: ErrMessageItem, ic_name?: ErrMessageItem, corner?: ErrMessageItem) {
        if (isNullOrUndefined(icon) || isNullOrUndefined(ic_name)) {
            return;
        }
        this.icon = icon;
        this.ic_name = ic_name;
    }
}

/**
 * 视频规格参数
 */
export class SpecificationParamsItem {
    public specification_params: Array<SpecificationEntity> = []; // 视频规格参数列表
    public is_delete = false; // 是否删除

    constructor(sourceSpecification?: SpecificationParamsItem) {
        if (sourceSpecification) {
            this.specification_params = sourceSpecification.specification_params;
            this.is_delete = sourceSpecification.is_delete;
        }
    }
}
