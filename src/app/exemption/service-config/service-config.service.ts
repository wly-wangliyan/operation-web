import { Injectable } from '@angular/core';
import { EntityBase } from '../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class ConfigEntity extends EntityBase {
  public is_use = false; // 服务状态
  public total_amount: number = undefined; // 原价 单位:分
  public real_amount: number = undefined; // 售价 单位:分
  public sale_amount: number = undefined; // 结算价 单位:分
  public logistics_fee: number = undefined; // 邮费 单位:分
  public sold = 0; // 已售
  public content = ''; // 图文详情
  public created_time: number = undefined;
  public updated_time: number = undefined;

  constructor(source?: ConfigEntity) {
    super();
    if (source) {
      this.is_use = source.is_use;
      this.total_amount = source.total_amount;
      this.real_amount = source.real_amount;
      this.sale_amount = source.real_amount;
      this.logistics_fee = source.logistics_fee;
      this.sold = source.sold >= 0 ? source.sold : 0;
      this.content = source.content;
    }
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.sold;
    delete json.created_time;
    delete json.updated_time;
    return json;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServiceConfigService {

  private domain = environment.EXEMPTION_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取服务配置详情
   * @param string exemption_id
   * @returns Observable<ConfigEntity>
   */
  public requestServiceConfigDetail(exemption_id: string): Observable<ConfigEntity> {
    const httpUrl = `${this.domain}/exemptions/${exemption_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => ConfigEntity.Create(res.body)));
  }

  /**
   * 修改服务配置详情
   * @param string exemption_id
   * @param params ConfigEntity
   * @returns Observable<ConfigEntity>
   */
  public requestUpdateServiceConfigDetail(exemption_id: string, params: ConfigEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/exemptions/${exemption_id}`;
    return this.httpService.put(httpUrl, params.toEditJson());
  }
}
