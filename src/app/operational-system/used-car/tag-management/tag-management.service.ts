import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';
import { HttpService } from '../../../core/http.service';

export enum TagOnlineStatus {
    on = 1,
    off = 2,
}

export class SearchParamsEntity extends EntityBase {
    public online_status: any = ''; // 	上线状态 1上线 2下线
    public section: string = undefined; // 创建时间 '15012344,15013454'
    public label_name: string = undefined;
}

export class TagManagementEntity extends EntityBase {
    public label_id: string = undefined; // 主键id
    public label_name: string = undefined; // 标签名称
    public description: string = undefined; // 描述
    public online_status: TagOnlineStatus = undefined; // 上线状态 1上线 2下线
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间
}

@Injectable({
    providedIn: 'root'
})
export class TagManagementService {

    private domain = environment.CAR_SERVE;

    // private domain = 'http://192.168.6.159:8340';

    constructor(private httpService: HttpService) {
    }

    /** 查看二手车标签列表 */
    public requestTagListData(searchParams: SearchParamsEntity): Observable<Array<TagManagementEntity>> {
        const httpUrl = `${this.domain}/admin/used_car/labels`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => {
                const tempList: Array<TagManagementEntity> = [];
                res.body.forEach(item => {
                    tempList.push(TagManagementEntity.Create(item));
                });
                return tempList;
            }));
    }

    /**
     * 添加编辑标签
     * @param tagCreate
     * @param label_id
     */
    public requestAddTagData(tagCreate: TagManagementEntity, label_id?: string): Observable<HttpResponse<any>> {
        const httpUrl = label_id ? `${this.domain}/admin/used_car/labels/${label_id}` : `${this.domain}/admin/used_car/labels`;
        return label_id ? this.httpService.put(httpUrl, tagCreate.json()) : this.httpService.post(httpUrl, tagCreate.json());
    }

    /**
     * 删除标签
     * @param label_id
     */
    public requestDeleteTagData(label_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/admin/used_car/labels/${label_id}`;
        return this.httpService.delete(httpUrl);
    }

    /**
     * 标签上下线
     * @param label_id
     * @param online_status
     */
    public requestTagOnlineStatusData(label_id: string, online_status: number): Observable<any> {
        const params = {online_status};
        const httpUrl = `${this.domain}/admin/used_car/labels/${label_id}/online_status`;
        return this.httpService.patch(httpUrl, params).pipe(map(res => res.body));
    }

    /**
     * 标签排序
     * @param label_id
     * @param to_label_id
     */
    public requestTagSortData(label_id: string, to_label_id: string): Observable<any> {
        const params = {to_label_id};
        const httpUrl = `${this.domain}/admin/used_car/labels/${label_id}/serial_number`;
        return this.httpService.put(httpUrl, params).pipe(map(res => res.body));
    }
}
