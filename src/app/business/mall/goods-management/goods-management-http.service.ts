import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { EntityBase } from '../../../../utils/z-entity';

/**** 实体类 ****/
/**
 * 商品列表请求参数
 */
export class CommoditySearchParams extends EntityBase {
    public sales_status: number = undefined; // 销售状态 1销售中,2已下架
    public commodity_name: string = undefined; // 商品名称
    public shelf_time: string = undefined; // 商品上架时间 逗号分割 例：1232154,1234546
    public page_size = 45; // 每页数量 默认15
    public page_num = 1; // 第几页 默认1
}

/**
 * 商品操作参数
 */
export class CommodityParams extends EntityBase {
    public commodity_name: string = undefined; // 商品名称
    public subtitle: string = undefined; // 副标题
    public commodity_images: Array<string> = []; // 商品图片列表 ['[http://sdas','http://sdas](http://sdas','http://sdas)']
    public commodity_video: string = undefined; // 商品视频
    public commodity_description: string = undefined; // 商品描述
}

/**
 * 商品上架/下架参数
 */
export class CommodityOperationParams extends EntityBase {
    public operation: number = undefined; // 上下架操作 1.上架 2.下架
}

/**
 * 规格操作参数
 */
export class SpecificationParams extends EntityBase {
    public specification_objs: Array<SpecificationObjEntity> = []; // 规格对象列表 创建/更新
    public delete_specification_ids: string = undefined; // 规格ids 'wq32','2qwe' 删除

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'specification_objs') {
            return SpecificationObjEntity;
        }
        return null;
    }
}

/**
 * 规格对象实体
 */
export class SpecificationObjEntity extends EntityBase {
    public specification_id: string = undefined; // 规格id 没有传null
    public specification_nam: string = undefined; // 规格名称
    public unit_original_price: number = undefined; // 单位分 原价
    public unit_sell_price: number = undefined; // 单位分 售价
    public stock: number = undefined; // 库存
}

/**
 * 商品信息实体
 */
export class CommodityEntity extends EntityBase {
    public commodity_id: string = undefined; // 商品id
    public commodity_name: string = undefined; // 商品名称
    public subtitle: string = undefined; // 副标题
    public commodity_images: Array<string> = []; // 商品图片列表
    public commodity_video: string = undefined; // 商品视频
    public commodity_description: string = undefined; // 商品描述
    public shelf_time: number = undefined; // 商品上架时间
    public removal_time: number = undefined; // 商品下架时间
    public sales_status: number = undefined; // 1销售中,2已下架
    public is_deleted: boolean = undefined; // 是否被删除 true已删除,false未删除
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间
}

/**
 * 商品规格实体
 */
export class SpecificationEntity extends EntityBase {
    public specification_id: string = undefined; // 规格id
    public commodity: CommodityEntity = undefined; // 商品对象
    public specification_name: string = undefined; // 规格名称
    public unit_original_price: number = undefined; // 单位分 原价
    public unit_sell_price: number = undefined; // 单位分 售价
    public stock: number = undefined; // 库存
    public sold_amount = 0; // 已售数量
    public is_deleted: boolean = undefined; // 是否被删除 true已删除,false未删除
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'commodity') {
            return CommodityEntity;
        }
        return null;
    }
}

@Injectable({
    providedIn: 'root'
})
export class GoodsManagementHttpService {

    private domain = environment.MALL_DOMAIN;

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取商品列表
     * @param {CommoditySearchParams} searchParams
     * @returns {Observable<CommodityLinkResponse>}
     */
    public requestCommodityListData(searchParams: CommoditySearchParams): Observable<CommodityLinkResponse> {
        const url = this.domain + `/admin/commodities`;
        const params = this.httpService.generateURLSearchParams(searchParams);
        return this.httpService.get(url, params).pipe(map(res => new CommodityLinkResponse(res)));
    }

    /**
     * 通过linkUrl获取商品列表
     * @param {string} url
     * @returns {Observable<CommodityLinkResponse>}
     */
    public requestContinueCommodityListData(url: string): Observable<CommodityLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new CommodityLinkResponse(res)));
    }

    /**
     * 创建商品
     * @param {CommodityParams} createParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestCreateCommodityData(createParams: CommodityParams): Observable<HttpResponse<any>> {
        const url = this.domain + `/admin/commodities`;
        const body = createParams.json();
        return this.httpService.post(url, body);
    }

    /**
     * 修改商品
     * @param {string} commodity_id
     * @param {CommodityParams} editParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestEditCommodityData(commodity_id: string, editParams: CommodityParams): Observable<HttpResponse<any>> {
        const url = this.domain + `/admin/commodities/${commodity_id}`;
        const body = editParams.json();
        return this.httpService.put(url, body);
    }

    /**
     * 获取商品详情
     * @param {string} commodity_id
     * @returns {Observable<CommodityEntity>}
     */
    public requestCommodityByIdData(commodity_id: string): Observable<CommodityEntity> {
        const url = this.domain + `/admin/commodities/${commodity_id}`;
        return this.httpService.get(url).pipe(map(res => CommodityEntity.Create(res.body)));
    }

    /**
     * 删除商品
     * @param {string} commodity_id
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestDeleteCommodityData(commodity_id: string): Observable<HttpResponse<any>> {
        const url = this.domain + `/admin/commodities/${commodity_id}`;
        return this.httpService.delete(url);
    }

    /**
     * 商品上架下架接口
     * @param {string} commodity_id
     * @param {CommodityOperationParams} operationParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestCommodityOperationData(commodity_id: string, operationParams: CommodityOperationParams): Observable<HttpResponse<any>> {
        const url = this.domain + `/admin/commodities/${commodity_id}/operation`;
        const body = operationParams.json();
        return this.httpService.patch(url, body);
    }

    /**
     * 创建/修改规格
     * @param {string} commodity_id
     * @param {SpecificationParams} modifyParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestModifyCommoditySpecificationData(commodity_id: string, modifyParams: SpecificationParams): Observable<HttpResponse<any>> {
        const url = this.domain + `/admin/commodities/${commodity_id}/specification`;
        const body = modifyParams.json();
        return this.httpService.post(url, body);
    }
}

/**** 数据处理 ****/
/**
 * 获取商品列表数据处理
 */
export class CommodityLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<CommodityEntity> {
        const tempList: Array<CommodityEntity> = [];
        results.forEach(res => {
            tempList.push(CommodityEntity.Create(res));
        });
        return tempList;
    }
}
