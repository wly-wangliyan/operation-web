import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { Observable, timer } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { EntityBase } from '../../../utils/z-entity';

// 保养商家运营时段对象
export class UpkeepMerchantOperationEntity extends EntityBase {
  public upkeep_merchant_operation_id: string = undefined; 	// 	String	保养商家运营时段-主键
  public start_time: number = undefined; 	// integer	每日可预订时段开始时间 单位:秒
  public end_time: number = undefined; 	// integer	每日可预订时段结束时间 单位:秒
  public operation_time_amount: number = undefined; 	// float	运营时段加/减价金额
  public updated_time: number = undefined; // float	更新时间
  public created_time: number = undefined; // 	float	创建时间 / 下单时间
}

// 保养项目及配件对象列表
export class OrderDetailEntity extends EntityBase {
  public upkeep_merchant_project_id: string = undefined; 	// 	String	保养商家项目id
  public item_id: string = undefined; 	// 	String	项目id
  public item_name: string = undefined; 	// 	String	项目名称
  public item_category: number = undefined; 	// int	项目类别
  public upkeep_merchant_accessory_id: string = undefined; 	// 	String	保养商家配件 - 主键
  public upkeep_accessory_type: number = undefined; 	// int	类型 1: 配件 2: 服务
  public upkeep_accessory_name: string = undefined; 	// 	string	产品名称
  public brand_instruction: string = undefined; 	// string	品牌说明 注:原产为否填写
  public is_original: boolean = undefined; 	// boolean 是否原厂 true原厂
  public is_brand_special: boolean = undefined; 	// boolean	品牌专用
  public serial_number: string = undefined; 	// 	string	零件编号
  public specification: string = undefined; 	// 	string	规格
  public image_url: string = undefined; 	// 	string	图片
  public number: number = undefined; 	// int	所需数量 单位: 件
  public original_amount: number = undefined; 	// float	原价 单位: 元
  public sale_amount: number = undefined; 	// 	float	销售单价 单位: 元
  public product_discounted_amount: number = undefined; 	// 	float	产品优惠 单位:元
  public pay_amount: number = undefined; // float	应付 单位: 元
  public real_pay_amount: number = undefined; // 	float	销售单价 单位: 元
  public work_original_amount: number = undefined; // float	原价工时费 单位: 元
  public work_discounted_amount: number = undefined; // float	工时费优惠 单位元
  public work_sale_amount: number = undefined; // float	售价工时费 单位: 元
  public updated_time: number = undefined; // float	更新时间
  public created_time: number = undefined; // 	float	创建时间 / 下单时间
}

