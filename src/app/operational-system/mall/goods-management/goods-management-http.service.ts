import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { EntityBase } from '../../../../utils/z-entity';
import { FileUpdate } from '../../../../utils/file-update';
import { BusinessEntity } from '../business-management/business-management.service';

/**** 实体类 ****/
/**
 * 商品列表请求参数
 */
export class CommoditySearchParams extends EntityBase {
    public sales_status: number = undefined; // 销售状态 1销售中,2已下架
    public commodity_name: string = undefined; // 商品名称
    public shelf_time: string = undefined; // 商品上架时间 逗号分割 例：1232154,1234546
    public created_time: string = undefined; // 创建时间 逗号分割 例：1232154,1234546
    public commodity_type: any = ''; // 	商品类型 1：实物商品 2：虚拟商品
    public shipping_method = ''; //  供货方式 1平台自营，2第三方供应
    public page_size = 45; // 每页数量 默认15
    public page_num = 1; // 第几页 默认1
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
    public specification_objs: Array<any> = []; // 规格对象列表 创建/更新
    public delete_specification_ids: string = undefined; // 规格ids 'wq32','2qwe' 删除

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'specification_objs') {
            return SpecificationEntity;
        }
        return null;
    }

    public toEditJson(): any {
        const json = this;
        json.specification_objs.forEach(specificationObj => {
            specificationObj.unit_original_price = Math.round(specificationObj.unit_original_price * 100);
            specificationObj.unit_sell_price = specificationObj.unit_sell_price ? Math.round(specificationObj.unit_sell_price * 100) : specificationObj.unit_sell_price;
            specificationObj.settlement_price = Math.round(specificationObj.settlement_price * 100);
            if (specificationObj.stock_json) {
                specificationObj.stock_json.unit_sell_price_day = Math.round(specificationObj.stock_json.unit_sell_price_day * 100);
                specificationObj.stock_json = JSON.stringify(specificationObj.stock_json);
            }
        });
        return JSON.stringify(json);
    }
}

/**
 * 商品信息实体
 */
export class CommodityEntity extends EntityBase {
    public commodity_id: string = undefined; // 商品id
    public commodity_name: string = undefined; // 商品名称
    public commodity_type: number = undefined; // 商品类型 1：实物商品 2：虚拟商品 3:优惠券商品
    public buy_max_num: number = undefined; // 购买上限 -1:无上限
    public people_buy_max_num: number = undefined; // 每人每日购买上限 -1:无上限
    public day_buy_max_num: number = undefined; // 商品每日购买上限 -1:无上限
    public subtitle: string = undefined; // 副标题
    public commodity_images: Array<string> = []; // 商品图片列表
    public commodity_videos: Array<string> = []; // 商品视频
    public commodity_description: string = undefined; // 商品描述
    public shelf_time: number = undefined; // 商品上架时间
    public removal_time: number = undefined; // 商品下架时间
    public sales_status: number = undefined; // 1销售中,2已下架
    public is_deleted: boolean = undefined; // 是否被删除 true已删除,false未删除
    public specifications: Array<SpecificationEntity> = []; // 规格对象列表
    public giveaway_settings: number = undefined; // 0未设置 1兑换码兑换
    public remark: string = undefined; // 核销描述
    public business_telephone: string = undefined; // 商户联系电话
    public order_description: string = undefined; // 订单说明
    public button_config: ButtonConfigEntity = new ButtonConfigEntity(); // 按钮描述
    public show_comment = 1; // 显示评论 1显示 2不显示
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间
    // 用于页面展示
    public unit_sell_price_section: string = undefined; // 售价区间
    public unit_original_price_section: string = undefined; // 原价区间
    public sold_amount_sum = 0; // 销量，已售数量之和
    public category: number = undefined; // 	1餐饮卷 2车周边
    public shipping_method: any = ''; // 	供货方式 1平台自营，2第三方供应
    public collection_type = '1'; // 收款方式 1平台 2此供应商户
    public validity_type: number = undefined; // 	有效期类型 1.付款后立即生效 2.使用日期当日有效 *使用日期信息
    public freight_fee: number = undefined; // 	运费 单位分
    public mall_business_id = ''; // 商家id
    public mall_business_name = ''; // 商家名称
    public sort_id = ''; // 分类id
    public sort_name = ''; // 分类名称
    public cover_image = ''; // 封面图片
    public click_num: number = undefined; // 累计点击量
    public click_person: number = undefined; // 累计点击人数
    public isChecked = false; // ui

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'specifications') {
            return SpecificationEntity;
        }
        if (propertyName === 'button_config') {
            return ButtonConfigEntity;
        }
        return null;
    }

    public toEditJson(): any {
        const json = this.json();
        delete json.commodity_id;
        delete json.shelf_time;
        delete json.removal_time;
        delete json.sales_status;
        delete json.is_deleted;
        delete json.specifications;
        delete json.created_time;
        delete json.updated_time;
        delete json.unit_sell_price_section;
        delete json.unit_original_price_section;
        delete json.sold_amount_sum;
        delete json.category;
        json.freight_fee = Math.round(json.freight_fee * 100);
        return json;
    }
}

