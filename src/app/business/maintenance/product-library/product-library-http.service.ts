import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProjectEntity } from '../project-managemant/project-managemant-http.service';
import { VehicleBrandEntity, VehicleFirmEntity } from '../vehicle-type-management/vehicle-type-management.service';

// 产品
export class ProductEntity extends EntityBase {
  public upkeep_accessory_id: string = undefined; // 保养配件库-主键ID
  public UpkeepItem: ProjectEntity = undefined; // 所属项目
  public VehicleBrand: VehicleBrandEntity = undefined; // 所属品牌
  public VehicleFirm: VehicleFirmEntity = undefined; // 所属厂商
  public upkeep_item_id: string = undefined; // 所属项目id
  public vehicle_brand_id: string = undefined; // 所属品牌ID
  public vehicle_firm_id: string = undefined; // 所属厂商ID
  public upkeep_accessory_type: number = undefined; // 项目类型 1:配件 2:服务
  public upkeep_accessory_name: string = undefined; // 产品名称
  public is_original: boolean = undefined; // 是否原厂
  public brand_instruction: string = undefined; // 品牌说明 注:原产为否填写
  public is_brand_special: boolean = undefined; // 品牌专用
  public serial_number: string = undefined; // 零件编号
  public specification: string = undefined; // 规格
  public image_url: string = undefined; // 图片
  public original_amount: number = undefined; // 原价 单位:元
  public sale_amount: number = undefined; // 销售单价 单位:元
  public number: number = undefined; // 所需数量 单位:件
  public upkeep_merchants: Array<any> = undefined; // 在售保养商家ID集合
  public created_time: number = undefined;
  public updated_time: string = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'UpkeepItem') {
      return ProjectEntity;
    }
    if (propertyName === 'VehicleBrand') {
      return VehicleBrandEntity;
    }
    if (propertyName === 'VehicleFirm') {
      return VehicleFirmEntity;
    }
    return null;
  }
}

// 产品列表条件筛选参数
export class SearchParams extends EntityBase {
  public vehicle_brand_id: string = undefined; // 汽车品牌
  public vehicle_firm_id: string = undefined; // 汽车厂商
  public upkeep_accessory_name: string = undefined; // 配件/服务名称
  public upkeep_item_category: number = undefined; // 所属类别 1:保养项目 2:清洗养护项目 3:维修项目
  public upkeep_item_name: string = undefined; // 项目名称
  public upkeep_accessory_type: number = undefined; // 项目类型 1:配件 2:服务
  public is_original: boolean = undefined; // 是否原厂
  public page_num = 1; // 页码 默认:1
  public page_size = 45; // 每页条数 默认:15
}

// 产品
export class AddProductParams extends EntityBase {
  public upkeep_item_id: string = undefined; // 所属项目ID
  public upkeep_accessory_type: ProjectEntity = undefined; // 项目类型 1:配件 2:服务
  public upkeep_accessory_name: string = undefined; // 产品名称
  public is_original: boolean = undefined; // 是否原厂
  public vehicle_brand_id: VehicleBrandEntity = undefined; // 所属品牌ID
  public vehicle_firm_id: VehicleFirmEntity = undefined; // 所属厂商ID
  public is_brand_special: boolean = undefined; // 品牌专用
  public brand_instruction: string = undefined; // 品牌说明 注:原产为否填写
  public serial_number: string = undefined; // 零件编号
  public specification: string = undefined; // 规格
  public image_url: string = undefined; // 图片
  public original_amount: number = undefined; // 原价 单位:元
  public sale_amount: number = undefined; // 销售单价 单位:元
  public number: number = undefined; // 所需数量 单位:件
  public upkeep_merchants: Array<any> = undefined; // 在售保养商家ID集合
  public created_time: number = undefined;
  public updated_time: string = undefined;
}

// 保养商家
export class MerchantEntity extends EntityBase {
  public upkeep_merchant_id: string = undefined; // 保养商家-主键ID
  public upkeep_merchant_name: string = undefined; // 保养商家名称
  public created_time: number = undefined;
  public updated_time: string = undefined;
}

export class ProductLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ProductEntity> {
    const tempList: Array<ProductEntity> = [];
    results.forEach(res => {
      tempList.push(ProductEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductLibraryHttpService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /**
   * 获取产品/配件列表
   * @param searchParams 条件检索参数
   */
  public requestProductListData(searchParams: SearchParams): Observable<ProductLinkResponse> {
    const httpUrl = `${this.domain}/upkeep_accessories`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new ProductLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求产品(服务、配件）配件列表
   * @param string url linkUrl
   * @returns Observable<ProductLinkResponse>
   */
  public continueProductListData(url: string): Observable<ProductLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ProductLinkResponse(res)));
  }

  /**
   * 新建产品(配件/服务)
   * @param  params 新建参数
   */
  public requestAddProductData(params: ProductEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/upkeep_accessories`;
    return this.httpService.post(httpUrl, params.json());
  }

  /**
   * 编辑产品(配件/服务)
   * @param  params 新建参数
   */
  public requestUpdateProductData(params: ProductEntity, upkeep_accessory_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/upkeep_accessories/${upkeep_accessory_id}`;
    return this.httpService.post(httpUrl, params.json());
  }

  /**
   * 获取产品(配件/服务)详情
   * @param upkeep_accessory_id 保养配件库-主键ID
   * @returns Observable<ProductEntity>
   */
  public requestProductDetailData(upkeep_accessory_id: string): Observable<ProductEntity> {
    const httpUrl = `${this.domain}/upkeep_accessories/${upkeep_accessory_id}`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => ProductEntity.Create(res.body)));
  }

  /**
   * 删除产品(配件/服务)
   * @param upkeep_accessory_id 保养配件库-主键ID
   */
  public requestDeleteProductData(upkeep_accessory_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/upkeep_accessories/${upkeep_accessory_id}`;
    return this.httpService.delete(httpUrl);
  }
}
