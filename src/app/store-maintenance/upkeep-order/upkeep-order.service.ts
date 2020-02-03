import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable, Subject } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpService, LinkResponse, HttpErrorEntity } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { AccessoryEntity, SpecificationEntity, ProjectEntity, AccessoryParamsEntity } from '../accessory-library/accessory-library.service';
import { RepairShopEntity } from '../garage-management/garage-management.service';

export class UpkeepOrderSearchParams extends EntityBase {
  // 到店保养订单
  public user_order_status = ''; // 订单状态 1：待支付 2:待收货(配送中) 3:待服务(已到达) 4：已取消 5：已完成
  public buyer_tel: string = undefined; // 手机号
  public buyer_name: string = undefined; // 购买人
  public arrival_order_id: string = undefined; // 订单id
  // 上门保养订单
  public order_status = ''; // 订单状态 1：待支付 2：已支付 3：已取消 4：已退款
  public contact_tel: string = undefined; // 手机号
  public contact_name: string = undefined; // 购买人
  public order_id: string = undefined; // 订单id
  // 公共参数
  public repair_shop_name: string = undefined; // 汽修店
  public order_section: string = undefined; // 下单时间
  public pay_section: string = undefined; // 支付时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 人工匹配
export class MatchParams extends EntityBase {
  public repair_shop_id = ''; // 汽修店id
  public repair_shop_name: string = undefined; // 汽修店
  public accessory_id = ''; // 配件id
  public accessory_name: string = undefined; // 配件名称
  public specification_id = ''; // 规格id
  public battery_model: string = undefined; // 配件型号
  public original_fee: number = undefined; // 商品价格
}

// 配件信息
export class AccessoryInfoEntity extends AccessoryEntity {
  public battery_model: string = undefined; // 配件型号
  public brand_name: string = undefined; // 品牌
  public buy_num: number = undefined; // 数量
  public original_fee: number = undefined; // 原价
  public supplier_name: string = undefined; // 供应商
  public warehouse_name: string = undefined; // 仓库
  public specification_id: string = undefined; // 规格id
}

// 配件信息
export class SpecificationInfoEntity extends SpecificationEntity {
  public project: ProjectEntity = undefined; // 所属项目
  public accessory_model: string = undefined; // string	配件型号
  public num: number = undefined; // 数量

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'project') {
      return ProjectEntity;
    }
    return null;
  }
}

// 保养订单退款订单实体
export class DoorRefundOrderEntity extends EntityBase {
  public door_refund_order_id: string = undefined; // 上门保养退款订单id-主键
  public refund_status: number = undefined; // 退款状态 0未申请退款 1退款中，2已退款，3退款失败
}

// 保养订单实体
export class UpkeepOrderEntity extends EntityBase {
  public door_order_id: string = undefined; // 上门保养订单id-主键
  public ht_code: string = undefined; // 用户id
  public ht_client_id: string = undefined; // 车辆类型 1：小型车
  public trade_no: string = undefined; // 微信支付订单id
  public contact_name: string = undefined; // 联系人
  public contact_tel: string = undefined; // 联系手机号
  public repair_shop_name: string = undefined; // 汽修店名称
  public repair_shop_id: string = undefined; // 汽修店id
  public repair_shop_district: string = undefined; // 汽修店所在区域
  public buy_num: number = undefined; // 购买数量
  public is_matched: boolean = undefined; // 是否匹配
  public accessory_info: Array<AccessoryInfoEntity> = undefined; // 配件信息
  public original_fee: number = undefined; // 原价
  public real_prepaid_fee: number = undefined; // 实收预付费 单位：分
  public right_prepaid_fee: number = undefined; // 应收预付费 单位：分
  public real_balance_fee: number = undefined; // 实收尾款 单位：分
  public right_balance_fee: number = undefined; // 应收尾款 单位：分
  public prepaid_platform_discount: number = undefined; // 预付平台立减 单位：分
  public balance_platform_discount: number = undefined; // 尾款平台立减 单位：分
  public prepaid_coupon_discount: number = undefined; // 预付优惠卷优惠金额 单位：分
  public balance_coupon_discount: number = undefined; // 尾款优惠卷优惠金额 单位：分
  public total_right_fee: number = undefined; // 总金额 单位：分
  public pay_time: number = undefined; // 支付时间
  public send_status: number = undefined; // 配送状态 1：待收货 2：已完成
  public order_status: number = undefined; // 订单状态 1：待支付 2：待服务 3:已取消 4：已完成 5：已关闭
  public service_message_count: number = undefined; // 客服短信条数
  public service_message_content: string = undefined; // 客服短信内容
  public repair_message_count: number = undefined; // 汽修店短信条数
  public repair_message_content: string = undefined; // 汽修店短信内容
  public car_id: string = undefined; // 车牌号
  public car_model: string = undefined; // 车型
  public region: string = undefined; // 行政区
  public lon: number = undefined; // 经度
  public lat: number = undefined; // 纬度
  public location: string = undefined; // 地址坐标
  public address: string = undefined; // 详细地址
  public expect_date: number = undefined; // 期望送达时间
  public remark: string = undefined; // 订单备注
  public take_order_time: number = undefined; // 接单时间
  public refund_time: number = undefined; // 退款时间
  public refund_fee: number = undefined; // 退款金额
  public confirm_time: number = undefined; // 完成时间
  public cancel_reason: string = undefined; // 取消原因
  public refund_reason: string = undefined; // 退款原因
  public refund_fee_status: number = undefined; // 退款类型 1:部分退款 2:全额退款
  public refund_status: number = undefined; // 退款状态 0未申请退款 1退款中，2已退款，3退款失败
  public door_refund_order: DoorRefundOrderEntity = undefined; // 退款订单
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'accessory_info') {
      return AccessoryInfoEntity;
    } else if (propertyName === 'door_refund_order') {
      return DoorRefundOrderEntity;
    }
    return null;
  }
}

