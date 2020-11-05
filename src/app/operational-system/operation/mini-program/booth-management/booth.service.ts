import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// 展位列表筛选
export class SearchBoothParams extends EntityBase {
    public booth_name: string = undefined; // 展位名称
    public booth_type = ''; // 展位类型
    public status: number = undefined; // 启停状态 1：开启 2：关闭 默认关闭
    public page_num = 1; // 页码
    public page_size = 45; // 每页条数
}

// 展位内容列表筛选
export class SearchBoothContentParams extends EntityBase {
    public title: string = undefined; // 标题
    public section: string = undefined; // 上线时间区间 "xxx,xxx"
    public page_num = 1; // 页码
    public page_size = 45; // 每页条数
}

// 点击统计
export class ClickStatisticsEntity extends EntityBase {
    public click_num_statistic_id: string = undefined; // 点击量统计id
    public click_date: number = undefined; // 点击日期
    public click_num: number = undefined; // 点击数
    public click_person_num: number = undefined; // 点击人数
}

// 展位
export class BoothEntity extends EntityBase {
    public booth_id: string = undefined; // id
    public booth_name: string = undefined; // 展位名称
    public booth_key: string = undefined; // 关键字
    public booth_type: any = ''; // 展位类型 1:轮播图 2：焦点图 3：组合
    public booth_title: string = undefined;
    public booth_num: number = undefined; // 展位个数
    public width: number = undefined; // 宽
    public height: number = undefined; // 高
    public status: number = undefined; // 启停状态 1：开启 2：关闭 默认关闭
    public formats: Array<any> = undefined; // 支持格式 1:PNG 2:JPG 3:GIF
    public link_types: Array<any> = undefined; // 链接类型 1: 视频链接 2: H5链接 3: 小程序原生页  4: 第三方小程序
    public remark: string = undefined; // 备注
    public updated_time: number = undefined; // 更新时间
    public created_time: number = undefined; // 创建时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'click_stats') {
            return ClickStatisticsEntity;
        }
        return null;
    }

    public toEditJson(): any {
        const json = this.json();
        json.remark = json.remark || '';
        delete json.booth_id;
        delete json.updated_time;
        delete json.created_time;

        return json;
    }
}

export class BoothLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<BoothEntity> {
        const tempList: Array<BoothEntity> = [];
        results.forEach(res => {
            tempList.push(BoothEntity.Create(res));
        });
        return tempList;
    }
}

// 展位内容
export class BoothContentEntity extends EntityBase {
    public booth_content_id: string = undefined; // id
    public booth: BoothEntity = undefined; // 展位对象
    public title: string = undefined; // 标题
    public image_type: number = undefined; // 图片类型 1：大 2：小
    public image: string = undefined; // 图片
    public app_id: string = undefined;
    public link_type: any = ''; // int 链接类型 1:视频链接 2:H5链接 3:小程序原生页 4: 第三方小程序
    public link_url: string = undefined; // 链接url
    public offline_type: number = undefined; // 下线时间类型 1：永不下线 2：定时下线 默认为1
    public offline_date: number = undefined; // float 下线时间 若offline_type=2,必填
    public remark: string = undefined; // 备注
    public order_num: number = undefined; // 展位序号
    public click_num: number = undefined; // 点击量
    public click_person_num: number = undefined; // 点击人数
    public day_average_click_num: number = undefined; // 日均点击量
    public status: number = undefined; // 启停状态
    public online_date: number = undefined; // 上线时间
    public click_num_statistics: Array<ClickStatisticsEntity> = undefined; // 点击量统计
    public updated_time: number = undefined; // 更新时间
    public created_time: number = undefined; // 创建时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'booth') {
            return BoothEntity;
        }

        if (propertyName === 'click_num_statistics') {
            return ClickStatisticsEntity;
        }
        return null;
    }

    public toEditJson(): any {
        const json = this.json();
        if (!json.link_type) {
            delete json.link_type;
        }
        json.remark = json.remark || '';
        delete json.booth_content_id;
        delete json.booth;
        delete json.order_num;
        delete json.click_num;
        delete json.click_person_num;
        delete json.day_average_click_num;
        delete json.status;
        delete json.online_date;
        delete json.click_num_statistics;
        delete json.updated_time;
        delete json.created_time;
        return json;
    }
}

export class BoothContentLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<BoothContentEntity> {
        const tempList: Array<BoothContentEntity> = [];
        results.forEach(res => {
            tempList.push(BoothContentEntity.Create(res));
        });
        return tempList;
    }
}

