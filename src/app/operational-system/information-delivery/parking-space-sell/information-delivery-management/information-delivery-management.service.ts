import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { EntityBase, noClone } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ReviewStatus } from '../../used-car/information-delivery-management/information-delivery-management.service';

export class CreateParkingPlaceParams extends EntityBase {
    public demand_type: number = undefined; // 供需类型 1出租 2出售
    public place_area: number = undefined; // 车位面积
    public place_type: number = undefined; // 车位类型 1地上露天车位 2地下车库 3地上车库
    public rent: number = undefined; // 租金
    public rent_type = 1; // 租金类型 1元/月 2元/㎡/元 3万元
    public start_month: number = undefined; // 起租期
    public contact: string = undefined; // 	联系人
    public telephone: string = undefined; // 	电话
    public publisher = '管理员'; // 	发布人
    public province: string = undefined;
    public city: string = undefined;
    public district: string = undefined;
    public region_id: string = undefined;
    public address: string = undefined;
    public lon = '';
    public lat = '';
    public title: string = undefined; // 标题
    // public label: Array<ParkingPlaceLabelEntity> = []; // 标签 最多5个
    public images: string = undefined; // 图片集 最多10张
    public place_details: string = undefined; // 详情

    constructor(source?: ParkingPlaceEntity) {
        super();
        if (source) {
            this.demand_type = source.demand_type;
            this.place_area = source.place_area;
            this.place_type = source.place_type;
            this.rent = source.rent;
            this.rent_type = source.rent_type || 1;
            this.start_month = source.start_month;
            this.contact = source.contact;
            this.telephone = source.telephone;
            this.publisher = source.publisher;
            this.province = source.province;
            this.city = source.city;
            this.district = source.district;
            this.region_id = source.region_id;
            this.address = source.address;
            this.lon = source.lon;
            this.lat = source.lat;
            this.title = source.title;
            this.place_details = source.place_details;
        }
    }
}

export class PlaceListParams extends EntityBase {
    public review_section: string = null; // 	发布时间段
    public title: string = undefined; // 标题
    public place_type = ''; // 车位类型 1地上露天车位 2地下车库 3地上车库
    public demand_type = ''; // 供需类型 1出租 2出售
    public region_id: any = '';
    public telephone: string = undefined; // 电话
    public review_status: any = undefined; // 审核状态 1待审 2通过 3驳回
    public page_size = 45;
    public page_num = 1;
}

export class ParkingPlaceEntity extends EntityBase {
    public parking_place_info_id: string = undefined;
    public demand_type: number = undefined; // 供需类型 1出租 2出售
    public place_area: number = undefined; // 车位面积
    public place_type: number = undefined; // 车位类型 1地上露天车位 2地下车库 3地上车库
    public rent: number = undefined; // 租金
    public rent_type: number = undefined; // 租金类型 1元/月 2元/㎡/元 3万元
    public start_month: number = undefined; // 起租期
    public province: string = undefined;
    public city: string = undefined;
    public district: string = undefined;
    public region_id: string = undefined;
    public address: string = undefined;
    public lon: string = undefined;
    public lat: string = undefined;
    public title: string = undefined; // 标题
    // public label: ParkingPlaceLabelEntity = undefined; // 标签 最多5个
    public images: string = undefined; // 图片集 最多10张
    public place_details: string = undefined; // 详情
    public publisher: string = undefined; // 	发布人
    public contact: string = undefined; // 	联系人
    public telephone: string = undefined; // 	电话
    public order_num: number = undefined; // 	序号
    public online_status: number = undefined; // 	类型 1上线 2下线
    public review_time: number = undefined; // 	上线时间
    public review_status: number = undefined; // 	审核状态 1待审 2通过 3驳回
    public is_deleted: boolean = undefined; // 	是否删除
    public reject_reason: string = undefined; // 	驳回理由
    public click_count: number = undefined; // 	点击次数
    public created_time: number = undefined;
    public updated_time: number = undefined;

    // public getPropertyClass(propertyName: string): typeof EntityBase {
    //   if (propertyName === 'label') {
    //     return ParkingPlaceLabelEntity;
    //   }
    //   return null;
    // }