export class DoorRefundParams extends EntityBase {
  public refund_fee: number = undefined; // 退款金额

  public toEditJson(): any {
    const json = this.json();
    json.refund_fee = Math.round(json.refund_fee * 100);
    return json;
  }
}

export class UpkeepOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UpkeepOrderEntity> {
    const tempList: Array<UpkeepOrderEntity> = [];
    results.forEach(res => {
      tempList.push(UpkeepOrderEntity.Create(res));
    });
    return tempList;
  }
}
// 到店保养订单-配件
export class AccessoryItem extends EntityBase {
  public accessory_name: string = undefined; // 配件名称
  public accessory_params: AccessoryParamsEntity = undefined; // 配件参数
  public number: number = undefined; // 数量
  public content: string = undefined; // 规格
  public image: string = undefined; // 规格图片
  public sale_fee: number = undefined; // 单价
}
// 到店保养订单-服务
export class ServiceItem extends EntityBase {
  public service_fee_id: string = undefined; // 服务id
  public service_fee_name: string = undefined; // 服务费名称
  public sale_amount: string = undefined; // 单价
  public number = 1; // 数量
}

// 到店保养订单
export class ArrivalOrderEntity extends EntityBase {
  public order_id: string = undefined; // 订单id-主键
  public user_id: string = undefined; // 用户id
  public client_id: string = undefined; // client_id 区分平台
  public buyer_name: string = undefined; // 购买人
  public buyer_tel: string = undefined; // 购买人手机号
  public repair_shop_name: string = undefined; // 汽修店名称
  public repair_shop_id: string = undefined; // 汽修店id
  public accessory_info: Array<AccessoryItem> = []; // 配件信息
  public service_info: Array<ServiceItem> = []; // 服务信息
  public original_fee: number = undefined; // 应付(原价)配件费 单位：分
  public sale_fee: number = undefined; // 实付(售价)配件费 单位：分
  public minus_fee: number = undefined; // 平台立减(原价-售价)配件费 单位：分
  public original_work_fee: number = undefined; // 应付(原价)工时费 单位：分
  public sale_work_fee: number = undefined; // 实付(售价)工时费 单位：分
  public minus_work_fee: number = undefined; // 平台立减(原价-售价)工时费 单位：分
  public sale_total_fee: number = undefined; // 合计实收(总售价) 单位：分
  public order_time: number = undefined; // 下单时间
  public pay_time: number = undefined; // 支付时间
  public user_status: number = undefined; // C端用户订单状态 1：待支付 2:待收货(配送中) 3:待服务(已到达 ) 4：已取消 5：已完成
  public repair_shop_status: number = undefined; // B端汽修店订单状态 1:待收货(待收件) 2:待服务 3：已完成
  public supplier_status: number = undefined; // B端供应商订单状态 1:待收货(待发货) 2:已完成
  public car_id: string = undefined; // 车牌号
  public car_mileage: number = undefined; // 行驶公里数
  public car_model: string = undefined; // 车型
  public repair_shop_address: string = undefined; // 汽修店地址
  public send_time: number = undefined; // 配送时间
  public aog_time: number = undefined; // 货物到达时间
  public check_time: number = undefined; // 验货时间
  public check_images: string = undefined; // 验货图片 "xxx,xxx,..."
  public complete_time: number = undefined; // 完成时间
  public code: string = undefined; // 二维码
  public trade_num: string = undefined; // 交易单号
  public is_checked: number = undefined; // 是否需要验货 1:需要 2:不需要
  public warehouse_ids: string = undefined; // 仓库ids 多个逗号分隔
  public remark: string = undefined; // 订单备注
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'accessory_info') {
      return AccessoryItem;
    }
    if (propertyName === 'service_info') {
      return ServiceItem;
    }
    return null;
  }
}

