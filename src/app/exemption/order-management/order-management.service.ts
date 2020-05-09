import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable, timer } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpService, LinkResponse, HttpErrorEntity } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../../core/global.service';

export class OrderSearchParams extends EntityBase {
  public status: number = undefined; // 订单状态
  public processing_flow: number = undefined; // 办理流程
  public phone: string = undefined; // 车主信息：手机号
  public name: string = undefined; // 车主信息：购买人
  public exemption_order_id: string = undefined; // 订单id
  public created_section: string = undefined; // 下单时间
  public pay_section: string = undefined; // 支付时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 订单实体
export class ExemptionOrderEntity extends EntityBase {
  public order_id: string = undefined; // 订单id
  public car_id: string = undefined; // 车主信息：车牌号
  public car_type: number = undefined; // 车辆类型 1：小型车
  public name: string = undefined; // 车主信息：购买人
  public phone: string = undefined; // 车主信息：手机号
  public address: string = undefined; // 车主信息：收货地址
  public processing_flow: number = undefined; // 办理流程 1,待办理 2,已提交办理 3,制贴完成 4,已发货 5,已驳回 6已驳回并退款 7,已确认收货
  public status: number = undefined; // 订单状态 1未支付 2已支付 3已退款 4已完成 5已取消
  public reject_type: number = undefined; // 驳回原因 (1,'没有驳回'),(2,'提交材料不清晰'),(3,'存在未处理违章'),(4,'与车主协商一致'),(5,'其他')
  public reject_notice: string = undefined; // 当reject_type为5时显示的驳回原因
  public reject_remarks: string = undefined; // 驳回备注
  public total_amount: number = undefined; // 应付 单位：分
  public real_amount: number = undefined; // 实付 单位：分
  public discounts_amount: number = undefined; // 平台立减 单位：分
  public payment_order_id: string = undefined; // 支付交易单号
  public pay_type: string = undefined; // 支付方式 悠悠:UU-UU 微信:UU-WX,WX-WX
  public pay_time: number = undefined; // 支付时间
  public send_time: number = undefined; // 发货时间
  public complete_time: number = undefined; // 完成时间
  public order_remarks: string = undefined; // 订单备注
  public refund_remarks: string = undefined; // 退款备注
  public logistics_order_id: number = undefined; // 物流单号
  public logistics_company: string = undefined; // 物流公司
  public logistics_fee: number = undefined; // 邮费 单位：分
  public logistics_fee_user: number = undefined; // 用户实付邮费 单位：分
  public refund_fee: number = undefined; // 退款金额（不能大于实付金额） 单位：分
  public refund_type: number = undefined; // 退款方式(1,'微信')
  public refund_order_id: string = undefined; // 退款交易号
  public driving_license_front: string = undefined; // 行驶证正本
  public driving_license_side: string = undefined; // 行驶证副本
  public insurance_policy: string = undefined; // 交强险保单
  public payment_certificate: string = undefined; // 车船税纳税凭证
  public car_image: string = undefined; // 行驶证正本背面
  public imageUrls: Array<any> = []; // 图片放大集合
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

export class EditParams extends EntityBase {
  // 发货参数
  public logistics_order_id: number = undefined; // 物流单号
  public logistics_company: string = undefined; // 物流公司
  public logistics_fee: number = undefined; // 邮费 单位：分
  // 驳回参数
  public reject_type: any = ''; // 驳回原因 (1,'没有驳回'),(2,'提交材料不清晰'),(3,'存在未处理违章'),(4,'与车主协商一致'),(5,'其他')
  public reject_notice: string = undefined; // 当reject_type为5时显示的驳回原因
  public reject_remarks: string = undefined; // 驳回备注
  // 退款参数
  public refund_fee: number = undefined; // 退款金额（不能大于实付金额） 单位：分
  public refund_remarks: string = undefined; // 退款备注

  public order_remarks: string = undefined; // 订单备注
}

export class ExemptionOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ExemptionOrderEntity> {
    const tempList: Array<ExemptionOrderEntity> = [];
    results.forEach(res => {
      tempList.push(ExemptionOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  private domain = environment.EXEMPTION_DOMAIN; // 免检域名

  constructor(private httpService: HttpService, private globalService: GlobalService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: OrderSearchParams): Observable<ExemptionOrderLinkResponse> {
    const httpUrl = `${this.domain}/exemption/orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new ExemptionOrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<ExemptionOrderLinkResponse>
   */
  public continueOrderListData(url: string): Observable<ExemptionOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ExemptionOrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param order_id 订单ID
   * @returns Observable<ExemptionOrderEntity>
   */
  public requestOrderDetailData(order_id: string): Observable<ExemptionOrderEntity> {
    const httpUrl = `${this.domain}/exemption/orders/${order_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => ExemptionOrderEntity.Create(res.body)));
  }

  /**
   * 修改免检订单详情
   * @param order_id 订单ID
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateOrderDetailData(params: EditParams, order_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/exemption/orders/${order_id}`;
    return this.httpService.put(httpUrl, params.json());
  }

  /**
   * 修改免检订单办理流程状态
   * @param order_id 订单ID
   * @param processing_flow 办理流程 2,3,7
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeProcessFlowStatus(processing_flow: number, order_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/exemption/orders/${order_id}`;
    const body = { processing_flow };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 打包下载
   * @param order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDownloadMaterial(order_id: string): any {
    const url = `${this.domain}/exemption/download/orders/${order_id}`;
    const xhr = new XMLHttpRequest();
    const that = this;
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';  // 返回类型blob
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    xhr.withCredentials = true;
    xhr.onload = function () {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        const blob = this.response;
        const reader = new FileReader();
        reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
        reader.onload = function (e: any) {
          // 转换完成，创建一个a标签用于下载
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = e.target.result;
          a.click();
          timer().subscribe(() => {
            document.body.removeChild(a);
          });
        };
      } else {
        if (this.status === 422) {
          that.globalService.promptBox.open('图片链接格式不正确，打包下载失败!', null, 2000, null, false);
        } else {
          const httpErrorProcess = HttpErrorEntity.Create({ status: this.status });
          that.globalService.httpErrorProcess(httpErrorProcess);
        }
      }
    };
    // 发送ajax请求
    xhr.send();
  }
}
