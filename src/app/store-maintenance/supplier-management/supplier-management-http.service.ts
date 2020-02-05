import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpService, LinkResponse } from '../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityBase } from '../../../utils/z-entity';
import { HttpResponse } from '@angular/common/http';

// 供应商
export class SupplierEntity extends EntityBase {
  public supplier_id: string = undefined; // string	供应商ID 主键
  public supplier_name: string = undefined; // string	供应商名称
  public province: string = undefined; // string	省
  public city: string = undefined; // string	市
  public district: string = undefined; // string	区
  public address: string = undefined; // string	供应商地址
  public contacts: string = undefined; // string	联系人
  public telephone: string = undefined; // string	手机号/联系电话
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

// 仓库
export class WarehouseEntity extends EntityBase {
  public warehouse_id: string = undefined; // string	仓库ID 主键
  public warehouse_name: string = undefined; // string	仓库名称
  public supplier: SupplierEntity = new SupplierEntity(); // object	供应商 外键
  public address: string = undefined; // string	仓库地址
  public contacts: string = undefined; // string	联系人
  public telephone: string = undefined; // string	联系电话
  public province: string = undefined; // string	省
  public city: string = undefined; // string	市
  public district: string = undefined; // string	区
  public run_start_time: number = undefined; // integer	营业开始时间
  public run_end_time: number = undefined; // integer	营业结束时间
  public sms_telephone: string = undefined; // string	短信通知手机号 "xxx,xxx"
  public st_status: number = undefined; // integer	短信通知手机号状态 1:开启 2：未开启(默认)
  public status: number = undefined; // integer	营业状态 1:营业 2:不营业
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'supplier') {
      return SupplierEntity;
    }
    return null;
  }
}

export class SupplierLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<SupplierEntity> {
    const tempList: Array<SupplierEntity> = [];
    results.forEach(res => {
      tempList.push(SupplierEntity.Create(res));
    });
    return tempList;
  }
}

export class WarehouseLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<WarehouseEntity> {
    const tempList: Array<WarehouseEntity> = [];
    results.forEach(res => {
      tempList.push(WarehouseEntity.Create(res));
    });
    return tempList;
  }
}

// 查询供应商参数
export class SearchParams extends EntityBase {
  public supplier_name: string = undefined; // F	商家名称
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 查询仓库参数
export class SearchWarehouseParams extends EntityBase {
  public warehouse_name: string = undefined; // F	商家名称
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

@Injectable({
  providedIn: 'root'
})
export class SupplierManagementHttpService {

  private domain = environment.STORE_DOMAIN; // 保养域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取供应商列表
   * @param searchParams 条件检索参数
   * @returns Observable<SupplierLinkResponse>
   */
  public requestSupplierListData(searchParams: SearchParams): Observable<SupplierLinkResponse> {
    const httpUrl = `${this.domain}/admin/suppliers`;
    return this.httpService.get(httpUrl, searchParams.json())
        .pipe(map(res => new SupplierLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求供应商列表
   * @param string url linkUrl
   * @returns Observable<SupplierLinkResponse>
   */
  public continueSupplierListData(url: string): Observable<SupplierLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new SupplierLinkResponse(res)));
  }

  /**
   * 获取仓库列表
   * @param supplier_id 供应商id
   * @returns Observable<SupplierLinkResponse>
   */
  public requestWarehouseListData(supplier_id: string, searchParams: SearchWarehouseParams): Observable<WarehouseLinkResponse> {
    const httpUrl = `${this.domain}/admin/suppliers/${supplier_id}/warehouses`;
    return this.httpService.get(httpUrl, searchParams.json()).pipe(map(res => new WarehouseLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求仓库列表
   * @param string url linkUrl
   * @returns Observable<SupplierLinkResponse>
   */
  public continueWarehouseListData(url: string): Observable<WarehouseLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new WarehouseLinkResponse(res)));
  }

  /**
   * 获取供应商仓库详情
   * @param string supplier_id 供应商编号
   * @param warehouse_id 仓库id
   * @returns Observable<CarParamEntity>
   */
  public requestWarehouseDetail(supplier_id: string, warehouse_id: string): Observable<WarehouseEntity> {
    return this.httpService.get(this.domain + `/admin/suppliers/${supplier_id}/warehouses/${warehouse_id}`
    ).pipe(map(res => WarehouseEntity.Create(res.body)));
  }

  /**
   * 修改线下仓库的营业状态
   * @param supplier_id string 供应商ID
   * @param car_param_id string 仓库ID
   * @param status number T	仓库营业状态 1:营业 2:不营业
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateStatusData(supplier_id: string, warehouse_id: string, status: number): Observable<HttpResponse<any>> {
    const httpUrl = this.domain + `/admin/suppliers/${supplier_id}/warehouses/${warehouse_id}/status`;
    return this.httpService.patch(httpUrl, { status });
  }

  /**
   * 编辑仓库信息
   * @param string supplier_id  供应商编号
   * @param string warehouse_id 仓库id
   * @param option WarehouseEntity 仓库信息
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditWarehouseData(supplier_id: string, warehouse_id: string, warehouse: WarehouseEntity): Observable<HttpResponse<any>> {
    return this.httpService.put(this.domain + `/admin/suppliers/${supplier_id}/warehouses/${warehouse_id}`, warehouse);
  }
}