// 保养订单
export class UpkeepOrderEntity extends EntityBase {
  public upkeep_order_id: string = undefined; 	// 	String	保险报价记录id
  public car_id: string = undefined; 	// 	String	车牌号
  public frame_number: string = undefined; 	// 	String	车架号
  public payer_name: string = undefined; 	// 	payer_name 购买人姓名（付款人）
  public payer_phone: string = undefined; 	// 	String	购买人预留电话
  public car_pay_time: number = undefined; 	// 	int	报价状态1: 待报价, 2: 已报价
  public kilometers: number = undefined; 	// 	int	行驶公里数
  public vehicle_type_id: string = undefined; 	// string	车型id
  public vehicle_brand_name: string = undefined; 	// 	string	品牌名称
  public vehicle_firm_name: string = undefined; 	// 	string	厂商名称
  public vehicle_series_name: string = undefined; 	// 	string	车系名称
  public vehicle_type_name: string = undefined; 	// string	车型名称
  public vehicle_year_model: string = undefined; 	// string	年款
  public upkeep_merchant_id: string = undefined; 	// 	string	商家id
  public upkeep_merchant_name: string = undefined; 	// 	string	商家名称
  public address: string = undefined; // 	string	商家地址
  public upkeep_item_categorys: string = undefined; // 	string	项目类别 逗号分割 1.保养项目 2.清洗养护项目 3.维修项目
  public item_categorys: Array<any> = []; // 	string	项目类别数组 1.保养项目 2.清洗养护项目 3.维修项目
  public upkeep_item_category_count: number = undefined; 	// 	int	项目类别数量
  public accessory_amount_total: number = undefined; // 	float	配件 / 服务费合计 单位元
  public accessory_amount_discounted: number = undefined; // 	float	配件 / 服务费优惠 单位元
  public work_amount_total: number = undefined; // 	float	工时费合计 单位元
  public work_amount_discounted: number = undefined; // float	工时费优惠 单位元
  public total_amount: number = undefined; // 	float	合计应付
  public discounted_amount: number = undefined; // 	float	优惠
  public total_real_amount: number = undefined; // 	float	合计实付 单位元
  public fee_amount: number = undefined; // float	优惠前金额(应付)
  public discounted_fee_amount: number = undefined; // 	float	优惠后金额
  public real_pay_amount: number = undefined; // 	float	实付金额(实付)
  public pay_time: number = undefined; // float	支付时间
  public pay_type: string = undefined; // string 支付方式 UU_APP 悠悠app支付 WX_JSAPI_SL微信支付
  public reserve_time: number = undefined; // float	预定时间
  public upkeep_merchant_operation: UpkeepMerchantOperationEntity = undefined; // obj	保养商家运营时段对象
  public pay_status: number = undefined; // int	订单状态 1未支付 2已支付 3已完成
  public operation_time_amount: number = undefined; // float	运营时段加/减价金额
  public write_off_code: number = undefined; // int	核销码
  public order_detail: Array<OrderDetailEntity> = undefined; // Array	保养项目及配件对象列表
  public order_complete_time: number = undefined; // float	订单完成时间
  public order_complete_operator: string = undefined; // string	订单完成操作人
  public updated_time: number = undefined; // float	更新时间
  public created_time: number = undefined; // 	float	创建时间 / 下单时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'order_detail') {
      return OrderDetailEntity;
    } else if (propertyName === 'upkeep_merchant_operation') {
      return UpkeepMerchantOperationEntity;
    }
    return null;
  }
}

export class SearchOrderParams extends EntityBase {
  public pay_status = ''; // int	F	订单状态 1未支付 2已支付 3已完成
  public vehicle_brand_name = ''; // string	F	汽车 品牌名称
  public upkeep_item_category = ''; // string	F	保养项目类别 1.保养项目 2.清洗养护项目 3.维修项目 4.全部
  public payer_phone = ''; // string	F	购买人预留电话
  public payer_name = ''; // string	F	购买人姓名（付款人）
  public upkeep_merchant_name = ''; // string	F	商家名称
  public upkeep_order_id = ''; // string	F	保养订单id
  public pay_time = ''; // string	F	支付时间
  public reserve_time = ''; // string	F	预定时间
  public page_size = 45; // integer	F	每页条数 默认：15
  public page_num = 1; // integer	F	页码 默认:1
}

export class OrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UpkeepOrderEntity> {
    const tempList: Array<UpkeepOrderEntity> = [];
    results.forEach(res => {
      tempList.push(UpkeepOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {
  constructor(private httpService: HttpService) { }

  /**订单管理列表
   * @param searchParams SearchOrderParams 查询参数
   * @returns Observable<OrderLinkResponse>
   */
  public requestOrderList(searchParams: SearchOrderParams): Observable<OrderLinkResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_order/orders`,
      params).pipe(map(res => new OrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求获取订单管理列表
   * @param url string linkUrl
   * @returns Observable<OrderLinkResponse>
   */
  public continueOrderList(url: string): Observable<OrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new OrderLinkResponse(res)));
  }

  /**
   * 订单管理详情
   * @param upkeep_order_id string 保养订单id
   * @returns Observable<UpkeepOrderEntity>
   */
  public requestOrderDetail(upkeep_order_id: string): Observable<UpkeepOrderEntity> {
    return this.httpService.get(environment.OPERATION_SERVE + `/upkeep_orders/${upkeep_order_id}`
    ).pipe(map(res => {
      return UpkeepOrderEntity.Create(res.body);
    }));
  }
}
