import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { EntityBase } from '../../../../../utils/z-entity';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SearchParamsEntity, TemplateManagementEntity } from '../template-management/template-management.service';

export enum UserCategory {
    all = '1',
    appoint = '2',
    directional = '3',
}

export enum LandingPageType {
    H5 = 1,
    appletNative = 2,
}

export enum SendType {
    pushNow = 1,
    timingPush = 2,
    periodicPush = 3,
}

export enum DateUnlimited {
    unlimited = 1,
    limited = 2,
}

export enum TemplatePushStatus {
    open = 1,
    close = 2,
}

export class TemplatePushManagementEntity extends EntityBase {
    public template_message_id: string = undefined; // 主键id
    public title: string = undefined; // 标签
    public status: number = undefined; // 状态 1开启 2关闭
    public wx_template_id: string = undefined; // 微信模板id
    public content: TemplatePushManagementContentEntity = new TemplatePushManagementContentEntity(); // 内容{'start': '缴费成功!', 'content': 【{'key': 'parking_name', 'value': '昂立停车场'},{'key':'parking_spot', 'value': '012泊位'}】, 'end': '欢迎再次使用'}
    public user_category: UserCategory = UserCategory.all; // 1全部 2指定 3定向
    public uu_codes: string = undefined; // 用户
    public landing_page_type: LandingPageType = LandingPageType.H5; // 落地页类型 1H5 2小程序原生
    public landing_page: string = undefined; // 落地页
    public send_type: SendType = SendType.pushNow; // 推送时间类型 1立即推送 2定时推送 3周期推送
    public set_time: any = undefined;
    public start_date: any = undefined; // 开始时间
    public end_date: any = undefined; // 结束时间
    public date_unlimited: DateUnlimited = DateUnlimited.limited; // 1不限日期 2限制日期 默认2
    public weekday: string = undefined; // "1,2,3,4", "6,7"
    public send_time: number = undefined; // 480 当天分钟数
    public remark: number = undefined; // 480 当天分钟数
    public off_time: string = undefined; // 下线时间
    public created_time: string = undefined; // 创建时间
    public updated_time: string = undefined; // 更新时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'content') {
            return TemplatePushManagementContentEntity;
        }
        return null;
    }
}

export class TemplatePushManagementContentEntity extends EntityBase {
    public start: string = undefined;
    public content: Array<TemplatePushManagementContentChildEntity> = [];
    public end: string = undefined;

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'content') {
            return TemplatePushManagementContentChildEntity;
        }
        return null;
    }
}

export class TemplatePushManagementContentChildEntity extends EntityBase {
    public key: string = undefined;
    public value: string = undefined;
    public timestamp: Date = new Date(); // ui
}

export class SendRecordEntity extends EntityBase {
    public send_record_id: string = undefined;
    public template_message_id: string = undefined;
    public total_number: number = undefined; // 	总人数
    public success_number: number = undefined; // 	发送成功人数
    public fail_number: number = undefined; // 	发送失败人数
    public success_ids: number = undefined; // 		成功id
    public fail_ids: number = undefined; // 	失败id
    public send_time: string = undefined; // 		发送时间
    public created_time: string = undefined; // 创建时间
    public updated_time: string = undefined; // 更新时间
}

@Injectable({
    providedIn: 'root'
})

export class TemplatePushManagementService {

    private domain = environment.OPERATION_SERVE;

    constructor(private httpService: HttpService) {
    }

    /** 获取模板推送推送列表 */
    public requestTemplatePushListData(searchParams: SearchParamsEntity): Observable<TemplatePushManagementLinkResponse> {
        const httpUrl = `${this.domain}/wx_template_messages`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => new TemplatePushManagementLinkResponse(res)));
    }

    /**
     * 通过linkUrl继续请求模板推送列表
     * @returns Observable<PushLinkResponse>
     * @param url
     */
    public continueTemplatePushListData(url: string): Observable<TemplatePushManagementLinkResponse> {
        return this.httpService.get(url).pipe(map(res => new TemplatePushManagementLinkResponse(res)));
    }

    /**
     * 添加|编辑模板推送
     * @param templateCreate
     * @param template_message_id
     */
    public requestAddTemplatePushData(templateCreate: TemplatePushManagementEntity, template_message_id: string): Observable<HttpResponse<any>> {
        const httpUrl = template_message_id ? `${this.domain}/wx_template_messages/${template_message_id}` : `${this.domain}/wx_template_messages`;
        return template_message_id ? this.httpService.put(httpUrl, templateCreate.json()) : this.httpService.post(httpUrl, templateCreate.json());
    }

    /**
     * 删除模板推送
     * @param template_message_id
     */
    public requestDeleteTemplatePushData(template_message_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/wx_template_messages/${template_message_id}`;
        return this.httpService.delete(httpUrl);
    }

    /**
     * 启停模板推送
     * @param template_message_id
     */
    public requestStatusTemplatePushData(template_message_id: string, status: TemplatePushStatus): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/wx_template_messages/${template_message_id}/status`;
        const params = {status};
        return this.httpService.patch(httpUrl, params);
    }


    /**
     * 模板推送详情
     * @param template_message_id
     */
    public requestTemplatePushDetailData(template_message_id: string): Observable<TemplatePushManagementEntity> {
        const httpUrl = `${this.domain}/wx_template_messages/${template_message_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => {
            return TemplatePushManagementEntity.Create(res.body);
        }));
    }

    /**
     * 模板推送记录
     * @param template_message_id
     */
    public requestTemplatePushRecordListData(template_message_id: string): Observable<Array<SendRecordEntity>> {
        const httpUrl = `${this.domain}/send_records`;
        const params = {template_message_id};
        return this.httpService.get(httpUrl, params).pipe(map(res => {
            const tempList: Array<SendRecordEntity> = [];
            res.body.forEach(res => {
                tempList.push(SendRecordEntity.Create(res));
            });
            return tempList;
        }));
    }
}


export class TemplatePushManagementLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<TemplatePushManagementEntity> {
        const tempList: Array<TemplatePushManagementEntity> = [];
        results.forEach(res => {
            tempList.push(TemplatePushManagementEntity.Create(res));
        });
        return tempList;
    }
}
