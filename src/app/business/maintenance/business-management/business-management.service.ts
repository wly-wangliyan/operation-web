import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { file_import } from '../../../../utils/file-import';
import {
    VehicleBrandEntity,
    VehicleFirmEntity,
    VehicleSeriesEntity,
    VehicleTypeEntity
} from '../vehicle-type-management/vehicle-type-management.service';
import { BrokerageLinkResponse } from '../../insurance/insurance.service';
import { HandbookEntity } from '../maintenance-manual/maintenance-manual-http.service';
import { ProductEntity } from '../product-library/product-library-http.service';

export class UpkeepMerchantEntity extends EntityBase {
    public upkeep_merchant_id: string = undefined; 	//	string	保养商家-主键
    public UpkeepCompany: UpkeepCompanyEntity = undefined; 	//	object	保养企业-外键
    public VehicleFirm: Array<VehicleFirmEntity> = undefined; 	//	object	汽车厂商-多对多
    public upkeep_merchant_name: string = undefined; 	//	string	名称
    public upkeep_merchant_type: number = undefined; 	//	integer	类型 1:4S品牌店
    public image_url = undefined; 	//	string	图片
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

export class UpkeepMerchantOperation extends EntityBase {
    public upkeep_merchant_operation_id: string = undefined; //	string	保养商家运营时段-主键
    public UpkeepMerchant: UpkeepMerchantEntity = undefined; //	object	保养商家
    public start_time: number = undefined; //	integer	每日可预订时段开始时间 单位:秒
    public end_time: number = undefined; //	integer	每日可预订时段结束时间 单位:秒
    public operation_time_amount: number = undefined; //	float	运营时段加/减价金额
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'UpkeepMerchant') {
            return UpkeepMerchantEntity;
        }
        return null;
    }
}

export class SearchUpkeepProductParams extends EntityBase {
    public status = ''; // 	integer	F	状态 1:销售中 2:未上架
    public vehicle_brand_id = ''; // 	string(32)	F	汽车品牌ID
    public vehicle_firm_id = ''; // 	string(32)	F	汽车厂商ID
    public vehicle_series_id = ''; // 	string(32)	F	车系ID
    public vehicle_type_name = ''; // 	string	F	车型名称
    public page_size = 45; // integer	F	每页条数 默认20
    public page_num = 1; // integer	F	页码 默认1
}

export class UpkeepMerchantProductEntity extends EntityBase {
    public upkeep_merchant_product_id: string = undefined; //	string	保养商家产品-主键
    public vehicle_brand: VehicleBrandEntity = undefined; //	object	汽车品牌-外键
    public vehicle_firm: VehicleFirmEntity = undefined; //	object	汽车厂商-外键
    public vehicle_series: VehicleSeriesEntity = undefined; //	object	汽车车系-外键
    public vehicle_type: VehicleTypeEntity = undefined; //	object	汽车车型-外键
    public upkeep_merchant: UpkeepMerchantEntity = undefined; //	object	保养商家-外键
    public status: number = undefined; //	integer	状态 1:上架 2:下架
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'vehicle_brand') {
            return VehicleBrandEntity;
        } else if (propertyName === 'vehicle_firm') {
            return VehicleFirmEntity;
        } else if (propertyName === 'vehicle_series') {
            return VehicleSeriesEntity;
        } else if (propertyName === 'vehicle_type') {
            return VehicleTypeEntity;
        } else if (propertyName === 'upkeep_merchant') {
            return UpkeepMerchantEntity;
        }
        return null;
    }
}

export class HandbookItemEntity extends EntityBase {
    public item_category = undefined; //	float	项目类型
    public item_id: string = undefined; //	string	保养手册id
    public item_name: string = undefined; //	string	项目名称
    public upkeep_item_type = undefined; //	string	项目类型
    public switch: string = undefined; //	string	开关
    public uh_item_id: string = undefined; //	string	保养手册-项目id
    public description: string = undefined; //	string	描述
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间
}

export class UpkeepMerchantProjectEntity extends EntityBase {
    public upkeep_merchant_project_id: string = undefined; //	string	保养商家项目-主键
    public vehicle_type: VehicleTypeEntity = undefined; //	object	汽车车型-外键
    public upkeep_merchant_product: UpkeepMerchantProductEntity = undefined; //	object	保养商家产品-外键
    public upkeep_handbook_item: HandbookItemEntity = undefined; //	object	保养手册项目-外键
    public work_original_amount = undefined; //	float	原价工时费 单位:元
    public work_sale_amount = undefined; //	float	售价工时费 单位:元
    public switch = undefined; //	boolean	商家项目开关 True:开 False:关
    public accessory_count = undefined; //	float	已选配件数
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'upkeep_merchant_product') {
            return UpkeepMerchantProductEntity;
        } else if (propertyName === 'upkeep_handbook_item') {
            return HandbookItemEntity;
        } else if (propertyName === 'vehicle_type') {
            return VehicleTypeEntity;
        }
        return null;
    }
}