/**
 * 价格日历实体
 */
export class SpecificationDateEntity extends EntityBase {
    public start_time: number = undefined; // 日历开始时间
    public end_time: number = undefined; // 日历结束时间
    public week_range: Array<number> = undefined; // 例子：[1,2]星期一，星期二
    public stock_day: number = undefined; // 	每日库存
    public unit_sell_price_day: number = undefined; // 	每日售价
}

export class ButtonConfigEntity extends EntityBase {
    public button_remark: string = undefined; // 描述
    public button_type: any = ''; // 1 小程序 2 h5
    public button_url: string = undefined; // button_url
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
    public settlement_price: number = undefined; // 单位分 结算价格
    public stock: number = undefined; // 库存
    public sold_amount = 0; // 已售数量
    public stock_json: SpecificationDateEntity = undefined; // 商品有效期为使用日期当日有效时的库存信息
    public template_coupon_ids: string = undefined; // 模板ids
    public coupon_group_ids: string = undefined; //  券组ids
    public is_deleted: boolean = undefined; // 是否被删除 true已删除,false未删除
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'commodity') {
            return CommodityEntity;
        }
        if (propertyName === 'stock_json') {
            return SpecificationDateEntity;
        }
        return null;
    }

    constructor(source?: SpecificationEntity) {
        super();
        if (source) {
            this.specification_id = source.specification_id;
            this.commodity = source.commodity;
            this.specification_name = source.specification_name;
            this.unit_original_price = source.unit_original_price ? (source.unit_original_price / 100) : source.unit_original_price;
            this.unit_sell_price = source.unit_sell_price ? (source.unit_sell_price / 100) : source.unit_sell_price;
            this.settlement_price = source.settlement_price ? (source.settlement_price / 100) : source.settlement_price;
            this.stock = source.stock;
            this.sold_amount = source.sold_amount;
            this.stock_json = source.stock_json;
            this.specification_id = source.specification_id;
            this.specification_id = source.specification_id;
            this.specification_id = source.specification_id;
        }
    }
}

/**
 * 商品兑换记录
 */
export class ExchangeRecordEntity extends EntityBase {
    public exchange_record_id: string = undefined; // 兑换记录id
    public order_id: string = undefined; // 订单id
    public htcode: string = undefined; // 用户id
    public exchange_code: string = undefined; // 兑换码
    public commodity_id: string = undefined; // 商品id
    public commodity_type: number = undefined; // 商品类型 1：实物商品 2：虚拟商品
    public specification_id: number = undefined; // 规格id
    public exchange_status: string = undefined; // 兑换状态 1未兑换 2已兑换
    public start_time: number = undefined; // float	开始时间
    public end_time: number = undefined; // float	结束时间
    public exchange_time: number = undefined; // float	兑换时间
    public callback_url: string = undefined; // 回调url
    public callback_status: boolean = undefined; // bool	回调状态 true 回调成功 false回调失败
    public callback_info: string = undefined; // 回调信息
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间
}

export class ExchangeRecordLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ExchangeRecordEntity> {
        const tempList: Array<ExchangeRecordEntity> = [];
        results.forEach(res => {
            tempList.push(ExchangeRecordEntity.Create(res));
        });
        return tempList;
    }
}

export class SearchStatisticParams extends EntityBase {
    public start_time: any = undefined; // 开始时间
    public end_time: any = undefined; // 结束时间
    public page_size = 45;
    public page_num = 1;
}

export class StatisticEntity extends EntityBase {
    public click_num: number = undefined; // 开始时间
    public click_person: number = undefined; // 结束时间
    public date: number = undefined;
}

export class StatisticLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<StatisticEntity> {
        const tempList: Array<StatisticEntity> = [];
        results.forEach(res => {
            tempList.push(StatisticEntity.Create(res));
        });
        return tempList;
    }
}


@Injectable({
    providedIn: 'root'
})
export class GoodsManagementHttpService {

    private domain = environment.MALL_DOMAIN;

