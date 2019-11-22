import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../../utils/z-entity';

// 通知
export class NotifyEntity extends EntityBase {
  public notify_id: string = undefined; 	// 	String	id
  public title: string = undefined; 	// 	标题
  public is_delete: boolean = undefined; 	// 	是否删除 true为删除
  public is_use: boolean = undefined; 	// 是否启用 true为启用
  public updated_time: number = undefined; // float	更新时间
  public created_time: number = undefined; // 	float	创建时间 / 下单时间
}

export class NotifyLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<NotifyEntity> {
    const tempList: Array<NotifyEntity> = [];
    results.forEach(res => {
      tempList.push(NotifyEntity.Create(res));
    });
    return tempList;
  }
}

export class SearchParams extends EntityBase {
  public notify_type = 1; // 通知类型 1，检车线
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}


@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /**通知管理列表
   * @param searchParams SearchParams 查询参数
   * @returns Observable<NotifyLinkResponse>
   */
  public requestNotifyList(searchParams: SearchParams): Observable<NotifyLinkResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(`${this.domain}/admin/notify`,
      params).pipe(map(res => new NotifyLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求获取通知管理列表
   * @param url string linkUrl
   * @returns Observable<NotifyLinkResponse>
   */
  public continueNotifyList(url: string): Observable<NotifyLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new NotifyLinkResponse(res)));
  }

  /**
   * 新建通知
   * @param title string 标题
   * @param notify_type number 通知类型 1，检车线
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddNoticeTitle(title: string, notify_type: number): Observable<HttpResponse<any>> {
    return this.httpService.post(`${this.domain}/admin/notify`, { title, notify_type }
    );
  }

  /**
   * 编辑标签
   * @param notify_id string 通知ID
   * @param title string 标题
   * @param notify_type number 通知类型 1，检车线
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateNoticeTitle(notify_id: string, title: string, notify_type: number): Observable<HttpResponse<any>> {
    return this.httpService.put(`${this.domain}/admin/notify/${notify_id}`, { title, notify_type }
    );
  }

  /**
   * 上下架通知
   * @param notify_id string 通知ID
   * @param is_use boolean 上下架开关
   * @returns Observable<HttpResponse<any>>
   */
  public requestNoticeStatus(notify_id: string, is_use: boolean): Observable<HttpResponse<any>> {
    return this.httpService.patch(`${this.domain}/admin/notify/${notify_id}`, { is_use }
    );
  }

  /**
   * 删除通知
   * @param notice_id string 通知ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteNoticeData(notice_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/notify/${notice_id}`;
    return this.httpService.delete(httpUrl);
  }

}
