import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../../../../environments/environment';
import { EntityBase } from '../../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../../core/http.service';

/**** 实体类 ****/
/**
 * 获取优惠券使用跳转url配置记录查询参数
 */
export class SearchCouponUrlRecordParams extends EntityBase {
    public coupon_template_id = ''; // 优惠券模板id
    public coupon_name = ''; // 优惠券名称
    public page_num = 1; // 页码(默认 1)
    public page_size = 45; // 每页的数据条数 默认 10
}

/**
 * 优惠券使用跳转url配置记录实体类
 */
export class CouponUrlRecordEntity extends EntityBase {
    public coupon_url_record_id: string = undefined; // 优惠券url配置记录
    public coupon_template_id: string = undefined; // 优惠券模板id
    public coupon_name: string = undefined; // 优惠券名称
    public url_type = 1; // url类型,1:H5,2:小程序原生页
    public coupon_url: string = undefined; // 跳转url
    public can_be_shared: boolean = undefined; // 页面是否可以被分享
    public updated_time: number = undefined; // 更新时间
    public created_time: number = undefined; // 创建时间

    constructor(source?: CouponUrlRecordEntity) {
        super();
        if (source) {
            this.coupon_template_id = source.coupon_template_id;
            this.coupon_name = source.coupon_name;
            this.url_type = source.url_type;
            this.coupon_url = source.coupon_url;
            this.can_be_shared = source.can_be_shared;
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class CouponJumpHttpService {

    private domain = environment.OPERATION_SERVE;

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取优惠券使用跳转url记录列表
     * @param {SearchCouponUrlRecordParams} searchParams
     * @returns {Observable<CouponUrlRecordLinkResponse>}
     */
    public requestCouponUrlRecordListData(searchParams: SearchCouponUrlRecordParams): Observable<CouponUrlRecordLinkResponse> {
        const url = this.domain + `/coupon_url_records`;
        const params = this.httpService.generateURLSearchParams(searchParams);
        return this.httpService.get(url, params).pipe(map(res => new CouponUrlRecordLinkResponse(res)));
    }

    /**
     * 通过linkUrl获取优惠券使用跳转url记录列表
     * @param {string} url
     * @returns {Observable<CouponUrlRecordLinkResponse>}
     */
    public requestContinueCouponUrlRecordListData(url: string): Observable<CouponUrlRecordLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new CouponUrlRecordLinkResponse(res)));
    }

    /**
     * 添加优惠券使用跳转url记录
     * @param {CouponUrlRecordEntity} createParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestAddCouponUrlRecordData(createParams: CouponUrlRecordEntity): Observable<HttpResponse<any>> {
        const url = this.domain + `/coupon_url_records`;
        const body = createParams.json();
        return this.httpService.post(url, body);
    }

    /**
     * 编辑优惠券使用跳转url记录
     * @param {string} coupon_url_record_id
     * @param {CouponUrlRecordEntity} editParams
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestEditCouponUrlRecordData(coupon_url_record_id: string, editParams: CouponUrlRecordEntity): Observable<HttpResponse<any>> {
        const url = this.domain + `/coupon_url_records/${coupon_url_record_id}`;
        const body = editParams.json();
        return this.httpService.post(url, body);
    }

    /**
     * 删除优惠券使用跳转url记录
     * @param {string} coupon_url_record_id
     * @returns {Observable<HttpResponse<any>>}
     */
    public requestDeleteCouponUrlRecordData(coupon_url_record_id: string): Observable<HttpResponse<any>> {
        const url = this.domain + `/coupon_url_records/${coupon_url_record_id}`;
        return this.httpService.delete(url);
    }
}

/**** 数据处理 ****/
/**
 * 获取优惠券使用跳转url记录列表数据处理
 */
export class CouponUrlRecordLinkResponse extends LinkResponse {

    public generateEntityData(results: Array<any>): Array<CouponUrlRecordEntity> {
        const tempList: Array<CouponUrlRecordEntity> = [];
        results.forEach(res => {
            tempList.push(CouponUrlRecordEntity.Create(res));
        });
        return tempList;
    }
}
