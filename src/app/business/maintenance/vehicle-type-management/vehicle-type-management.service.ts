import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { BrokerageEntity } from '../../insurance/insurance.service';

export class VehicleBrandEntity extends EntityBase {
    public vehicle_brand_id: string = undefined; 	// 	string	id
    public vehicle_brand_name: string = undefined; 	// 	string	品牌名称
    public vehicle_brand_image: string = undefined; 	// 	string	品牌图片
    public vehicle_brand_initial: string = undefined; 	// 	string	品牌拼音大写首字母
    public third_party_id: string = undefined; 	// 	string	第三方id
    public third_party_source: string = undefined; 	// 	string	第三方来源
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间
}

export class VehicleFirmEntity extends EntityBase {
    public vehicle_firm_id: string = undefined; 	// 	string	id
    public vehicle_firm_name: string = undefined; 	// 	string	厂商名称
    public third_party_id: string = undefined; 	// 	string	第三方id
    public third_party_source: string = undefined; 	// 	string	第三方来源
    public vehicle_brand: VehicleBrandEntity = undefined; 	// 	obj	品牌
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'vehicle_brand') {
            return VehicleBrandEntity;
        }
        return null;
    }
}

export class VehicleSeriesEntity extends EntityBase {
    public vehicle_series_id: string = undefined; 	//	string	id
    public vehicle_series_name: string = undefined; 	//	string	车系名称
    public third_party_id: string = undefined; 	//	string	第三方id
    public third_party_source: string = undefined; 	//	string	第三方来源
    public vehicle_brand: VehicleBrandEntity = undefined; 	//	obj	品牌
    public vehicle_firm: VehicleFirmEntity = undefined; 	//	obj	厂商
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'vehicle_brand') {
            return VehicleBrandEntity;
        } else if (propertyName === 'vehicle_firm') {
            return VehicleFirmEntity;
        }
        return null;
    }
}

export class VehicleTypeEntity extends EntityBase {
    public vehicle_type_id: string = undefined; 	//	string	id
    vehicle_type_name: string = undefined; 	//	string	车型名称
    third_party_id: string = undefined; 	//	string	第三方id
    third_party_source: string = undefined; 	//	string	第三方来源
    vehicle_brand: VehicleBrandEntity = undefined; 	//	obj	品牌
    vehicle_firm: VehicleFirmEntity = undefined; 	//	obj	厂商
    vehicle_series: VehicleSeriesEntity = undefined; 	//	obj	车系
    vehicle_year_model: string = undefined; 	//	string	年款
    vehicle_price: string = undefined; 	//	string	指导价
    vehicle_level: string = undefined; 	//	string	车辆级别
    vehicle_energy_type: string = undefined; 	//	string	能源类型
    vehicle_sold_time: string = undefined; 	//	string	上市时间
    vehicle_engine: string = undefined; 	//	string	发动机
    vehicle_gearbox: string = undefined; 	//	string	变速箱
    vehicle_size: string = undefined; 	//	string	车辆尺寸
    vehicle_structure: string = undefined; 	//	string	车辆结构
    has_upkeep_handbook = undefined; 	//	bool	是否有保养手册
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'vehicle_brand') {
            return VehicleBrandEntity;
        } else if (propertyName === 'vehicle_firm') {
            return VehicleFirmEntity;
        } else if (propertyName === 'vehicle_series') {
            return VehicleSeriesEntity;
        }
        return null;
    }
}

export class UpdateBrokerageEntity extends EntityBase {
    public describe: string = undefined; 	// 	string	T	描述
    public ic_company: string = undefined; 	// 	string	T	保险公司id

    constructor(describe?: string, ic_company?: string) {
        super();
        this.describe = describe;
        this.ic_company = ic_company;
    }

    public toEditJson(): any {
        const json = this.json();
        return json;
    }
}

export class UpdateInsueranceEntity extends EntityBase {
    public describe: string = undefined; 	// 	string	T	描述
    public ic_name: string = undefined; 	// 	string	T	保险公司名称
    public ic_image: string = undefined; 	// 	string	T	保险公司logo
    public tag: string = undefined; 	// 	string	T	标签

    constructor(describe?: string, ic_name?: string, ic_image?: string, tag?: string) {
        super();
        this.describe = describe;
        this.ic_name = ic_name;
        this.ic_image = ic_image;
        this.tag = tag;
    }

    public toEditJson(): any {
        const json = this.json();
        return json;
    }
}

export class VehicleBrandLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<VehicleBrandEntity> {
        const tempList: Array<VehicleBrandEntity> = [];
        results.forEach(res => {
            tempList.push(VehicleBrandEntity.Create(res));
        });
        return tempList;
    }
}

