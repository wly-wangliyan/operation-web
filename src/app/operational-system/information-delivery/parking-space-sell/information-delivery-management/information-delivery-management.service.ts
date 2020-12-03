import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class CreateParkingPlaceParams {
    public demand_type: number = undefined; // 供需类型 1出租 2出售
    public place_area: number = undefined; // 车位面积
    public place_type: number = undefined; // 车位类型 1地上露天车位 2地下车库 3地上车库
    public rent: number = undefined; // 租金
    public start_month: number = undefined; // 起租期
    public contact: string = undefined; // 	联系人
    public telephone: string = undefined; // 	电话
    public publisher: string = undefined; // 	发布人
    public province: string = undefined;
    public city: string = undefined;
    public district: string = undefined;
    public region_id: string = undefined;
    public address: string = undefined;
    public lon: string = undefined;
    public lat: string = undefined;
    public title: string = undefined; // 标题
    // public label: Array<ParkingPlaceLabelEntity> = []; // 标签 最多5个
    public images: string = undefined; // 图片集 最多10张
}

export class PlaceListParams {
    public radius: string = undefined; // 半径
    public lon: string = undefined;
    public lat: string = undefined;
    public demand_type: number = undefined; // 供需类型 1出租 2出售
    public region_id: number = undefined;
    public min_price: number = undefined; // 价格区间最小值
    public max_price: number = undefined; // 价格区间最大值
}

export class ParkingPlaceEntity extends EntityBase {
    public parking_place_info_id: string = undefined;
    public demand_type: number = undefined; // 供需类型 1出租 2出售
    public place_area: number = undefined; // 车位面积
    public place_type: number = undefined; // 车位类型 1地上露天车位 2地下车库 3地上车库
    public rent: number = undefined; // 租金
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

    // public getPropertyClass(propertyName: string): typeof EntityBase {
    //   if (propertyName === 'label') {
    //     return ParkingPlaceLabelEntity;
    //   }
    //   return null;
    // }
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
        const url = this.domain + `/user/parking_place_infos`;
        return this.httpService.get(url, placeListParams).pipe(map(data => new ParkingPlaceListLinkResponse(data)));
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
        const httpUrl = `${this.domain}/user/parking_place_infos/${parking_place_info_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => ParkingPlaceEntity.Create(res.body)));
    }

    /**
     * 修改|创建出租车位信息
     * @param createParkingPlaceParams
     * @param parking_place_info_id
     */
    public requestCreateParkingPlaceData(createParkingPlaceParams: CreateParkingPlaceParams, parking_place_info_id: string): Observable<HttpResponse<any>> {
        if (parking_place_info_id) {
            const httpUrl = `${this.domain}/user/parking_place_infos/${parking_place_info_id}`;
            return this.httpService.put(httpUrl, createParkingPlaceParams);
        } else {
            const httpUrl = `${this.domain}/user/parking_place_infos`;
            return this.httpService.post(httpUrl, createParkingPlaceParams);
        }
    }

}

class ParkingPlaceListLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ParkingPlaceEntity> {
        return results.map(res => ParkingPlaceEntity.Create(res));
    }
}
