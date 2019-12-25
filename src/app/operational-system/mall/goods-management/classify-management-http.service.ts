import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';

// 分类实体
export class SortEntity extends EntityBase {
  public sort_id: string = undefined; // id
  public sort_name: string = undefined; // 名称
}

export class SortLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<SortEntity> {
    const tempList: Array<SortEntity> = [];
    results.forEach(res => {
      tempList.push(SortEntity.Create(res));
    });
    return tempList;
  }
}

// 分类列表条件筛选
export class SearchSortParams extends EntityBase {
  public page_size = 45; // 每页数量 默认15
  public page_num = 1; // 第几页 默认1
}

@Injectable({
  providedIn: 'root'
})
export class ClassifyManagementHttpService {

  private domain = environment.MALL_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取分类列表
   * @param searchParams SearchSortParams 条件检索参数
   * @returns Observable<SortLinkResponse>
   */
  public requestClassifyListData(searchParams: SearchSortParams): Observable<SortLinkResponse> {
    const httpUrl = `${this.domain}/sorts`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new SortLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求分类列表
   * @param string url linkUrl
   * @returns Observable<SortLinkResponse>
   */
  public continueClassifyListData(url: string): Observable<SortLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new SortLinkResponse(res)));
  }

  /**
   * 获取全部分类列表
   * @returns Observable<SortLinkResponse>
   */
  public requestClassifyAllListData(): Observable<SortLinkResponse> {
    const httpUrl = `${this.domain}/sorts/all`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => new SortLinkResponse(res)));
  }

  /**
   * 删除分类
   * @param sort_id string 分类id
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteClassifyData(sort_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/sorts/${sort_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 新建分类
   * @param sort_name string id
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddClassifyName(sort_name: string): Observable<HttpResponse<any>> {
    return this.httpService.post(`${this.domain}/sorts`, { sort_name }
    );
  }

  /**
   * 编辑分类
   * @param sort_id string 分类id
   * @param sort_name string 产品id
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateClassifyName(sort_id: string, sort_name: string): Observable<HttpResponse<any>> {
    return this.httpService.put(`${this.domain}/sorts/${sort_id}`, { sort_name }
    );
  }

}
