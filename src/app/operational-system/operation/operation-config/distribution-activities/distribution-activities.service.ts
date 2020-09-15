import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../../utils/z-entity';

export class ActivityDailyEntity extends EntityBase {
    public daily_click_id: string = undefined;
    public distribution_activity_id: string = undefined; // 活动id
    public page_view: number = undefined; // 点击量
    public user_view: number = undefined; // 点击人数
    public order_number: number = undefined; // 订单量
    public ymd: number = undefined; // 年月日
    public created_time: number = undefined;
}

export class ActivityBusinessDailyEntity extends EntityBase {
    public code_link: string = undefined;
    public merchant_id: string = undefined;
    public merchant_name: string = undefined;
    public merchant_type: number = undefined;
    public page_view: number = undefined; // 点击量
    public user_view: number = undefined; // 点击人数
    public order_number: number = undefined; // 订单量
    public ymd: number = undefined; // 年月日
    public created_time: number = undefined;
}

export enum OnlineTimeType {
    now = 1,
    timing = 2,
}

export class DistributionActivityEntity extends EntityBase {
    public activity_id: string = undefined;
    public title: string = undefined;
    public jump_type: number = undefined; // 跳转类型 1小程序原生 2H5
    public jump_content: string = undefined;
    public business_type = 1; // 业务类型 1检车 2洗车 3停车
    public start_time: number = undefined;
    public end_time: number = undefined;
    public online_status: number = undefined; // 上线状态 1上线 2下线
    public online_type: number = undefined; // 上线类型 1立即上线 2定时上线
    public fixed_time: number = undefined;
    public total_page_view: number = undefined; // 总浏览量
    public total_user_view: number = undefined; // 总浏览人数
    public total_order_number: number = undefined; // 总订单数
}

export class BeianMerchantEntity extends EntityBase {
    public merchant_id: string = undefined;
    public merchant_name: string = undefined;
    public merchant_type: number = undefined;
    public isChecked = false; // ui

    constructor(source?: ActivityBusinessDailyEntity) {
        super();
        if (source) {
            this.merchant_id = source.merchant_id;
            this.merchant_name = source.merchant_name;
            this.merchant_type = source.merchant_type;
            this.isChecked = true;
        }
    }
}

export class DistributionActivitiesParams extends EntityBase {
    public jump_type: any = ''; // 跳转类型 1小程序原生 2H5
    public jump_content: string = undefined; // 跳转链接内容
    public business_type = 1; // 业务类型 1检车 2洗车 3停车
    public title: string = undefined; // 活动标题
    public start_time: any = undefined;
    public end_time: any = undefined;
    public online_type: number = undefined; // 上线类型 1立即上线 2定时上线
    public fixed_time: any = undefined;

    constructor(source?: DistributionActivityEntity) {
        super();
        if (source) {
            this.jump_type = source.jump_type;
            this.jump_content = source.jump_content;
            this.business_type = source.business_type;
            this.title = source.title;
            this.start_time = source.start_time ? new Date(source.start_time * 1000) : '';
            this.end_time = source.end_time ? new Date(source.end_time * 1000) : '';
            this.online_type = source.online_type;
            this.fixed_time = source.fixed_time ? new Date(source.fixed_time * 1000) : '';
        }
    }
}

export class SearchParamsDistributionActivitiesEntity extends EntityBase {
    public title: string = undefined;
    public activity_id: string = undefined;
    public page_size = 45;
    public page_num = 1;
}

export class SearchParamsBeianMerchantsEntity extends EntityBase {
    public merchant_type: any = ''; // 商家类型 1检车线 2汽车保养 停车
    public merchant_name: string = undefined;
    public page_size = 45;
    public page_num = 1;
}

export class SearchParamsActivityDailyEntity extends EntityBase {
    public section: string = undefined;
    public page_size = 45;
    public page_num = 1;
}

export class SearchParamsActivityBusinessListEntity extends EntityBase {
    public merchant_name: string = undefined;
    public merchant_id: string = undefined;
    public page_size = 45;
    public page_num = 1;
}

export class DistributionActivitiesLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<DistributionActivityEntity> {
        const tempList: Array<DistributionActivityEntity> = [];
        results.forEach(res => {
            tempList.push(DistributionActivityEntity.Create(res));
        });
        return tempList;
    }
}

class ActivityDailyLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ActivityDailyEntity> {
        const tempList: Array<ActivityDailyEntity> = [];
        results.forEach(res => {
            tempList.push(ActivityDailyEntity.Create(res));
        });
        return tempList;
    }
}

class ActivityBusinessLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ActivityBusinessDailyEntity> {
        const tempList: Array<ActivityBusinessDailyEntity> = [];
        results.forEach(res => {
            tempList.push(ActivityBusinessDailyEntity.Create(res));
        });
        return tempList;
    }
}

export class BeianMerchantsLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<BeianMerchantEntity> {
        const tempList: Array<BeianMerchantEntity> = [];
        results.forEach(res => {
            tempList.push(BeianMerchantEntity.Create(res));
        });
        return tempList;
    }
}

@Injectable({
    providedIn: 'root'
})
export class DistributionActivitiesService {

    private domain = environment.OPERATION_SERVE;

