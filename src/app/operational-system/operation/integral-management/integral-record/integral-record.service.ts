import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityBase } from '../../../../../utils/z-entity';

export class SearchIntegralRecordParams extends EntityBase {
    public exchange_record_id: string = undefined; // 兑换id
    public commodity_name: string = undefined; // 商品名称
    public order_id: string = undefined; // 订单号
    public mobile: string = undefined; // 手机号
    public exchange_section: string = undefined; // 兑换时间
    public order_section: string = undefined; // 下单时间
    public ht_code: string = undefined; // 用户id
    public page_nun = 1;
    public page_size = 45;
}

class IntegralRecordEntity extends EntityBase {
    public exchange_record_id: string = undefined;
    public commodity_id: string = undefined; // 商品id
    public commodity_name: string = undefined; // 商品名称
    public commodity_images: Array<string> = undefined; // 商品图片列表
    public ht_code: string = undefined; // 用户ID
    public order_id: string = undefined; // 订单id
    public amount: number = undefined; // 购买数量
    public total_integral: number = undefined; // 消费总积分
    public total_amount: number = undefined; // 总金额(单位分)
    public mobile: string = undefined; // 手机号
    public order_time: number = undefined; // 下单时间
    public exchange_time: number = undefined; // 兑换时间
    public created_time: number = undefined;
    public updated_time: number = undefined;
}

@Injectable({
    providedIn: 'root'
})
export class IntegralRecordService {

    private domain = environment.INTEGRAL_DOMAIN;

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取用户积分列表
     * @param searchParams 条件筛选参数
     */
    public requestIntegralRecordList(searchParams: SearchIntegralRecordParams): Observable<IntegralRecordLinkResponse> {
        const httpUrl = `${this.domain}/exchange_records`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new IntegralRecordLinkResponse(res)));
    }

    /**
     * 分页获取用户积分列表
     * @param url linkurl
     */
    public continueIntegralRecordList(url: string): Observable<IntegralRecordLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new IntegralRecordLinkResponse(res)));
    }
}

export class IntegralRecordLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<IntegralRecordEntity> {
        const tempList: Array<IntegralRecordEntity> = [];
        results.forEach(res => {
            tempList.push(IntegralRecordEntity.Create(res));
        });
        return tempList;
    }
}
