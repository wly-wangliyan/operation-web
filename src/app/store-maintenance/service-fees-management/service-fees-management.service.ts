import { Injectable } from '@angular/core';
import { EntityBase, noClone, noCreate, noJson } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators/map';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import {
    ProjectEntity,
} from '../accessory-library/accessory-library.service';
import { DateFormatHelper, TimeItem } from '../../../utils/date-format-helper';
import { GlobalService } from '../../core/global.service';

export class SearchWorkFeesParams extends EntityBase {
    public fee_type = 1; // integer	F	费用类型 1工时费 2救援费
    public service_fee_name: string = undefined; // string	F	服务费名称
    public project_id: string = undefined; // integer	F	状态 1: 开启 2: 关闭
    public original_amount: number = undefined; // float	T	原价 单位: 分
    public sale_amount: number = undefined; // float	T	销售单价 单位: 分
    public settlement_amount: number = undefined; // float	T	结算价 单位: 分
    public service_instruction = ''; // string T	服务说明
    public image: string = undefined; // string	F 图片
}

export class SearchParams extends EntityBase {
    public status = ''; // integer	F	状态 1: 开启 2: 关闭
    public fee_type: number = undefined; // integer	F	费用类型 1工时费 2救援费
    public service_fee_name = ''; // string	F	服务费名称
    public page_num = 1; // 页码
    public page_size = 45; // 每页条数
}

export class SearchFeeParams extends EntityBase {
    // public balance_initial_price: number = undefined; // Integer	救援费尾款原价 单位:分
    // public balance_current_price: number = undefined; // Integer	救援费尾款现价 单位:分
    // public prepay_initial_price: number = undefined; // Integer	救援费预付原价 单位:分
    // public prepay_current_price: number = undefined; // Integer	救援费预付现价 单位:分
    public rescue_cost_configure: Array<RescueCostConfigureEntity> = []; // 救援费配置
    public rescue_person_telephone: string = undefined; // 救援负责人电话

    public toEditJson(): any {
        const json = this.json();
        json.rescue_cost_configure.forEach(item => {
            item.balance_initial_price = Math.round(Number(item.balance_initial_price) * 100);
            item.balance_current_price = Math.round(Number(item.balance_current_price) * 100);
            item.prepay_initial_price = Math.round(Number(item.prepay_initial_price) * 100);
            item.prepay_current_price = Math.round(Number(item.prepay_current_price) * 100);
            item.start_time = DateFormatHelper.getSecondTimeSum(item.startTime, 'ss');
            item.end_time = DateFormatHelper.getSecondTimeSum(item.endTime, 'ss');
            delete item.timeStamp;
            delete item.startTime;
            delete item.endTime;
            delete item.balanceCurrentPriceErrors;
            delete item.prepayCurrentPriceErrors;
            delete item.balanceInitPriceErrors;
            delete item.prepayInitPriceErrors;
            delete item.timeErrors;
        });
        return json;
    }
}

// 服务费实体
export class ServiceFeeEntity extends EntityBase {
    public service_fee_id: string = undefined; // string	服务费ID 主键
    public service_fee_name: string = undefined; // string	服务费名称
    public fee_type: number = undefined; // Integer	费用类型 1工时费 2救援费
    public project: ProjectEntity = undefined; // ProjectEntity 项目
    public original_amount: number = undefined; // float	工时费原价 单位:分
    public sale_amount: number = undefined; // float	工时费销售单价 单位:分
    public settlement_amount: number = undefined; // 工时费结算价 单位:分
    public initial_price: number = undefined; // Integer	原价 单位:分
    public current_price: number = undefined; // Integer	现价 单位:分
    public balance_initial_price: number = undefined; // Integer	救援费尾款原价 单位:分
    public balance_current_price: number = undefined; // Integer	救援费尾款现价 单位:分
    public prepay_initial_price: number = undefined; // Integer	救援费预付原价 单位:分
    public prepay_current_price: number = undefined; // Integer	救援费预付现价 单位:分
    public status: boolean = undefined; // integer	状态 1:开启 2:关闭(默认)
    public service_instruction = ''; // string T	服务说明
    public image: string = undefined; // string	F 图片
    public rescue_cost_configure: Array<RescueCostConfigureEntity> = []; // 救援费配置
    public rescue_person_telephone: string = undefined; // 救援负责人电话
    public created_time: number = undefined; // 下单时间
    public updated_time: number = undefined; // 更新时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'project') {
            return ProjectEntity;
        }
        if (propertyName === 'rescue_cost_configure') {
            return RescueCostConfigureEntity;
        }
        return null;
    }
}

