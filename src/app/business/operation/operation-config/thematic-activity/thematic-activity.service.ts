import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

// 专题文章阅读统计
export class ReadStatisticsEntity extends EntityBase {
  public date: number = undefined; // 时间
  public click_num: string = undefined; // 阅读数
  public click_person: string = undefined; // 阅读人数
}

/** 专题活动记录实体类 */
export class ThematicEntity extends EntityBase {
  public thematic_id: string = undefined; // 活动id
  public title: string = undefined; // 标题
  public read_num: number = undefined; // 累计阅读量
  public read_person: number = undefined; // 累计阅读人数
  public read_time: number = undefined; // 累计浏览时长
  public is_deleted: boolean = undefined; // 逻辑删除
  public read_stats: Array<ReadStatisticsEntity> = []; // 阅读量统计
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'read_stats') {
      return ReadStatisticsEntity;
    }
    return null;
  }
}

// 条件筛选
export class SearchParams extends EntityBase {
  public title: string = undefined; // 标题
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class ThematicLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ThematicEntity> {
    const tempList: Array<ThematicEntity> = [];
    results.forEach(res => {
      tempList.push(ThematicEntity.Create(res));
    });
    return tempList;
  }
}

export class ContentEntity extends EntityBase {
  public type: number = undefined; // 数据类型
  public content: string = undefined; // 内容
}

/** 专题活动新建、编辑 */
export class ThematicParams extends EntityBase {
  public title: string = undefined; // 标题
  public contents: Array<ContentEntity> = undefined; // 阅读量统计

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'contents') {
      return ContentEntity;
    }
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ThematicActivityService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取专题活动列表列表
   * @param searchParams 条件筛选参数
   */
  public requestThematicListListData(searchParams: SearchParams): Observable<ThematicLinkResponse> {
    const httpUrl = `${this.domain}/admin/banner`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new ThematicLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求专题活动列表
   * @param string url linkUrl
   * @returns Observable<ThematicLinkResponse>
   */
  public continueThematicListData(url: string): Observable<ThematicLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ThematicLinkResponse(res)));
  }

  /**
   * 添加专题文章
   * @param  thematicParams 添加参数
   */
  public requestAddThematicData(thematicParams: ThematicParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/thematic`;
    return this.httpService.post(httpUrl, thematicParams.json());
  }

  /**
   * 编辑专题文章
   * @param thematic_id Thematic ID
   * @param thematicParams 编辑参数
   */
  public requestUpdateThematicData(thematic_id: string, thematicParams: ThematicParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/thematic/${thematic_id}`;
    return this.httpService.put(httpUrl, thematicParams.json());
  }

  /**
   * 专题活动统计详情
   * @param thematic_id Thematic ID
   * @returns Observable<ThematicEntity>
   */
  public requestThematicDetail(thematic_id: string): Observable<ThematicEntity> {
    const httpUrl = `${this.domain}/admin/thematic/${thematic_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return ThematicEntity.Create(res.body);
    }));
  }

  /**
   * 删除专题活动
   * @param thematic_id Thematic ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteThematicData(thematic_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/thematic/${thematic_id}`;
    return this.httpService.delete(httpUrl);
  }
}
