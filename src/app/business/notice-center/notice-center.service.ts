import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../core/http.service';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../../environments/environment';

export class NoticeEntity extends EntityBase {

}

export class NoticeLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<NoticeEntity> {
    const tempList: Array<NoticeEntity> = [];
    results.forEach(res => {
      tempList.push(NoticeEntity.Create(res));
    });
    return tempList;
  }
}


@Injectable({
  providedIn: 'root'
})
export class NoticeCenterService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /**
   * 获取通知列表
   */
  public requestNoticeListData(): Observable<NoticeLinkResponse> {
    const httpUrl = `${this.domain}`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => new NoticeLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<NoticeLinkResponse>
   */
  public continueNoticeListData(url: string): Observable<NoticeLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new NoticeLinkResponse(res)));
  }
}