export class ArrivalOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ArrivalOrderEntity> {
    const tempList: Array<ArrivalOrderEntity> = [];
    results.forEach(res => {
      tempList.push(ArrivalOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpkeepOrderService {

  private domain = environment.STORE_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: UpkeepOrderSearchParams): Observable<UpkeepOrderLinkResponse> {
    const httpUrl = `${this.domain}/door_orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new UpkeepOrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<UpkeepOrderLinkResponse>
   */
  public continueOrderListData(url: string): Observable<UpkeepOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new UpkeepOrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param door_order_id 订单ID
   * @returns Observable<UpkeepOrderEntity>
   */
  public requestOrderDetailData(door_order_id: string): Observable<UpkeepOrderEntity> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => UpkeepOrderEntity.Create(res.body)));
  }

  /**
   * 退款
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestOrderRefundData(door_order_id: string, params: DoorRefundParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}/refund_orders`;
    return this.httpService.post(httpUrl, params.toEditJson());
  }

  /**
   * 获取项目列表
   */
  public requestProjectListData(): Observable<Array<ProjectEntity>> {
    const httpUrl = `${this.domain}/projects/all`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<ProjectEntity> = [];
      res.body.forEach(data => {
        tempList.push(ProjectEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 获取规格列表
   * @param accesspry_id 配件id
   */
  public requestSpecificationData(accesspry_id: string): Observable<Array<SpecificationEntity>> {
    const httpUrl = `${this.domain}/accessies/${accesspry_id}/specifications/all`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<SpecificationEntity> = [];
      res.body.forEach(data => {
        tempList.push(SpecificationEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 通过配件(蓄电池)获取汽修店
   * @param accesspry_id 配件id
   */
  public requestRepairShopData(accesspry_id: string): Observable<Array<RepairShopEntity>> {
    const httpUrl = `${this.domain}/accessories/${accesspry_id}/repair_shops/all`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<RepairShopEntity> = [];
      res.body.forEach(data => {
        tempList.push(RepairShopEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 人工匹配
   * @param door_order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestMatchDate(door_order_id: string, params: MatchParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}`;
    return this.httpService.put(httpUrl, params.json());
  }

  /**
   * 编辑期望送达日期
   * @param door_order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditDate(door_order_id: string, expect_date: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}/expect_date`;
    const body = {
      expect_date
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 编辑订单备注
   * @param door_order_id 订单ID
   * @param remark 备注
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditRemark(door_order_id: string, remark: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}/remark`;
    const body = {
      remark
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 重新发送短信
   * @param order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestResendMessage(order_id: string, order_type: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/orders/${order_id}/send_short_message`;
    const body = {
      order_type
    };
    return this.httpService.post(httpUrl, body);
  }

  /**
   * 获取汽修店已配置的电瓶配件列表
   * @param project_id 保养项目id
   * @returns Subject<[Array<AccessoryEntity>]
   */
  public requestAllOfConfigAccessoryData(project_id: string): Observable<Array<any>> {
    const url = `${this.domain}/projects/${project_id}/config_accessories?page_num=1&page_size=1000`;
    const subject = new Subject<Array<any>>();
    this.requestLinkAllOfConfigAccessoryList(url, [[], []], subject);
    return subject;
  }

  /**
   * 递归获取汽修店已配置的电瓶配件列表
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllOfConfigAccessoryList(url: string, dataArray: Array<any>, subject: Subject<Array<any>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data.body;
      results.forEach(jsonObj => {
        const dataEntity: AccessoryEntity = AccessoryEntity.Create(jsonObj);
        dataArray[0].push(dataEntity);
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllOfConfigAccessoryList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 获取到店保养订单列表
   * @param searchParams 条件检索参数
   */
  public requestArrivalOrderListData(searchParams: UpkeepOrderSearchParams): Observable<ArrivalOrderLinkResponse> {
    const httpUrl = `${this.domain}/admin/arrival_orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new ArrivalOrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<ArrivalOrderLinkResponse>
   */
  public continueArrivalOrderListData(url: string): Observable<ArrivalOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ArrivalOrderLinkResponse(res)));
  }

  /**
   * 获取到店保养订单详情
   * @param arrival_order_id 订单ID
   * @returns Observable<ArrivalOrderEntity>
   */
  public requestArrivalOrderDetailData(arrival_order_id: string): Observable<ArrivalOrderEntity> {
    const httpUrl = `${this.domain}/admin/arrival_orders/${arrival_order_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => ArrivalOrderEntity.Create(res.body)));
  }

  /**
   * 完成服务
   * @param arrival_order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestFinishDate(arrival_order_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/arrival_orders/${arrival_order_id}`;
    const body = {
      status: 5
    };
    return this.httpService.patch(httpUrl, body);
  }
}
