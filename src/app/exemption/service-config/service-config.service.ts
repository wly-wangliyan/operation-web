import { Injectable } from '@angular/core';
import { EntityBase } from '../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class ConfigEntity extends EntityBase {
  public is_use = false; // 服务状态
  public total_amount: number = undefined; // 原价 单位:元
  public real_amount: number = undefined; // 售价 单位:元
  public sale_amount: number = undefined; // 结算价
  public sold = 0; // 已售
  public remark = ''; // 图文详情
  public created_time: number = undefined;
  public updated_time: number = undefined;

  constructor(source?: ConfigEntity) {
    super();
    if (source) {
      this.is_use = source.is_use;
      this.total_amount = source.total_amount;
      this.real_amount = source.real_amount;
      this.sale_amount = source.real_amount;
      this.sold = source.sold >= 0 ? source.sold : 0;
      this.remark = source.remark;
    }
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.created_time;
    delete json.updated_time;
    return json;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServiceConfigService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /**
   * 服务配置详情
   * @param string config_id
   * @returns Observable<ConfigEntity>
   */
  public requestServiceConfigDetail(config_id: string): Observable<ConfigEntity> {
    return this.httpService.get(`${this.domain}/promotions/${config_id}`
    ).pipe(map(res => {
      return ConfigEntity.Create(res.body);
    }));
  }
}
