import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { file_import } from '../../../../utils/file-import';
import { VehicleFirmEntity } from '../vehicle-type-management/vehicle-type-management.service';
import { BrokerageLinkResponse } from '../../insurance/insurance.service';

export class UpkeepMerchantEntity extends EntityBase {
    public upkeep_merchant_id: string = undefined; 	//	string	保养商家-主键
    public UpkeepCompany: UpkeepCompanyEntity = undefined; 	//	object	保养企业-外键
    public VehicleFirm: VehicleFirmEntity = undefined; 	//	object	汽车厂商-多对多
    public upkeep_merchant_name: string = undefined; 	//	string	名称
    public upkeep_merchant_type: number = undefined; 	//	integer	类型 1:4S品牌店
    public image_url: string = undefined; 	//	string	图片
    public contact: string = undefined; 	//	string	联系人
    public telephone: string = undefined; 	//	string	电话
    public province: string = undefined; 	//	string	省
    public city: string = undefined; 	//	string	市
    public district: string = undefined; 	//	string	区
    public address: string = undefined; 	//	string	地址
    public region_id: string = undefined; 	//	string	区域编号
    public lon: string = undefined; 	//	string	经度
    public lat: string = undefined; 	//	string	纬度
    public location: number = undefined; 	//	point	坐标
    public booking = 30; 	//	integer	预订时间 单位:天
    public service_telephone: string = undefined; 	//	string	客服电话 例:'xxxx,xxxx'
    public merchant_status: number = undefined; 	//	integer	运营状态 1:运营中 2:停业休息(默认)
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'VehicleFirm') {
            return VehicleFirmEntity;
        } else if (propertyName === 'UpkeepCompany') {
            return UpkeepCompanyEntity;
        }
        return null;
    }
}

export class SearchUpkeepMerchantParams extends EntityBase {
    public status = ''; //	integer	F	状态 1:营业中 2:停止营业
    public vehicle_brand_id = ''; //	string(32)	F	汽车品牌ID
    public upkeep_merchant_name = ''; //	string	F	商家名称
    public page_size = 45; // integer	F	每页条数 默认20
    public page_num = 1; // integer	F	页码 默认1
}

export class UpkeepCompanyEntity extends EntityBase {
    public upkeep_company_id: string = undefined; //	string	保养企业主键ID
    public company_name: string = undefined; //	string	企业名称
    public account: string = undefined; //	string	企业账号
    public province: string = undefined; //	string	省
    public city: string = undefined; //	string	市
    public district: string = undefined; //	string	区
    public address: string = undefined; //	string	地址
    public region_id: string = undefined; //	string	区域code
    public person: string = undefined; //	string	企业法人
    public licence_num: string = undefined; //	string	营业执照编号
    public licence_photos: string = undefined; //	string	营业执照图片集
    public email: string = undefined; //	string	企业邮箱
    public telephone: string = undefined; //	string	手机号
    public is_deleted = undefined; //	boolean	逻辑删除
    public deleted_time: number = undefined; //	float	删除时间
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间
}
/*
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
}*/

export class UpkeepMerchantLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<UpkeepMerchantEntity> {
        const tempList: Array<UpkeepMerchantEntity> = [];
        results.forEach(res => {
            tempList.push(UpkeepMerchantEntity.Create(res));
        });
        return tempList;
    }
}

@Injectable({
    providedIn: 'root'
})
export class BusinessManagementService {
    constructor(private httpService: HttpService) {
    }

    /**
     * 请求获取商家列表
     * @returns Observable<BrokerageLinkResponse>
     */
    public requestUpkeepMerchantList(params: SearchUpkeepMerchantParams): Observable<UpkeepMerchantLinkResponse> {
        return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_merchants`, params)
            .pipe(map(res => new UpkeepMerchantLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续请求获取商家列表
     * @param string url linkUrl
     * @returns Observable<BrokerageLinkResponse>
     */
    public continueUpkeepMerchantList(url: string): Observable<UpkeepMerchantLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new UpkeepMerchantLinkResponse(res)));
    }

    /**
     * 开启、关闭营业状态
     * @param upkeep_merchant_id 商家id
     * @param params 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpkeepMerchants(upkeep_merchant_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.patch(environment.OPERATION_SERVE +
            `/upkeep_merchants/${upkeep_merchant_id}/status`, params);
    }

    /**
     * 请求获取汽车厂商列表
     * @returns Observable<Array<VehicleFirmEntity>
     */
   /* public requestVehicleFirmList(vehicle_brand_id: string): Observable<Array<VehicleFirmEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_brands/${vehicle_brand_id}/vehicle_firms`)
            .pipe(map(data => {
                const tempResults = data.body;
                // const results = [];
                // results.push(VehicleFirmEntity.Create(tempResults));
                return tempResults;
            }));
    }

    /!**
     * 根据厂商获取汽车车系列表
     * @returns Observable<Array<VehicleSeriesEntity>
     *!/
    public requestVehicleSeriesList(vehicle_firms_id: string): Observable<Array<VehicleSeriesEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_firms/${vehicle_firms_id}/vehicle_series`)
            .pipe(map(data => {
                const tempResults = data.body;
                // const results = [];
                // results.push(VehicleSeriesEntity.Create(tempResults));
                return tempResults;
            }));
    }

    /!**
     * 根据厂商获取汽车车系列表
     * @returns Observable<Array<VehicleTypeEntity>
     *!/
    public requestVehicleTypeList(vehicle_series_id: string): Observable<Array<VehicleTypeEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_series/${vehicle_series_id}/vehicle_types`)
            .pipe(map(data => {
                const tempResults = data.body;
                // const results = [];
                // results.push(VehicleTypeEntity.Create(tempResults));
                return tempResults;
            }));
    }

    /!**
     * 导入车型信息
     * @param any file 参数
     * @returns Observable<HttpResponse<any>>
     *!/

    public requestImportVehicle(type: any, file: any) {
        const eventEmitter = new EventEmitter();
        const params = {
            myfile: file,
            type: type,
        };

        const url = `/vehicle/upload_car`;
        file_import(params, url, data => {
            eventEmitter.next(data);
        }, err => {
            eventEmitter.error(err);
        });
        return eventEmitter;
    }*/
}

