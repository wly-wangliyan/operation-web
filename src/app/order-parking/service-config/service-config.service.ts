import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';

export class ParkingSearchParams extends EntityBase {
    public page_num = 1; // 页码
    public page_size = 45; // 每页条数
}

// 停车场实体
export class ParkingEntity extends EntityBase {
    public parking_id: string = undefined; // 停车场ID
    public park_id: string = undefined; // 停车场ID
    public area_type: number = undefined; // 用地类型 1: 路内 2: 路外
    public spot_types: Array<string> = []; // 支持车位类型 1:室内,2:室外 ['1', '2']
    public parking_name: string = undefined; // 停车场名称
    public images: Array<string> = []; // 图片
    public operate_type: number = undefined; // 管理模式 / 运营模式 1: 非封闭 2: 封闭 - 1: 未知
    public province: string = undefined; // 省
    public city: string = undefined; // 市
    public district: string = undefined; // 区
    public address: string = undefined; // 停车场地址
    public start_time: number = undefined; // 营业开始时间 默认: 空
    public end_time: number = undefined; // 营业结束时间 默认: 空
    public lon: string = undefined; // 经度
    public lat: string = undefined; // 纬度
    public location: number = undefined; // 位置坐标
    public tags: Array<any> = undefined; // 标签
    public origin_fee: number = undefined; // 室外原价 单位:分
    public sale_fee: number = undefined; // 室外售价 单位:分
    public pre_fee: number = undefined; // 室外预付 单位:分
    public minus_fee: number = undefined; // 室外下单立减 单位:分
    public spot_num_left: number = undefined; // 室外剩余车位数
    public indoor_origin_fee: number = undefined; // 室内原价 单位:分
    public indoor_sale_fee: number = undefined; // 室内售价 单位:分
    public indoor_pre_fee: number = undefined; // 室内预付 单位:分
    public indoor_minus_fee: number = undefined; // 室内下单立减 单位:分
    public indoor_spot_num_left: number = undefined; // 室内剩余车位数
    public min_days: number = undefined; // 最低预定
    public main_tel: string = undefined; // 手机号(主)
    public standby_tel: string = undefined; // 机号(备)
    public instruction: string = undefined; // 预约说明
    public notice: string = undefined; // 购买须知
    public sign_name: string = undefined; // 标志位名称
    public is_recommended: number = undefined; // 1:被推荐 2:取消推荐
    public is_deleted: boolean = undefined; // 逻辑删除 默认: False
    public updated_time: number = undefined; // 更新时间
    public created_time: number = undefined; // 下单时间

    constructor(source?: ParkingEntity) {
        super();
        if (source) {
            this.parking_id = source.parking_id;
            this.park_id = source.park_id;
            this.area_type = source.area_type;
            this.spot_types = source.spot_types ? source.spot_types : [];
            this.parking_name = source.parking_name;
            this.images = source.images ? source.images : [];
            this.operate_type = source.operate_type;
            this.province = source.province;
            this.city = source.city;
            this.district = source.district;
            this.address = source.address;
            this.start_time = source.start_time;
            this.end_time = source.end_time;
            this.lon = source.lon;
            this.lat = source.lat;
            this.location = source.location;
            this.tags = source.tags ? source.tags : [];
            this.origin_fee = source.origin_fee ? (source.origin_fee / 100) : source.origin_fee;
            this.sale_fee = source.sale_fee ? (source.sale_fee / 100) : source.sale_fee;
            this.pre_fee = source.pre_fee ? (source.pre_fee / 100) : source.pre_fee;
            this.minus_fee = source.minus_fee ? (source.minus_fee / 100) : source.minus_fee;
            this.spot_num_left = source.spot_num_left;
            this.indoor_origin_fee = source.indoor_origin_fee ? (source.indoor_origin_fee / 100) : source.indoor_origin_fee;
            this.indoor_sale_fee = source.indoor_sale_fee ? (source.indoor_sale_fee / 100) : source.indoor_sale_fee;
            this.indoor_pre_fee = source.indoor_pre_fee ? (source.indoor_pre_fee / 100) : source.indoor_pre_fee;
            this.indoor_minus_fee = source.indoor_minus_fee ? (source.indoor_minus_fee / 100) : source.indoor_minus_fee;
            this.indoor_spot_num_left = source.indoor_spot_num_left;
            this.min_days = source.min_days;
            this.main_tel = source.main_tel;
            this.standby_tel = source.standby_tel;
            this.instruction = source.instruction;
            this.notice = source.notice;
            this.sign_name = source.sign_name;
            this.is_recommended = source.is_recommended;
            this.is_deleted = source.is_deleted;
            this.updated_time = source.updated_time;
            this.created_time = source.created_time;
        }
    }