    @noClone
    public get coverImage(): string {
        return this.images.split(',')[0];
    }

    @noClone
    public get addressInfo(): string {
        return this.province + this.city + this.district + this.address;
    }
}

@Injectable({
    providedIn: 'root'
})
export class InformationDeliveryManagementService {

    private domain = environment.CAR_SERVE;

    // private domain = 'http://192.168.6.159:8340';

    constructor(private httpService: HttpService) {
    }

    /**
     * 查看出租车位信息列表
     * @param placeListParams
     */
    public requestParkingPlaceList(placeListParams: PlaceListParams): Observable<ParkingPlaceListLinkResponse> {
        const url = this.domain + `/admin/parking_place_infos`;
        return this.httpService.get(url, placeListParams.json()).pipe(map(data => new ParkingPlaceListLinkResponse(data)));
    }

    /**
     * 通过link获取出租车位信息列表
     * @param linkUrl
     */
    public continueRequestParkingPlaceList(linkUrl: string): Observable<ParkingPlaceListLinkResponse> {
        return this.httpService.get(linkUrl).pipe(map(data => new ParkingPlaceListLinkResponse(data)));
    }

    /**
     * 查看车位信息详情
     * @param parking_place_info_id
     */
    public requestParkingPlaceDetailData(parking_place_info_id: string): Observable<ParkingPlaceEntity> {
        const httpUrl = `${this.domain}/admin/parking_place_infos/${parking_place_info_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => ParkingPlaceEntity.Create(res.body)));
    }

    /**
     * 删除出租车位信息
     * @param parking_place_info_id
     */
    public requestDeleteParkingPlaceDetailData(parking_place_info_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/parking_place_infos/${parking_place_info_id}`;
        return this.httpService.delete(httpUrl).pipe(map(res => res.body));
    }

    /**
     * 修改|创建出租车位信息
     * @param createParkingPlaceParams
     * @param parking_place_info_id
     */
    public requestCreateParkingPlaceData(createParkingPlaceParams: CreateParkingPlaceParams, parking_place_info_id: string): Observable<HttpResponse<any>> {
        if (parking_place_info_id) {
            const httpUrl = `${this.domain}/admin/parking_place_infos/${parking_place_info_id}`;
            return this.httpService.put(httpUrl, createParkingPlaceParams);
        } else {
            const httpUrl = `${this.domain}/admin/parking_place_infos`;
            return this.httpService.post(httpUrl, createParkingPlaceParams);
        }
    }

    /**
     * 下线出租车位信息
     * @param parking_place_info_id
     * @param online_status
     */
    public requestParkingPlaceOnlineStatus(parking_place_info_id: string, online_status: number): Observable<any> {
        const params = {online_status}; // 1上线 2下线
        const httpUrl = `${this.domain}/admin/parking_place_infos/${parking_place_info_id}/online_status`;
        return this.httpService.patch(httpUrl, params).pipe(map(res => res.body));
    }

    /**
     * 审核二手车信息
     * @param parking_place_info_id
     * @param review_status
     * @param reject_reason
     */
    public requestParkingPlaceReviewStatusData(parking_place_info_id: string, review_status: ReviewStatus, reject_reason?: string): Observable<any> {
        const params = {review_status, reject_reason}; // 2通过 3驳回
        const httpUrl = `${this.domain}/admin/parking_place_infos/${parking_place_info_id}/review_status`;
        return this.httpService.put(httpUrl, params).pipe(map(res => res.body));
    }

    /**
     * 出租车位信息排序
     * @param parking_place_info_id
     * @param to_place_id
     */
    public requestParkingPlaceOrderNum(parking_place_info_id: string, to_place_id: string): Observable<any> {
        const params = {to_place_id};
        const httpUrl = `${this.domain}/admin/parking_place_infos/${parking_place_info_id}/order_num`;
        return this.httpService.patch(httpUrl, params).pipe(map(res => res.body));
    }

}

class ParkingPlaceListLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ParkingPlaceEntity> {
        return results.map(res => ParkingPlaceEntity.Create(res));
    }
}
