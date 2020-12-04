import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { mockData, mockRequest, MockSceneType } from './mocker';
import { map } from 'rxjs/operators';


export class SearchParamsEntity extends EntityBase {
    public parking_place_label_name: string = undefined;
}

@mockData({
    parking_place_label_id: {
        classType: String,
        scene: MockSceneType.telephone,
        // defaults: ['111', '222']
    },
    parking_place_label_name: {
        classType: String,
        scene: MockSceneType.name,
    },
    created_time: Number
})
export class TagManagementEntity extends EntityBase {
    public parking_place_label_id: string = undefined; // 主键id
    public parking_place_label_name: string = undefined; // 标签名称
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间
}

@Injectable({
    providedIn: 'root'
})
export class TagManagementService {

    // private domain = environment.CAR_SERVE;

    private domain = 'http://192.168.6.124:8010';

    constructor(private httpService: HttpService) {
    }

    /** 查看出租车位标签列表 */
    @mockRequest(TagManagementEntity, true)
    public requestTagListData(searchParams: SearchParamsEntity): Observable<TagListDataLinkResponse> {
        const httpUrl = `${this.domain}/admin/parking_place_labels`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new TagListDataLinkResponse(res)));
    }

    /** 继续获取出租车位标签列表 */
    public continueRequestTagListData(linkUrl: string): Observable<TagListDataLinkResponse> {
        return this.httpService.get(linkUrl).pipe(map(res => new TagListDataLinkResponse(res)));
    }

    /**
     * 添加编辑标签
     * @param tagCreate
     * @param parking_place_label_id
     */
    public requestAddTagData(tagCreate: TagManagementEntity, parking_place_label_id?: string): Observable<HttpResponse<any>> {
        const httpUrl = parking_place_label_id ? `${this.domain}/admin/parking_place_labels/${parking_place_label_id}` : `${this.domain}/admin/parking_place_labels`;
        return parking_place_label_id ? this.httpService.put(httpUrl, tagCreate.json()) : this.httpService.post(httpUrl, tagCreate.json());
    }

    /**
     * 删除标签
     * @param parking_place_label_id
     */
    public requestDeleteTagData(parking_place_label_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/parking_place_labels/${parking_place_label_id}`;
        return this.httpService.delete(httpUrl);
    }

}

export class TagListDataLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<TagManagementEntity> {
        const tempList: Array<TagManagementEntity> = [];
        results.forEach(res => {
            tempList.push(TagManagementEntity.Create(res));
        });
        return tempList;
    }
}