export class UpkeepMerchantAccessoryEntity extends EntityBase {
    public upkeep_merchant_accessory_id: string = undefined; //	string	保养商家配件-主键
    public upkeep_merchant_project: UpkeepMerchantProjectEntity = undefined; //	object	保养商家项目-外键
    public upkeep_accessory: ProductEntity = undefined; //	object	保养产品/配件库
    public number: number = undefined; //	integer	所需数量 单位:件
    public sale_amount: number = undefined; //	float	销售单价 单位:元
    public original_amount: number = undefined; //	float	销售单价 单位:元
    public created_time: number = undefined; 	// float 	创建时间
    public updated_time: number = undefined; 	// float 	修改时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'upkeep_merchant_project') {
            return UpkeepMerchantProjectEntity;
        } else if (propertyName === 'upkeep_accessory') {
            return ProductEntity;
        }
        return null;
    }
}

export class UpkeepMerchantLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<UpkeepMerchantEntity> {
        const tempList: Array<UpkeepMerchantEntity> = [];
        results.forEach(res => {
            tempList.push(UpkeepMerchantEntity.Create(res));
        });
        return tempList;
    }
}

export class UpkeepProductLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<UpkeepMerchantProductEntity> {
        const tempList: Array<UpkeepMerchantProductEntity> = [];
        results.forEach(res => {
            tempList.push(UpkeepMerchantProductEntity.Create(res));
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
     * @returns Observable<UpkeepMerchantLinkResponse>
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
     * 请求获取商家详情
     * @returns Observable<UpkeepMerchantEntity>
     */
    public requestUpkeepMerchantDetail(upkeep_merchant_id: string): Observable<UpkeepMerchantEntity> {
        return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}`)
            .pipe(map(res => res.body));
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
     * 请求编辑商家
     * @param string upkeep_merchant_id 参数
     * @param string upkeep_operation_id 参数
     * @param any params 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateUpkeepMerchant(upkeep_merchant_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService
            .put(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}`, params);
    }

