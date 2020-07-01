import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class SearchStatisticParams extends EntityBase {
  public start_time: any = undefined; // 开始时间
  public end_time: any = undefined; // 结束时间
  public page_size = 45;
  public page_num = 1;
}

export class StatisticEntity extends EntityBase {
  public click_num: number = undefined; // 开始时间
  public click_person: number = undefined; // 结束时间
  public date: number = undefined;
}

export class StatisticLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<StatisticEntity> {
    const tempList: Array<StatisticEntity> = [];
    results.forEach(res => {
      tempList.push(StatisticEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class IntegralMallHttpService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  // 获取统计信息
  public requestStatisticData(commodity_id: string, searchParams: SearchStatisticParams): Observable<StatisticLinkResponse> {
    const httpUrl = `${this.domain}/`;
    return this.httpService.get(httpUrl, searchParams.json()).pipe(map(res => new StatisticLinkResponse(res)));
  }

  // 分页获取
  public requestContinueStatisticData(url: string): Observable<StatisticLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new StatisticLinkResponse(res)));
  }
}