    // private domain = 'http://192.168.6.159:8100';

    constructor(private httpService: HttpService) {
    }

    /** 查看分销活动列表 */
    public requestDistributionActivitiesData(searchParams: SearchParamsDistributionActivitiesEntity): Observable<DistributionActivitiesLinkResponse> {
        const httpUrl = `${this.domain}/admin/distribution_activities`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new DistributionActivitiesLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续查看分销活动列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueDistributionActivitiesData(url: string): Observable<DistributionActivitiesLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new DistributionActivitiesLinkResponse(res)));
    }


    /** 查看备案商家列表 */
    public requestBeianMerchantsData(searchParams: SearchParamsBeianMerchantsEntity): Observable<BeianMerchantsLinkResponse> {
        const httpUrl = `${this.domain}/admin/beian/merchants`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new BeianMerchantsLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续查看备案商家列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueBeianMerchantsData(url: string): Observable<BeianMerchantsLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new BeianMerchantsLinkResponse(res)));
    }

    /** 查看分销活动每日明细列表 */
    public requestActivityDailyData(searchParams: SearchParamsActivityDailyEntity, activity_id: string): Observable<ActivityDailyLinkResponse> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${activity_id}/daily_data`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new ActivityDailyLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续查看分销活动每日明细列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueActivityDailyData(url: string): Observable<ActivityDailyLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new ActivityDailyLinkResponse(res)));
    }

    /** 查看分销活动每日下的商家明细列表 */
    public requestActivityDailyBusinessData(activity_id: string, daily_click_id: string, params: SearchParamsActivityBusinessListEntity): Observable<ActivityBusinessLinkResponse> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${activity_id}/daily_data/${daily_click_id}`;
        return this.httpService.get(httpUrl, params.json()).pipe(map(res => new ActivityBusinessLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续查看分销活动每日下的商家明细列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueActivityDailyBusinessData(url: string): Observable<ActivityBusinessLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new ActivityBusinessLinkResponse(res)));
    }

    /** 查看分销活动商家信息列表 */
    public requestActivityBusinessListData(searchParams: SearchParamsActivityBusinessListEntity, activity_id: string): Observable<ActivityBusinessLinkResponse> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${activity_id}/merchants`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new ActivityBusinessLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续查看分销活动商家信息列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueActivityBusinessListData(url: string): Observable<ActivityBusinessLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new ActivityBusinessLinkResponse(res)));
    }

    /** 查看分销活动商家每日明细列表 */
    public requestActivityBusinessDailyData(searchParams: SearchParamsActivityDailyEntity, activity_id: string, merchant_id: string): Observable<ActivityBusinessLinkResponse> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${activity_id}/merchants/${merchant_id}/daily_data`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new ActivityBusinessLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续查看分销活动商家每日明细列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueActivityBusinessDailyData(url: string): Observable<ActivityBusinessLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new ActivityBusinessLinkResponse(res)));
    }

    /**
     * 添加|编辑分销活动
     * @param params
     * @param distribution_activity_id
     */
    public requestAddDistributionActivitiesData(
        params: DistributionActivitiesParams,
        distribution_activity_id: string): Observable<HttpResponse<any>> {
        const httpUrl = distribution_activity_id ?
            `${this.domain}/admin/distribution_activities/${distribution_activity_id}` : `${this.domain}/admin/distribution_activities`;
        return distribution_activity_id ? this.httpService.put(httpUrl, params) :
            this.httpService.post(httpUrl, params);
    }

    /**
     * 添加|编辑分销活动
     * @param businessList
     * @param distribution_activity_id
     */
    public requestAddActivityMerchantsData(
        businessList: Array<BeianMerchantEntity>,
        distribution_activity_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${distribution_activity_id}/merchants`;
        const params = {merchant_info: businessList};
        return this.httpService.post(httpUrl, params);
    }

    /**
     * 删除分销活动商家
     * @param distribution_activity_id
     * @param merchant_id
     */
    public requestDeleteActivityMerchantData(distribution_activity_id: string, merchant_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${distribution_activity_id}/merchants/${merchant_id}`;
        return this.httpService.delete(httpUrl);
    }


    /**
     * 查看分销活动详情
     * @param distribution_activity_id
     */
    public requestDistributionActivityData(distribution_activity_id: string): Observable<DistributionActivityEntity> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${distribution_activity_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => {
            return DistributionActivityEntity.Create(res.body);
        }));
    }

    /**
     * 删除分销活动
     * @param distribution_activity_id
     */
    public requestDeleteDistributionActivitiesData(distribution_activity_id: string): Observable<any> {
        const httpUrl = `${this.domain}/admin/distribution_activities/${distribution_activity_id}`;
        return this.httpService.delete(httpUrl).pipe(map(res => res.body));
    }

    /**
     * 分销活动上下线
     * @param distribution_activity_id
     * @param online_status
     */
    public requestDistributionActivityOnlineStatusData(distribution_activity_id: string, online_status: number): Observable<any> {
        const params = {online_status}; // 1上线 2下线
        const httpUrl = `${this.domain}/admin/distribution_activities/${distribution_activity_id}`;
        return this.httpService.patch(httpUrl, params).pipe(map(res => res.body));
    }
}
