import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { file_import } from '../../../../utils/file-import';

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
    public requestVehicleBrandList(params?: any): Observable<VehicleBrandLinkResponse> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_brands`, params)
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
                return tempResults;
            }));
    }

    /**
     * 根据厂商获取汽车车型列表
     * @returns Observable<Array<VehicleTypeEntity>
     */
    public requestVehicleTypeList(vehicle_series_id: string): Observable<Array<VehicleTypeEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle/vehicle_series/${vehicle_series_id}/vehicle_types`)
            .pipe(map(data => {
                const tempResults = data.body;
                return tempResults;
            }));
    }

    /**
     * 根据厂商获取汽车车系列表
     * @returns Observable<Array<VehicleSeriesEntity>
     */
    public requestVehicleSeriesListByBrand(vehicle_brand_id: string): Observable<Array<VehicleSeriesEntity>> {
        const params = {vehicle_brand: vehicle_brand_id};
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle_series`, params)
            .pipe(map(data => {
                const tempResults = data.body;
                return tempResults;
            }));
    }

    /**
     * 根据品牌获取汽车厂商列表
     * @returns Observable<Array<VehicleSeriesEntity>
     */
    public requestVehicleFirmListByIDs(params?: any): Observable<Array<VehicleFirmEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/vehicle_firms`, params)
            .pipe(map(data => {
                const tempResults = data.body;
                return tempResults;
            }));
    }

    /**
     * 导入车型信息
     * @param any file 参数
     * @returns Observable<HttpResponse<any>>
     */

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
    }
}