    /**
     * 产品上架、下架状态
     * @param upkeep_merchant_id 商家id
     * @param params 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestProductStatus(upkeep_merchant_id: string, upkeep_merchant_product_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.patch(environment.OPERATION_SERVE +
            `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_merchant_product_id}/status`, params);
    }

    /**
     * 请求获取保养商家运营时段列表
     * @returns Observable<Array<VehicleFirmEntity>
     */
    public requestUpkeepMerchantOperationList(upkeep_merchant_id: string): Observable<Array<UpkeepMerchantOperation>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_operations`)
            .pipe(map(data => {
                const tempResults = data.body;
                return tempResults;
            }));
    }

    /**
     * 请求删除商家运营时段
     * @param string upkeep_merchant_id 参数
     * @param string upkeep_operation_id 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestDeleteUpkeepOperation(upkeep_merchant_id: string, upkeep_operation_id: string): Observable<HttpResponse<any>> {
        return this.httpService.delete(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_operations/${upkeep_operation_id}`);
    }

    /**
     * 请求创建商家运营时段
     * @param string upkeep_merchant_id 参数
     * @param any params 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestAddUpkeepOperation(upkeep_merchant_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService
            .post(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_operations`, params);
    }

    /**
     * 请求编辑商家运营时段
     * @param string upkeep_merchant_id 参数
     * @param string upkeep_operation_id 参数
     * @param any params 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateUpkeepOperation(upkeep_merchant_id: string, upkeep_operation_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService
            .put(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_operations/${upkeep_operation_id}`, params);
    }

    /**
     * 请求获取商家产品列表
     * @returns Observable<BrokerageLinkResponse>
     */
    public requestUpkeepProductList(upkeep_merchant_id: string, params: SearchUpkeepProductParams): Observable<UpkeepProductLinkResponse> {
        return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products`, params)
            .pipe(map(res => new UpkeepProductLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续请求获取商家产品列表
     * @param string url linkUrl
     * @returns Observable<BrokerageLinkResponse>
     */
    public continueUpkeepProductList(url: string): Observable<UpkeepProductLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new UpkeepProductLinkResponse(res)));
    }

    /**
     * 请求获取商家绑定厂商判断是否可移除
     * @param string upkeep_merchant_id 参数
     * @param string vehicle_firm_id 参数
     * @returns Observable<>
     */
    public requestFirmsAllowRemove(upkeep_merchant_id: string, vehicle_firm_id: string): Observable<any> {
        return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/vehicle_firms/${vehicle_firm_id}/allow_remove`)
            .pipe(map(res => res.body));
    }

    /**
     * 请求删除商家产品
     * @param string upkeep_merchant_id 参数
     * @param string upkeep_operation_id 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestDeleteUpkeepProduct(upkeep_merchant_id: string, upkeep_product_id: string): Observable<HttpResponse<any>> {
        return this.httpService.delete(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}`);
    }

    /**
     * 请求创建商家产品
     * @param string upkeep_merchant_id 参数
     * @param string vehicle_typeId 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestAddUpkeepProduct(upkeep_merchant_id: string, vehicle_typeId: string): Observable<HttpResponse<any>> {
        const params = {vehicle_type_id: vehicle_typeId};
        return this.httpService
            .post(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products`, params);
    }

    /**
     * 请求获取商家产品详情
     * @returns Observable<UpkeepMerchantEntity>
     */
    public requestUpkeepProductDetail(upkeep_merchant_id: string, upkeep_product_id: string): Observable<UpkeepMerchantProductEntity> {
        return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}`)
            .pipe(map(res => res.body));
    }

    /**
     * 请求获取保养商家产品下项目列表
     * @returns Observable<Array<UpkeepMerchantProjectEntity>
     */
    public requestUpkeepProjectList(upkeep_merchant_id: string, upkeep_product_id: string): Observable<Array<UpkeepMerchantProjectEntity>> {
        return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}/upkeep_projects`)
            .pipe(map(data => {
                const tempResults = data.body;
                return tempResults;
            }));
    }

    /**
     * 请求获取商家产品项目下配件列表
     * @returns Observable<Array<UpkeepMerchantAccessoryEntity>
     */
    public requestProjectAccessoriesList(upkeep_merchant_id: string, upkeep_product_id: string, upkeep_project_id: string): Observable<Array<UpkeepMerchantAccessoryEntity>> {
        return this.httpService.get
        (environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}/upkeep_projects/${upkeep_project_id}/upkeep_accessories`)
            .pipe(map(data => {
                const tempResults = data.body;
                return tempResults;
            }));
    }

    /**
     * 编辑商家项目状态
     * @param upkeep_merchant_id 商家id
     * @param params 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpkeepProductStatus(upkeep_merchant_id: string, upkeep_merchant_product_id: string, upkeep_project_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.patch(environment.OPERATION_SERVE +
            `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_merchant_product_id}/upkeep_projects/${upkeep_project_id}/status`, params);
    }

    /**
     * 请求创建商家配件
     * @param string upkeep_merchant_id 参数
     * @param string vehicle_typeId 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestAddUpkeepAccessories(upkeep_merchant_id: string, upkeep_product_id: string, upkeep_project_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.post(environment.OPERATION_SERVE +
            `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}/upkeep_projects/${upkeep_project_id}/upkeep_accessories`, params);
    }

    /**
     * 请求编辑商家配件
     * @param string upkeep_merchant_id 参数
     * @param string vehicle_typeId 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateUpkeepAccessories(upkeep_merchant_id: string, upkeep_product_id: string, upkeep_project_id: string, upkeep_accessory_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.put(environment.OPERATION_SERVE +
            `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}/upkeep_projects/${upkeep_project_id}/upkeep_accessories/${upkeep_accessory_id}
`, params);
    }

    /**
     * 请求删除商家运营时段
     * @param string upkeep_merchant_id 参数
     * @param string upkeep_operation_id 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestDeleteUpkeepAccessory(upkeep_merchant_id: string, upkeep_product_id: string, upkeep_project_id: string, upkeep_accessory_id: string): Observable<HttpResponse<any>> {
        return this.httpService.delete(environment.OPERATION_SERVE + `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}/upkeep_projects/${upkeep_project_id}/upkeep_accessories/${upkeep_accessory_id}`);
    }

    /**
     * 请求编辑商家项目
     * @param string upkeep_merchant_id 参数
     * @param string vehicle_typeId 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateUpkeepProject(upkeep_merchant_id: string, upkeep_product_id: string, upkeep_project_id: string, params: any): Observable<HttpResponse<any>> {
        return this.httpService.put(environment.OPERATION_SERVE +
            `/upkeep_merchants/${upkeep_merchant_id}/upkeep_products/${upkeep_product_id}/upkeep_projects/${upkeep_project_id}`, params);
    }
}