@Injectable({
    providedIn: 'root'
})
export class BoothService {
    private domain = environment.OPERATION_SERVE;

    constructor(private httpService: HttpService) {
    }

    /** 获取Booth列表 */
    public requestBoothListData(searchParams: SearchBoothParams): Observable<BoothLinkResponse> {
        const httpUrl = `${this.domain}/admin/boothes`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new BoothLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续请求展位列表
     * @param string url linkUrl
     * @returns Observable<BoothLinkResponse>
     */
    public continueBoothListData(url: string): Observable<BoothLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new BoothLinkResponse(res)));
    }

    /**
     * 展位详情
     * @param booth_id ID
     * @returns Observable<BoothEntity>
     */
    public requestBoothDetailData(booth_id: string): Observable<BoothEntity> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => {
            return BoothEntity.Create(res.body);
        }));
    }

    /**
     * 添加Booth
     * @param addParams 添加参数
     */
    public requestAddBoothData(addParams: BoothEntity): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes`;
        return this.httpService.post(httpUrl, addParams.toEditJson());
    }

    /**
     * 编辑Booth
     * @param booth_id ID
     * @param editParams 编辑参数
     */
    public requestUpdateBoothData(booth_id: string, editParams: BoothEntity): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}`;
        return this.httpService.put(httpUrl, editParams.toEditJson());
    }

    /**
     * 修改展位启停状态
     * @param booth_id 展位内容ID
     * @param status int 启停状态 1：开启 2：关闭 默认关闭
     * @returns Observable<HttpResponse<any>>
     */
    public requestChangeBoothConfigStatus(booth_id: string, status: number): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/status`;
        const body = {status};
        return this.httpService.patch(httpUrl, body);
    }

    /** 获取Booth内容列表
     * @param booth_id ID
     * @param searchParams
     */
    public requestBoothContentListData(booth_id: string, searchParams: SearchBoothContentParams): Observable<BoothContentLinkResponse> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/booth_contents`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new BoothContentLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续请求Booth内容列表
     * @param string url linkUrl
     * @returns Observable<BoothContentLinkResponse>
     */
    public continueBoothContentListData(url: string): Observable<BoothContentLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new BoothContentLinkResponse(res)));
    }

    /**
     * 展位内容详情
     * @param booth_id ID
     * @param booth_content_id 展位内容ID
     * @returns Observable<BoothContentEntity>
     */
    public requestBoothContentDetailData(booth_id: string, booth_content_id: string): Observable<BoothContentEntity> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/booth_contents/${booth_content_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => {
            return BoothContentEntity.Create(res.body);
        }));
    }

    /**
     * 添加展位内容
     * @param booth_id 展位ID
     * @param addParams 添加参数
     */
    public requestAddBoothContentData(booth_id: string, addParams: BoothContentEntity): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/booth_contents`;
        return this.httpService.post(httpUrl, addParams.toEditJson());
    }

    /**
     * 编辑展位内容
     * @param booth_id ID
     * @param booth_content_id 展位内容ID
     * @param boothParams 编辑参数
     */
    public requestUpdateBoothContentData(
        booth_id: string, booth_content_id: string, editParams: BoothContentEntity): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/booth_contents/${booth_content_id}`;
        return this.httpService.put(httpUrl, editParams.toEditJson());
    }

    /**
     * 更新序列
     * @param booth_id ID
     * @param booth_content_id 展位内容ID
     * @param order_num 新的序号
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateBoothContentOrder(booth_id: string, booth_content_id: string, order_num: number): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/booth_contents/${booth_content_id}/order_num`;
        const body = {order_num};
        return this.httpService.patch(httpUrl, body);
    }

    /**
     * 修改展位内容启停状态
     * @param booth_id ID
     * @param booth_content_id 展位内容ID
     * @param status int 启停状态 1：开启 2：关闭 默认关闭
     * @returns Observable<HttpResponse<any>>
     */
    public requestChangeBoothContentStatus(booth_id: string, booth_content_id: string, status: number): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/booth_contents/${booth_content_id}/status`;
        const body = {status};
        return this.httpService.patch(httpUrl, body);
    }

    /**
     * 删除展位内容
     * @param booth_id ID
     * @param booth_content_id 展位内容ID
     * @returns Observable<HttpResponse<any>>
     */
    public requestDeleteBoothContentData(booth_id: string, booth_content_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/boothes/${booth_id}/booth_contents/${booth_content_id}`;
        return this.httpService.delete(httpUrl);
    }
}
