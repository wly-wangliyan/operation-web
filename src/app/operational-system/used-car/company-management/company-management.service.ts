import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase, noClone } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';

export class SearchParamsEntity extends EntityBase {
    public merchant_name: string = undefined;
    public page_size = 45;
    public page_num = 1;
}

export class CompanyManagementEntity extends EntityBase {
    public merchant_id: string = undefined; // 商家id
    public merchant_name: string = undefined; // 商家名称
    public company: CompanyManagementObjEntity = undefined; // 所属企业
    public contacts: string = undefined; // 联系人
    public telephone: string = undefined; // 联系电话
    public region_id: string = undefined; // 省市区code
    public province: string = undefined; // 省
    public city: string = undefined; // 市
    public district: string = undefined; // 区
    public address: string = undefined; // 详细地址
    public lon: string = undefined; // 经度
    public lat: string = undefined; // 纬度
    public consult_info: Array<ConsultationEntity> = undefined;
    public created_time: number = undefined; // 创建时间
    public updated_time: number = undefined; // 更新时间

    /**
     * 获取详细地址
     */
    @noClone
    public get detailAddress(): string {
        return this.province + this.city + this.district + this.address;
    }

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'company') {
            return CompanyManagementObjEntity;
        }
        if (propertyName === 'consult_info') {
            return ConsultationEntity;
        }
        return null;
    }
}

export class CompanyManagementObjEntity extends EntityBase {
    public address: string = undefined;
    public company_id: string = undefined;
    public company_name: string = undefined;
    public email: string = undefined;
    public licence_num: string = undefined;
    public licence_photos: Array<string> = undefined;
    public person: string = undefined;
    public region_id: string = undefined;
    public telephone: string = undefined;
    public updated_time: number = undefined;
    public created_time: number = undefined;
}

export class ConsultationEntity extends EntityBase {
    public name: string = undefined;
    public telephone: string = undefined;
    public error: string = undefined;
}

@Injectable({
    providedIn: 'root'
})

export class CompanyManagementService {

    // private domain = environment.CAR_SERVE;

    private domain = 'http://192.168.6.159:8340';

    constructor(private httpService: HttpService) {
    }

    /** 查看二手车商家列表 */
    public requestCompanyListData(searchParams: SearchParamsEntity): Observable<CompanyManagementLinkResponse> {
        const httpUrl = `${this.domain}/admin/used_car/merchants`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new CompanyManagementLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续查看二手车商家列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueCompanyListData(url: string): Observable<CompanyManagementLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new CompanyManagementLinkResponse(res)));
    }

    /**
     * 添加|编辑商家
     * @param consultationList
     * @param merchant_id
     */
    public requestAddCompanyData(
        consultationList: Array<ConsultationEntity>, merchant_id: string): Observable<HttpResponse<any>> {
        const arr = [];
        consultationList.forEach(item => {
            const temp = item.clone();
            delete temp.error;
            arr.push(temp);
        });
        const params = {consult_info: arr};
        const httpUrl = merchant_id ?
            `${this.domain}/admin/used_car/merchants/${merchant_id}` : `${this.domain}/admin/used_car/merchants`;
        return merchant_id ? this.httpService.put(httpUrl, params) :
            this.httpService.post(httpUrl, params);
    }


    /**
     * 查看商家详情
     * @param merchant_id
     */
    public requestCompanyDetailData(merchant_id: string): Observable<CompanyManagementEntity> {
        const httpUrl = `${this.domain}/admin/used_car/merchants/${merchant_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => {
            return CompanyManagementEntity.Create(res.body);
        }));
    }
}


export class CompanyManagementLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<CompanyManagementEntity> {
        const tempList: Array<CompanyManagementEntity> = [];
        results.forEach(res => {
            tempList.push(CompanyManagementEntity.Create(res));
        });
        return tempList;
    }
}