@Injectable({
    providedIn: 'root'
})
export class VehicleTypeManagementService {
    constructor(private httpService: HttpService) {
    }

    /**
     * 请求获取品牌列表
     * @returns Observable<BrokerageLinkResponse>
     */
    public requestVehicleBrandList(): Observable<VehicleBrandLinkResponse> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_brands`)
            .pipe(map(res => new VehicleBrandLinkResponse(res)));
    }

    /**
     * 请求获取汽车厂商列表
     * @returns Observable<Array<VehicleFirmEntity>
     */
    public requestVehicleFirmList(vehicle_brand_id: string): Observable<Array<VehicleFirmEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_brands/${vehicle_brand_id}/vehicle_firms`)
            .pipe(map(data => {
                const tempResults = data.body;
                // const results = [];
                // results.push(VehicleFirmEntity.Create(tempResults));
                return tempResults;
            }));
    }

    /**
     * 根据厂商获取汽车车系列表
     * @returns Observable<Array<VehicleSeriesEntity>
     */
    public requestVehicleSeriesList(vehicle_firms_id: string): Observable<Array<VehicleSeriesEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_firms/${vehicle_firms_id}/vehicle_series`)
            .pipe(map(data => {
                const tempResults = data.body;
                // const results = [];
                // results.push(VehicleSeriesEntity.Create(tempResults));
                return tempResults;
            }));
    }

    /**
     * 根据厂商获取汽车车系列表
     * @returns Observable<Array<VehicleTypeEntity>
     */
    public requestVehicleTypeList(vehicle_series_id: string): Observable<Array<VehicleTypeEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_series/${vehicle_series_id}/vehicle_types`)
            .pipe(map(data => {
                const tempResults = data.body;
                // const results = [];
                // results.push(VehicleTypeEntity.Create(tempResults));
                return tempResults;
            }));
    }

    /**
     * 请求获取保险公司列表
     * @returns Observable<FirstPageIconLinkResponse>
     */
    /*public requestInsuranceUseList(): Observable<InsuranceLinkResponse> {
        return this.httpService.get(environment.OPERATION_SERVE + `/admin/insurances/use`).pipe(map(res => new InsuranceLinkResponse(res)));
    }*/

    /**
     * 停用、启用
     * @param menu_id 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUseInsurance(ic_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.patch(environment.OPERATION_SERVE +
            `/admin/insurance/${ic_id}`, params);
    }

    /**
     * 更新序列
     * @param menu_id 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateSort(ic_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.patch(environment.OPERATION_SERVE + `/admin/insurance/${ic_id}/sort`, params);
    }

    /**
     * 获取经纪公司详情
     * @param string broker_company_id 编号
     * @returns Observable<BrokerageEntity>
     */

    /*public requestBrokerDetail(broker_company_id: string): Observable<BrokerageEntity> {
        return this.httpService.get(environment.OPERATION_SERVE + `/admin/broker/${broker_company_id}`
        ).pipe(map(res => BrokerageEntity.Create(res.body)));
    }*/

    /**
     * 获取保险公司详情
     * @param string broker_company_id 编号
     * @returns Observable<BrokerageEntity>
     */
    /*public requestInsuranceDetail(ic_id: string): Observable<InsuranceEntity> {
        return this.httpService.get(environment.OPERATION_SERVE + `/admin/insurance/${ic_id}`
        ).pipe(map(res => InsuranceEntity.Create(res.body)));
    }*/

    /**
     * 编辑经纪公司信息
     * @param params 参数列表
     * @param broker_company_id 经纪公司id
     * @returns Observable<HttpResponse<any>>
     */
    public requestModifyBrokerage(params: UpdateBrokerageEntity, broker_company_id: string): Observable<HttpResponse<any>> {
        return this.httpService.put(environment.OPERATION_SERVE + `/admin/broker/${broker_company_id}`, params.json());
    }

    /**
     * 新建保险公司信息
     * @param params 参数列表
     * @param application_id 应用id
     * @returns Observable<HttpResponse<any>>
     */
    public requestAddInsurance(params: UpdateInsueranceEntity): Observable<HttpResponse<any>> {
        return this.httpService.post(environment.OPERATION_SERVE + `/admin/insurances`, params.json());
    }

    /**
     * 编辑保险公司信息
     * @param params 参数列表
     * @param ic_id 保险公司id
     * @returns Observable<HttpResponse<any>>
     */
    public requestModifyInsurance(params: UpdateInsueranceEntity, ic_id: string): Observable<HttpResponse<any>> {
        return this.httpService.put(environment.OPERATION_SERVE + `/admin/insurance/${ic_id}`, params.json());
    }
}

