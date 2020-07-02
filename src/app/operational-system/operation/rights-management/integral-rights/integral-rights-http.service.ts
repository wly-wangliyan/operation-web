import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class CommonRuleEntity extends EntityBase {

}

@Injectable({
  providedIn: 'root'
})
export class IntegralRightsHttpService {
  private domain = environment.INTEGRAL_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取通用积分明细
   */
  public requestCommonIntegralRuleDetail(): Observable<any> {
    const httpUrl = `${this.domain}/`;
    return this.httpService.get(httpUrl).pipe(map(res => CommonRuleEntity.Create(res.body)));
  }
}