    private image_domain: string = environment.STORAGE_DOMAIN;

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
     * @param {CommodityEntity} createParams
     * @returns {Observable<CommodityEntity>}
     */
    public requestCreateCommodityData(createParams: CommodityEntity): Observable<CommodityEntity> {
        const url = this.domain + `/admin/commodities`;
        const body = createParams.toEditJson();
        return this.httpService.post(url, body).pipe(map(res => CommodityEntity.Create(res.body)));
    }

    /**
     * 修改商品
     * @param {string} commodity_id
     * @param {CommodityEntity} editParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestEditCommodityData(commodity_id: string, editParams: CommodityEntity): Observable<HttpResponse<any>> {
        const url = this.domain + `/admin/commodities/${commodity_id}`;
        const body = editParams.toEditJson();
        return this.httpService.put(url, body);
    }

    /**
     * 获取商品详情
     * @param {string} commodity_id
     * @returns {Observable<CommodityEntity>}
     */
    public requestCommodityByIdData(commodity_id: string): Observable<CommodityEntity> {
        const url = this.domain + `/admin/commodities/${commodity_id}`;
        return this.httpService.get(url).pipe(map(res => {
            const tempCommodity = CommodityEntity.Create(res.body);
            tempCommodity.specifications = res.body.specifications;
            return tempCommodity;
        }));
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
     * 商品上架/下架
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
        const params = modifyParams.clone();
        const body = params.toEditJson();
        return this.httpService.post(url, body);
    }

    /**
     * 获取商家列表
     * @param CommoditySearchParams searchParams
     * @returns Observable<CommodityLinkResponse>
     */
    public requestBusinessListData(): Observable<Array<BusinessEntity>> {
        const url = this.domain + `/admin/business`;
        return this.httpService.get(url).pipe(map(res => {
            return res.body;
        }));
    }

    /**
     * 获取兑换记录列表
     * @param commodity_id string
     * @returns {Observable<ExchangeRecordLinkResponse>}
     */
    public requestExchangeRecordListData(commodity_id: string): Observable<ExchangeRecordLinkResponse> {
        const url = this.domain + `/admin/commodities/${commodity_id}/exchange_records`;
        return this.httpService.get(url).pipe(map(res => new ExchangeRecordLinkResponse(res)));
    }

    /**
     * 上传图片
     * @param file
     * @returns {Observable<any>}
     */
    public requestUploadPicture(file: any): Observable<any> {
        const url = this.image_domain + `/storages/images`;
        return Observable.create(observer => {
            FileUpdate(file, url, (sourceUrl) => {
                observer.next({sourceUrl});
                observer.complete();
            }, (err) => {
                observer.error(err);
            });
        });
    }

    // 获取统计信息
    public requestStatisticData(commodity_id: string, searchParams: SearchStatisticParams): Observable<StatisticLinkResponse> {
        const httpUrl = `${this.domain}/users/commodities/${commodity_id}/click`;
        return this.httpService.get(httpUrl, searchParams.json()).pipe(map(res => new StatisticLinkResponse(res)));
    }

    // 分页获取
    public requestContinueStatisticData(url: string): Observable<StatisticLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new StatisticLinkResponse(res)));
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
            // 格式化数组最小值
            const formatListMInNum = (sourceList: Array<number>): number => {
                if (sourceList.length === 0) {
                    return 0;
                }
                return Math.min.apply(null, sourceList) / 100;
            };
            // 格式化数组最大值
            const formatListMaxNum = (sourceList: Array<number>): number => {
                if (sourceList.length === 0) {
                    return 0;
                }
                return Math.max.apply(null, sourceList) / 100;
            };
            const unitSellPriceList = [];
            const unitOriginalPriceList = [];
            res.sold_amount_sum = 0;
            res.specifications.forEach(specificationItem => {
                unitSellPriceList.push(specificationItem.unit_sell_price);
                unitOriginalPriceList.push(specificationItem.unit_original_price);
                res.sold_amount_sum += specificationItem.sold_amount;
            });
            if (formatListMInNum(unitSellPriceList) === formatListMaxNum(unitSellPriceList)) {
                res.unit_sell_price_section = formatListMInNum(unitSellPriceList);
            } else {
                res.unit_sell_price_section = formatListMInNum(unitSellPriceList) + '-' + formatListMaxNum(unitSellPriceList);
            }
            if (formatListMInNum(unitOriginalPriceList) === formatListMaxNum(unitOriginalPriceList)) {
                res.unit_original_price_section = formatListMInNum(unitOriginalPriceList);
            } else {
                res.unit_original_price_section = formatListMInNum(unitOriginalPriceList) + '-' + formatListMaxNum(unitOriginalPriceList);
            }
            res.unit_sell_price_section += '元';
            res.unit_original_price_section += '元';
            tempList.push(CommodityEntity.Create(res));
        });
        return tempList;
    }
}
