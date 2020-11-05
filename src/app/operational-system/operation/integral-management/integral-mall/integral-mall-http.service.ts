import { Injectable } from '@angular/core';
import { EntityBase, noClone, noJson } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import {
    ButtonConfigEntity,
    CommodityEntity,
    SpecificationEntity,
    SpecificationParams
} from '../../../mall/goods-management/goods-management-http.service';

// 商品列表筛选
export class SearchIntegralCommodityParams extends EntityBase {
    public status: any = ''; // 1可以兑换 2不可兑换
    public commodity_name: string = undefined; // 商品名称
    public section: any = undefined; // 创建时间区间
    public page_num = 1;
    public page_size = 45;
}

// 优惠券信息
export class CouponEntity extends EntityBase {
    public template_coupon_ids: string = undefined; // 优惠券模板ID 'XXX,XXX'
    public coupon_group_ids: string = undefined; // 券组ID 'XXX,XXX'
}

/**
 * 商品信息实体
 */
export class IntegralCommodityEntity extends EntityBase {
    public commodity_id: string = undefined; // 商品id
    public commodity_type: number = undefined; // 商品类型 1：实物商品 2：虚拟商品 3:优惠券商品
    public commodity_name: string = undefined; // 商品名称
    public subtitle: string = undefined; // 副标题
    public integral_amount: number = undefined; // 兑换积分
    public stock: number = undefined; // 库存
    public other_fields: CouponEntity = undefined; // 优惠券模板ID和券组ID
    public cover_image: string = undefined; // 封面图片
    public commodity_images: Array<string> = []; // 商品图片列表
    public buy_max_num: number = undefined; // 购买上限 -1:无上限
    public people_buy_max_num: number = undefined; // 每人每日购买上限 -1:无上限
    public day_buy_max_num: number = undefined; // 商品每日购买上限 -1:无上限
    public business_telephone: string = undefined; // 商户联系电话
    public order_description: string = undefined; // 订单说明
    public button_config: ButtonConfigEntity = new ButtonConfigEntity(); // 按钮描述
    public buy_remark: string = undefined; // 限购描述
    public remark: string = undefined; // 核销描述
    public commodity_description: string = undefined; // 商品描述
    public exchange_amount: number = undefined; // 兑换数量
    public is_top: number = undefined; // 是否置顶, 1置顶 2取消置顶
    public status: number = undefined; // 销售状态, 1销售中 2已下架
    public day_distribution_time: number = undefined; // 商品每日发放时间

    public total_click_num: number = undefined; // 总点击次数
    public total_click_person: number = undefined; // 总点击人数

    public commodity_sold_amount: number = undefined; // 商品销量
    public commodity_show_amount: number = undefined; // 商品展示销量

    public shipping_method: any = ''; // 	供货方式 1平台自营，2第三方供应
    public collection_type = '1'; // 收款方式 1平台 2此供应商户

    public business_type = 1; // 业务类型 1商城
    public business_id: string = undefined; // 商家id

    public freight_fee: number = undefined; // 	运费 单位分

    public specifications: Array<SpecificationEntity> = []; // 规格对象列表

    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'other_fields') {
            return CouponEntity;
        } else if (propertyName === 'specifications') {
            return SpecificationEntity;
        }
        return null;
    }

    /**
     * 兑换积分
     */
    public get exchangeIntegral(): number {
        return this.specifications[0] ? this.specifications[0].integral : 0;
    }

    /**
     * 价钱
     */
    public get sellPrice(): number {
        return this.specifications[0] ? this.specifications[0].unit_sell_price : 0;
    }
}

// 新建/编辑积分兑换商品
export class EditCommodityParams extends EntityBase {
    public remote_commodity_id: string = undefined; // 商城商品id
    public commodity_id: string = undefined; // 商品id
    public commodity_type: number = undefined; // 商品类型 1：实物商品 2：虚拟商品 3:优惠券商品
    public commodity_name: string = undefined; // 商品名称
    public business_type = 1; // 业务类型 1商城
    public business_id: string = undefined; // 商家id
    public subtitle: string = undefined; // 副标题
    // public integral_amount: number = undefined; // 兑换积分
    // public stock: number = undefined; // 库存
    // public other_fields: CouponEntity = undefined; // 优惠券模板ID和券组ID
    public cover_image: string = undefined; // 封面图片
    public commodity_images: Array<string> = []; // 商品图片列表
    public buy_max_num: number = undefined; // 购买上限 -1:无上限
    public people_buy_max_num: number = undefined; // 每人每日购买上限 -1:无上限
    public day_buy_max_num: number = undefined; // 商品每日购买上限 -1:无上限
    public buy_remark: string = undefined; // 限购描述
    public remark: string = undefined; // 核销描述
    public commodity_description: string = undefined; // 商品描述
    public shipping_method: any = '1'; // 	供货方式 1平台自营，2第三方供应
    public collection_type: any = '1'; // 收款方式 1平台 2此供应商户
    public freight_fee: number = undefined; // 	运费
    public business_telephone: string = undefined; // 商户联系电话
    public order_description: string = undefined; // 订单说明
    public button_config: ButtonConfigEntity = new ButtonConfigEntity(); // 按钮描述
    public day_distribution_time: number = undefined; // 商品每日发放时间

