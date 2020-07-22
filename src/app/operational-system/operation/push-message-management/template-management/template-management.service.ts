import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { PushEntity } from '../push-management/push-management.service';

export class SearchParamsEntity extends EntityBase {
    public title: string = undefined; // 模板标题
    public section: string = undefined; // 创建时间 '15012344,15013454'
}

export class TemplateManagementEntity extends EntityBase {
    public wx_template_id: string = undefined; // 主键id
    public weixin_template_id: string = undefined; // 微信模板id
    public title: string = undefined; // 模板标题
    public content: Array<TemplateManagementContentEntity> = []; // 内容 [{'name': '停车场'},{'name': '停车位'}]
    public is_deleted: string = undefined; // 是否删除
    public created_time: string = undefined; // 创建时间
    public updated_time: string = undefined; // 更新时间

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'content') {
            return TemplateManagementContentEntity;
        }
        return null;
    }
}

export class TemplateManagementContentEntity extends EntityBase {
    public name: string = undefined; // 名称
    public timestamp: Date = new Date(); // ui
}

@Injectable({
    providedIn: 'root'
})
export class TemplateManagementService {

    private domain = environment.OPERATION_SERVE;

    constructor(private httpService: HttpService) {
    }

    /** 获取模板列表 */
    public requestTemplateListData(searchParams: SearchParamsEntity): Observable<Array<TemplateManagementEntity>> {
        const httpUrl = `${this.domain}/wx_templates`;
        return this.httpService.get(httpUrl, searchParams.json())
            .pipe(map(res => {
                const tempList: Array<TemplateManagementEntity> = [];
                res.body.forEach(res => {
                    tempList.push(TemplateManagementEntity.Create(res));
                });
                return tempList;
            }));
    }

    /**
     * 添加模板
     * @param templateCreate
     */
    public requestAddTemplateData(templateCreate: TemplateManagementEntity): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/wx_templates`;
        return this.httpService.post(httpUrl, templateCreate.json());
    }

    /**
     * 删除模板
     * @param wx_template_id
     */
    public requestDeleteTemplateData(wx_template_id: string): Observable<HttpResponse<any>> {
        const httpUrl = `${this.domain}/wx_templates/${wx_template_id}`;
        return this.httpService.delete(httpUrl);
    }


    /**
     * 模板详情
     * @param wx_template_id
     */
    public requestTemplateDetailData(wx_template_id: string): Observable<HttpResponse<TemplateManagementEntity>> {
        const httpUrl = `${this.domain}/wx_templates/${wx_template_id}`;
        return this.httpService.get(httpUrl).pipe(map(res => {
            return TemplateManagementEntity.Create(res.body);
        }));
    }
}


export class TemplateManagementLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<TemplateManagementEntity> {
        const tempList: Array<TemplateManagementEntity> = [];
        results.forEach(res => {
            tempList.push(TemplateManagementEntity.Create(res));
        });
        return tempList;
    }
}
