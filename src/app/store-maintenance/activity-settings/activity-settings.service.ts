import { Injectable } from '@angular/core';
import { EntityBase } from '../../../utils/z-entity';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../environments/environment';
import { HttpService, LinkResponse } from '../../core/http.service';
import { HttpResponse } from '@angular/common/http';

export class SearchParams extends EntityBase {
    public activity_name = ''; // string	F	活动名称
    public page_num = 1; // 页码
    public page_size = 45; // 每页条数
}

// 洗车服务
export class ActivityEntity extends EntityBase {
    public activity_id: string = undefined; // 	string 活动配置ID
    public activity_name: string = undefined; // 	string	活动名称
    public display_port: string = ''; // string 显示端口(1小程序 2APP)
    public display_type: number = undefined; // 	Integer	显示方式(1浮窗 2弹框 3固定位置)
    public image: string = undefined; // 	string	浮窗图片
    public landing_page_type = '1'; // 	Integer	落地页类型(1H5 2原生页 3视频 4指定优惠券 5指定优惠券组)
    public appId = undefined; // 	string	appId
    public landing_page: string = undefined; // 	string	落地页
    public status: number = undefined; // Integer	上线状态 1上线 2下线(默认2)
    public online_time: number = undefined; // 	float	上线时间
    public offline_time: number = undefined; // 	float	下线时间
    public click_num: number = undefined; // 	Integer	点击量
    public exposure_num: number = undefined; // 	Integer	曝光量
    public updated_time: number = undefined; // 	float	更新时间
    public created_time: number = undefined; // 	float	创建时间

    public toEditJson(): any {
        const json = this.json();
        delete json.activity_id;
        delete json.status;
        delete json.click_num;
        delete json.exposure_num;
        delete json.updated_time;
        delete json.created_time;
        return json;
    }
}

export class ActivityLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ActivityEntity> {
        const tempList: Array<ActivityEntity> = [];
        results.forEach(res => {
            tempList.push(ActivityEntity.Create(res));
        });
        return tempList;
    }
}


@Injectable({
    providedIn: 'root'
})
export class ActivitySettingsService {

    private domain = environment.STORE_DOMAIN; // 域名

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取洗车服务列表
     * @param searchParams 条件检索参数
     * @returns Observable<ActivityLinkResponse>
     */
    public requestActivityListData(searchParams: SearchParams): Observable<ActivityLinkResponse> {
        const httpUrl = `${this.domain}/admin/activities`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new ActivityLinkResponse(res)));
        // const qwe = [];
        // for (let i = 0; i < 20; i++) {
        //     const abc = new ActivityEntity();
        //     abc.activity_name = '12222222';
        //     abc.display_type = 2;
        //     abc.created_time = 1525863276;
        //     abc.landing_page_type = 'wly';
        //     abc.landing_page = '10';
        //     abc.status = 1;
        //     qwe.push(abc);
        // }
        // return of(qwe);
    }

    /**
     * 通过linkUrl继续请求服务费列表
     * @returns Observable<ActivityLinkResponse>
     * @param url
     */
    public continueActivityListData(url: string): Observable<ActivityLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new ActivityLinkResponse(res)));
    }

    /**
     * 修改洗车活动配置状态状态
     * @param activity_id string    T    活动ID
     * @param status number    T    状态 1:开启 2:关闭
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateStatusData(activity_id: string, status: number): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/activities/${activity_id}/status`;
        return this.httpService.patch(httpUrl, {status});
    }

    /**
     * 删除活动配置
     * @param activity_id 配件品牌id
     * @returns Observable<HttpResponse<any>>
     */
    public requestDeleteActivityData(activity_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/activities/${activity_id}`;
        return this.httpService.delete(httpUrl);
    }

    /**
     * 创建活动配置
     * @param params ActivityEntity 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestAddActivityData(params: ActivityEntity): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/activities`;
        return this.httpService.post(httpUrl, params.toEditJson());
    }

    /**
     * 修改活动配置
     * @param activity_id 配件品牌id
     * @param params ActivityEntity 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateActivityData(activity_id: string, params: ActivityEntity): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/activities/${activity_id}`;
        return this.httpService.put(httpUrl, params.toEditJson());
    }

}