    /**
     * @param data 编辑积分商城商品
     */
    constructor(data?: any) {
        super();
        if (data) {
            if (data instanceof IntegralCommodityEntity || data instanceof CommodityEntity) {
                this.commodity_id = data.commodity_id;
                this.commodity_type = data.commodity_type;
                this.commodity_name = data.commodity_name;
                this.subtitle = data.subtitle;
                this.cover_image = data.cover_image;
                this.commodity_images = data.commodity_images || [];
                this.buy_max_num = data.buy_max_num === -1 ? null : data.buy_max_num;
                this.people_buy_max_num = data.people_buy_max_num === -1 ? null : data.people_buy_max_num;
                this.day_buy_max_num = data.day_buy_max_num === -1 ? null : data.day_buy_max_num;
                this.remark = data.remark;
                this.commodity_description = data.commodity_description;
                this.shipping_method = data.shipping_method || '1';
                this.collection_type = data.collection_type || '1';
                this.button_config.button_type = data.button_config.button_type;
                this.button_config.button_remark = data.button_config.button_remark;
                this.button_config.button_url = data.button_config.button_url;
                this.business_telephone = data.business_telephone;
                this.order_description = data.order_description;
                this.freight_fee = data.freight_fee ? (data.freight_fee / 100) : data.freight_fee;
                // this.other_fields = new CouponEntity();
            }
            if (data instanceof IntegralCommodityEntity) {
                // this.integral_amount = data.integral_amount;
                // this.stock = data.stock;
                // this.other_fields = data.other_fields || new CouponEntity();
                this.buy_remark = data.buy_remark;
                this.business_id = data.business_id;
            } else {
                this.business_id = data.mall_business_id;
                this.remote_commodity_id = data.commodity_id;
            }
        }
    }

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'other_fields') {
            return CouponEntity;
        }
        return null;
    }
}

export class IntegralCommodityLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<IntegralCommodityEntity> {
        const tempList: Array<IntegralCommodityEntity> = [];
        results.forEach(res => {
            tempList.push(IntegralCommodityEntity.Create(res));
        });
        return tempList;
    }
}

// 日点击量筛选
export class SearchDailyClickParams extends EntityBase {
    public section: string = undefined; // 创建时间区间
    public page_size = 45;
    public page_num = 1;
}

// 日点击量统计
export class DailyClickEntity extends EntityBase {
    public daily_click_id: string = undefined; // 主键
    public commodity: IntegralCommodityEntity = undefined;
    public click_num: number = undefined; // 点击量
    public click_people: number = undefined; // 点击人数
    public ymd: number = undefined; // 日期 "2020-06-30"

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'commodity') {
            return IntegralCommodityEntity;
        }
        return null;
    }
}

export class DailyClickLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<DailyClickEntity> {
        const tempList: Array<DailyClickEntity> = [];
        results.forEach(res => {
            tempList.push(DailyClickEntity.Create(res));
        });
        return tempList;
    }
}

@Injectable({
    providedIn: 'root'
})
export class IntegralMallHttpService {

    private domain = environment.INTEGRAL_DOMAIN;

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取商品列表
     * @param searchParams
     */
    public requestIntegralCommodityListData(searchParams: SearchIntegralCommodityParams)
        : Observable<IntegralCommodityLinkResponse> {
        const httpUrl = `${this.domain}/commodities`;
        return this.httpService.get(httpUrl, searchParams.json()).pipe(map(res => new IntegralCommodityLinkResponse(res)));
    }

    // 分页获取
    public continueIntegralCommodityData(url: string): Observable<IntegralCommodityLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new IntegralCommodityLinkResponse(res)));
    }

    /**
     * 获取商品详情
     * @param commodity_id
     */
    public requestCommodityDetailData(commodity_id: string): Observable<IntegralCommodityEntity> {
        const httpUrl = `${this.domain}/commodities/${commodity_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => IntegralCommodityEntity.Create(res.body)));
    }

    /**
     * 添加商品
     * @param addParams {EditCommodityParams}
     */
    public requestAddCommodityData(addParams: EditCommodityParams): Observable<any> {
        const httpUrl = `${this.domain}/commodities`;
        return this.httpService.post(httpUrl, addParams).pipe(map(res => res.body));
    }

    /**
     * 编辑商品
     * @param commodity_id 商品id
     * @param editParams {EditCommodityParams}
     */
    public requestEditCommodityData(commodity_id: string, editParams: EditCommodityParams): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/commodities/${commodity_id}`;
        return this.httpService.put(httpUrl, editParams);
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
     * 置顶商品
     * @param commodity_id 商品id
     * @param is_top 是否置顶, 1置顶 2取消置顶
     */
    public requestTopCommodity(commodity_id: string, is_top: 1 | 2 = 1): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/commodities/${commodity_id}/is_top`;
        return this.httpService.patch(httpUrl, {is_top});
    }

    /**
     * 修改商品状态
     * @param commodity_id 商品id
     * @param status 销售状态 1上架 2下架
     */
    public requestChangeCommodityStatus(commodity_id: string, status: 1 | 2): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/commodities/${commodity_id}/status`;
        return this.httpService.patch(httpUrl, {status});
    }

    /**
     * 删除商品
     * @param commodity_id 商品id
     */
    public requestDeleteCommodityData(commodity_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/commodities/${commodity_id}`;
        return this.httpService.delete(httpUrl);
    }

    // 获取统计信息
    public requestDailyClickStatisticData(commodity_id: string, searchParams: SearchDailyClickParams): Observable<DailyClickLinkResponse> {
        const httpUrl = `${this.domain}/commodities/${commodity_id}/page_views`;
        return this.httpService.get(httpUrl, searchParams.json()).pipe(map(res => new DailyClickLinkResponse(res)));
    }

    // 分页获取
    public continueDailyClickStatisticData(url: string): Observable<DailyClickLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new DailyClickLinkResponse(res)));
    }
}