    public toEditJson(): any {
        const json = this.json();
        delete json.parking_id;
        delete json.park_id;
        delete json.area_type;
        delete json.parking_name;
        delete json.images;
        delete json.operate_type;
        delete json.province;
        delete json.city;
        delete json.district;
        delete json.address;
        delete json.start_time;
        delete json.end_time;
        delete json.lon;
        delete json.lat;
        delete json.location;
        delete json.is_recommended;
        delete json.is_deleted;
        delete json.updated_time;
        delete json.created_time;
        json.spot_types = json.spot_types.join(',');
        if (json.spot_types.includes('1')) {
            json.indoor_origin_fee = json.indoor_origin_fee ? (json.indoor_origin_fee * 100) : json.indoor_origin_fee;
            json.indoor_sale_fee = json.indoor_sale_fee ? (json.indoor_sale_fee * 100) : json.indoor_sale_fee;
            json.indoor_pre_fee = json.indoor_pre_fee ? (json.indoor_pre_fee * 100) : json.indoor_pre_fee;
            json.indoor_minus_fee = json.indoor_minus_fee ? (json.indoor_minus_fee * 100) : json.indoor_minus_fee;
        } else {
            json.indoor_origin_fee = null;
            json.indoor_sale_fee = null;
            json.indoor_pre_fee = null;
            json.indoor_minus_fee = null;
        }
        if (json.spot_types.includes('2')) {
            json.origin_fee = json.origin_fee ? (json.origin_fee * 100) : json.origin_fee;
            json.sale_fee = json.sale_fee ? (json.sale_fee * 100) : json.sale_fee;
            json.pre_fee = json.pre_fee ? (json.pre_fee * 100) : json.pre_fee;
            json.minus_fee = json.minus_fee ? (json.minus_fee * 100) : json.minus_fee;
        } else {
            json.origin_fee = null;
            json.sale_fee = null;
            json.pre_fee = null;
            json.minus_fee = null;
        }
        return json;
    }
}

export class ParkingLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ParkingEntity> {
        const tempList: Array<ParkingEntity> = [];
        results.forEach(res => {
            tempList.push(ParkingEntity.Create(res));
        });
        return tempList;
    }
}

/**
 * 添加停车场参数
 */
export class AddParkingParams extends EntityBase {
    public beian_parking_ids: string = undefined;
}

/**
 * 推荐状态参数
 */
export class RecommendStatusParams extends EntityBase {
    public recommend_status: number = undefined; // int	T	1:被推荐 2:取消推荐
}

@Injectable({
    providedIn: 'root'
})
export class ServiceConfigService {

    private domain = environment.BOOKING_DOMAIN; // 机场停车（预约泊车）域名

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取产品列表
     * @param searchParams 条件检索参数
     */
    public requestParkingListData(searchParams: ParkingSearchParams): Observable<ParkingLinkResponse> {
        const httpUrl = `${this.domain}/admin/parkings`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new ParkingLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续请求订单列表
     * @param string url linkUrl
     * @returns Observable<ParkingLinkResponse>
     */
    public continueParkingListData(url: string): Observable<ParkingLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new ParkingLinkResponse(res)));
    }

    /**
     * 获取停车场列表
     * @param parking_name 停车场名称
     */
    public requestBeanParkingListData(parking_name: string): Observable<ParkingLinkResponse> {
        const httpUrl = `${this.domain}/admin/base_parkings`;
        return this.httpService.get(httpUrl, {parking_name})
            .pipe(map(res => new ParkingLinkResponse(res)));
    }

    /**
     * 修改停车场被推荐状态
     * @param {string} parking_id
     * @param {RecommendStatusParams} recommendStatusParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestChangeRecommendStatusData(parking_id: string, recommendStatusParams: RecommendStatusParams): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/parkings/${parking_id}/recommend_status`;
        const body = recommendStatusParams.json();
        return this.httpService.patch(httpUrl, body);
    }

    /**
     * 添加停车场
     * @param {AddParkingParams} addParkingParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestAddParkingIds(addParkingParams: AddParkingParams): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/parkings`;
        const body = addParkingParams.json();
        return this.httpService.post(httpUrl, body);
    }

    /**
     * 获取产品配置详情
     * @param parking_id 停车场ID
     * @returns Observable<ParkingEntity>
     */
    public requestParkingDetailData(parking_id: string): Observable<ParkingEntity> {
        const httpUrl = `${this.domain}/admin/parkings/${parking_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => ParkingEntity.Create(res.body)));
    }

    /**
     * 修改服务配置
     * @param {ParkingEntity} configParams
     * @param {string} parking_id
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestUpdateServiceConfigData(configParams: ParkingEntity, parking_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/parkings/${parking_id}/service_config`;
        const body = configParams.toEditJson();
        return this.httpService.put(httpUrl, body);
    }

    /**
     * 删除产品配置
     * @param parking_id 停车场id
     * @returns Observable<HttpResponse<any>>
     */
    public requestDeleteProductData(parking_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/parkings/${parking_id}`;
        return this.httpService.delete(httpUrl);
    }

}