export class RescueCostConfigureEntity extends EntityBase {
    public balance_initial_price: any = undefined; // Integer	救援费尾款原价 单位:分
    public balance_current_price: any = undefined; // Integer	救援费尾款现价 单位:分
    public prepay_initial_price: any = undefined; // Integer	救援费预付原价 单位:分
    public prepay_current_price: any = undefined; // Integer	救援费预付现价 单位:分
    public startTime: TimeItem = new TimeItem(); // ui
    public endTime: TimeItem = new TimeItem('24'); // ui
    public start_time: number = undefined;
    public end_time: number = undefined;
    public timestamp: number = undefined;
    public balanceInitPriceErrors = '';
    public prepayInitPriceErrors = '';
    public balanceCurrentPriceErrors = '';
    public prepayCurrentPriceErrors = '';
    public timeErrors = '';

    constructor(source?: RescueCostConfigureEntity) {
        super();
        if (source) {
            this.balance_initial_price = this.getFeeData(source.balance_initial_price);
            this.balance_current_price = this.getFeeData(source.balance_current_price);
            this.prepay_initial_price = this.getFeeData(source.prepay_initial_price);
            this.prepay_current_price = this.getFeeData(source.prepay_current_price);
            this.startTime = DateFormatHelper.getMinuteOrTime(source.start_time, 'ss');
            this.endTime = DateFormatHelper.getMinuteOrTime(source.end_time, 'ss');
        }
        this.timestamp = GlobalService.Instance.timeStamp;
    }


    /**
     * 列表价格数据计算
     * 原价：尾款原价+预付原价
     * 现价：尾款现价+预付现价
     */

    /**
     * 原价
     */
    @noClone @noCreate @noJson
    public get initial_price(): number {
        return this.balance_initial_price && this.prepay_initial_price
            ? Number(this.balance_initial_price) + Number(this.prepay_initial_price)
            : this.balance_initial_price || this.prepay_initial_price || 0;
    }

    /**
     * 售价
     */
    @noClone @noCreate @noJson
    public get current_price(): number {
        return this.balance_current_price && this.prepay_current_price
            ? Number(this.balance_current_price) + Number(this.prepay_current_price)
            : this.balance_current_price || this.prepay_current_price || 0;
    }

    // 价钱数据处理
    private getFeeData(fee: number) {
        return (fee || fee === 0) ? (Number(fee) / 100).toFixed(2) : '';
    }
}

export class ServiceFeeLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ServiceFeeEntity> {
        const tempList: Array<ServiceFeeEntity> = [];
        results.forEach(res => {
            if (res.rescue_cost_configure && res.rescue_cost_configure.length) {
                res.rescue_cost_configure = res.rescue_cost_configure.map(item => new RescueCostConfigureEntity(item));
            }
            tempList.push(ServiceFeeEntity.Create(res));
        });
        return tempList;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ServiceFeesManagementService {

    private domain = environment.STORE_DOMAIN; // 保养域名

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取服务费列表
     * @param searchParams 条件检索参数
     * @returns Observable<ParkingLinkResponse>
     */
    public requestServiceFeeListData(searchParams: SearchParams): Observable<ServiceFeeLinkResponse> {
        const httpUrl = `${this.domain}/service_fees`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new ServiceFeeLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续请求服务费列表
     * @returns Observable<ParkingLinkResponse>
     * @param url
     */
    public continueServiceFeeListData(url: string): Observable<ServiceFeeLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new ServiceFeeLinkResponse(res)));
    }

    /**
     * 修改服务费状态
     * @param service_fee_id string    T    服务费ID
     * @param status number    T    状态 1:开启 2:关闭
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateStatusData(service_fee_id: string, status: number): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/service_fees/${service_fee_id}/status`;
        return this.httpService.patch(httpUrl, {status});
    }

    /**
     * 获取产品配置详情
     * @param service_fee_id string    T    服务费ID
     * @returns Observable<ServiceFeeEntity>
     */
    public requestServiceFeeDetailData(service_fee_id: string): Observable<ServiceFeeEntity> {
        const httpUrl = `${this.domain}/service_fees/${service_fee_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => ServiceFeeEntity.Create(res.body)));
    }

    /**
     * 新建保养服务费管理
     * @param params SearchWorkFeesParams 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestAddWorkFeeData(params: SearchWorkFeesParams): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/service_fees`;
        return this.httpService.post(httpUrl, {...params});
    }

    /**
     * 编辑保养服务费管理
     * @param service_fee_id string 服务费ID
     * @param params SearchWorkFeesParams 参数
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateWorkFeeData(params: SearchWorkFeesParams, service_fee_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/service_fees/${service_fee_id}`;
        return this.httpService.put(httpUrl, {...params});
    }

    /**
     * 编辑救援管理
     * @param service_fee_id string 服务费ID
     * @param params SearchFeeParams 参数
     * @param fee_type number 救援类型
     * @returns Observable<HttpResponse<any>>
     */
    public requestUpdateFeeData(params: SearchFeeParams, service_fee_id: string, fee_type: number): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/service_fees/${service_fee_id}`;
        return this.httpService.put(httpUrl, {...params.toEditJson(), fee_type});
    }
}

