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
  public browsing_duration: string = undefined; // 阅读人数
}

// 条件筛选
export class SearchParams extends EntityBase {
  public title: string = undefined; // 标题
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 模版节点内容
export class ElementItemEntity extends EntityBase {
  public type: number = undefined; // 数据类型  1:双图文链接  2：单图文链接  3：富文本
  public element_id: string = undefined; // 组件id
  public sort_num: number = undefined; // 序号

  // 图文链接
  public image_url: Array<any> = []; // 图片Url，用作图文链接组件回显
  public image: string = undefined; // 图片Url
  public belong_to: number = undefined; // 链接类型 1：H5 2:小程序原生页
  public link: number = undefined; // 链接地址

  // 富文本
  public rich: string = undefined; // 富文本

  public errMsg: string = undefined; // 错误信息
  public time: number = undefined; // 时间戳

  constructor(source?: ElementItemEntity) {
    super();
    if (source) {
      this.image = source.image;
      this.belong_to = source.belong_to;
      this.link = source.link;
      this.rich = source.rich;
    }
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.element_id;
    delete json.sort_num;
    delete json.image_url;
    delete json.errMsg;
    delete json.time;
    if (json.type === 3) {
      delete json.image;
      delete json.belong_to;
      delete json.link;
    } else {
      delete json.rich;
    }
    delete json.type;
    return json;
  }
}

// 模版内容
export class ContentEntity extends EntityBase {
  public content_type: number = undefined; // 数据类型  1:双图文链接  2：单图文链接  3：富文本
  public elements: Array<ElementItemEntity> = []; // 元素集合

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'elements') {
      return ElementItemEntity;
    }
    return null;
  }
}

/** 专题活动记录实体类 */
export class ThematicEntity extends EntityBase {
  public activity_id: string = undefined; // 活动id
  public title: string = undefined; // 标题
  public click_num: number = undefined; // 累计阅读量
  public click_person: number = undefined; // 累计阅读人数
  public browsing_duration: number = undefined; // 累计浏览时长
  public is_deleted: boolean = undefined; // 逻辑删除
  public click_stats: Array<ReadStatisticsEntity> = []; // 阅读量统计
  public content: Array<ContentEntity> = []; // 内容
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'click_stats') {
      return ReadStatisticsEntity;
    } else if (propertyName === 'content') {
      return ContentEntity;
    }
    return null;
  }
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

/** 专题活动新建、编辑 */
export class ThematicParams extends EntityBase {
  public title: string = undefined; // 标题
  public content: Array<ContentEntity> = []; // 内容

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'contents') {
      return ContentEntity;
    }
    return null;
  }
}

// 专题活动点击统计实体
export class ClickDataResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ReadStatisticsEntity> {
    const tempList: Array<ReadStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(ReadStatisticsEntity.Create(res));
    });
    return tempList;
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
    const httpUrl = `${this.domain}/admin/special_activities`;
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
    const httpUrl = `${this.domain}/admin/special_activities`;
    const body = {
      title: thematicParams.title,
      content: JSON.stringify(thematicParams.content),
    };
    return this.httpService.post(httpUrl, body);
  }

  /**
   * 编辑专题文章
   * @param activity_id 专题活动ID
   * @param thematicParams 编辑参数
   */
  public requestUpdateThematicData(activity_id: string, thematicParams: ThematicParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/special_activities/${activity_id}`;
    const body = {
      title: thematicParams.title,
      content: JSON.stringify(thematicParams.content),
    };
    return this.httpService.put(httpUrl, body);
  }

  /**
   * 专题活动统计详情
   * @param activity_id 专题活动ID
   * @returns Observable<ThematicEntity>
   */
  public requestThematicDetail(activity_id: string): Observable<ThematicEntity> {
    const httpUrl = `${this.domain}/admin/special_activities/${activity_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return ThematicEntity.Create(res.body);
    }));
  }

  /**
   * 删除专题活动
   * @param activity_id 专题活动ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteThematicData(activity_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/special_activities/${activity_id}`;
    return this.httpService.delete(httpUrl);
  }

  /** 获取专题活动点击统计列表
   * @param activity_id 专题活动ID
   * @returns Observable<ClickDataResponse>
   */
  public requestClickListData(activity_id: string): Observable<ClickDataResponse> {
    const httpUrl = `${this.domain}/admin/special_activities/${activity_id}/click_data`;
    return this.httpService.get(httpUrl).pipe(map(res => new ClickDataResponse(res)));
  }

  /**
   * 通过linkUrl继续请求专题活动点击统计列表
   * @param string url linkUrl
   * @returns Observable<ClickDataResponse>
   */
  public continueClickListData(url: string): Observable<ClickDataResponse> {
    return this.httpService.get(url).pipe(map(res => new ClickDataResponse(res)));
  }
}
