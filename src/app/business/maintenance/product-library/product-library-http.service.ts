import { Injectable, EventEmitter } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProjectEntity } from '../project-managemant/project-managemant-http.service';
import { VehicleBrandEntity, VehicleFirmEntity } from '../vehicle-type-management/vehicle-type-management.service';
import { file_import } from '../../../../utils/file-import';

// 产品
export class ProductEntity extends EntityBase {
  public upkeep_accessory_id: string = undefined; // 保养配件库-主键ID
  public upkeep_item: ProjectEntity = undefined; // 所属项目
  public vehicle_brand: VehicleBrandEntity = undefined; // 所属品牌
  public vehicle_firm: VehicleFirmEntity = undefined; // 所属厂商
  public upkeep_item_id: string = undefined; // 所属项目id
  public vehicle_brand_id: string = undefined; // 所属品牌ID
  public vehicle_firm_id: string = undefined; // 所属厂商ID
  public upkeep_accessory_type: number = undefined; // 项目类型 1:配件 2:服务
  public upkeep_accessory_name: string = undefined; // 产品名称
  public is_original = true; // 是否原厂
  public brand_instruction: string = undefined; // 品牌说明 注:原产为否填写
  public is_brand_special = false; // 品牌专用
  public serial_number: string = undefined; // 零件编号
  public specification: string = undefined; // 规格
  public image_url: string = undefined; // 图片
  public original_amount: number = undefined; // 原价 单位:元
  public sale_amount: number = undefined; // 销售单价 单位:元
  public number = 1; // 所需数量 单位:件
  public upkeep_merchants: Array<any> = undefined; // 在售保养商家ID集合
  public created_time: number = undefined;
  public updated_time: string = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'upkeep_item') {
      return ProjectEntity;
    }
    if (propertyName === 'vehicle_brand') {
      return VehicleBrandEntity;
    }
    if (propertyName === 'vehicle_firm') {
      return VehicleFirmEntity;
    }
    return null;
  }

  public toEditJson(): any {
    const json = this.json();
    delete json['upkeep_item'];
    delete json['vehicle_brand'];
    delete json['vehicle_firm'];
    delete json['created_time'];
    delete json['updated_time'];
    delete json['upkeep_merchants'];
    if (json['upkeep_accessory_type'] === 2) {
      delete json['is_original'];
      delete json['vehicle_brand_id'];
      delete json['vehicle_firm_id'];
      delete json['is_brand_special'];
      delete json['serial_number'];
      delete json['specification'];
      delete json['number'];
    }
    return json;
  }
}

// 产品列表条件筛选参数
export class SearchParams extends EntityBase {
  public vehicle_brand_id = ''; // 汽车品牌
  public vehicle_firm_id = ''; // 汽车厂商
  public upkeep_accessory_name: string = undefined; // 配件/服务名称
  public upkeep_item_category: number = undefined; // 所属类别 1:保养项目 2:清洗养护项目 3:维修项目
  public upkeep_item_id: string = undefined; // 项目id
  public upkeep_accessory_type: number = undefined; // 项目类型 1:配件 2:服务
  public is_original: string = undefined; // 是否原厂
  public serial_number: string = undefined; // 零件编号
  public logo: number = undefined;  //
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
    return this.httpService.post(httpUrl, params.toEditJson());
  }

  /**
   * 编辑产品(配件/服务)
   * @param  params 新建参数
   */
  public requestUpdateProductData(params: ProductEntity, upkeep_accessory_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/upkeep_accessories/${upkeep_accessory_id}`;
    return this.httpService.put(httpUrl, params.toEditJson());
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

  /**
   * 上传产品
   * @param type 文件类型
   * @param myfile FILE
   */
  public requestImportProductData(type: any, myfile: any) {
    const eventEmitter = new EventEmitter();
    const params = {
      myfile,
      type
    };

    const url = `/upkeep_accessories/upload_accessory`;
    file_import(params, url, data => {
      eventEmitter.next(data);
    }, err => {
      eventEmitter.error(err);
    });
    return eventEmitter;
  }
}
