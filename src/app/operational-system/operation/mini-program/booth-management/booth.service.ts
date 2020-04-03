import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// 展位列表筛选
export class SearchBoothParams extends EntityBase {
  // todo: 对应接口时需要变更
  public booth_name: string = undefined; // 展位名称
  public status: number = undefined; // 启停状态 1：开启 2：关闭 默认关闭
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 展位内容列表筛选
export class SearchBoothContentParams extends EntityBase {
  // todo: 对应接口时需要变更
  public title: string = undefined; // 所属展位
  public online_time: number = undefined; // 上线时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 点击统计
export class ClickStatisticsEntity extends EntityBase {
  public date: number = undefined; // 时间
  public click_num: number = undefined; // 点击数
  public click_person: number = undefined; // 点击人数
}

// 展位
export class BoothEntity extends EntityBase {
  public booth_id: string = undefined; // id
  public booth_name: string = undefined; // 展位名称
  public booth_key: string = undefined; // 关键字
  public booth_type: any = ''; // 展位类型 1:轮播图 2：焦点图
  public booth_num: number = undefined; // 展位个数
  public width: number = undefined; // 宽
  public height: number = undefined; // 高
  public status: number = undefined; // 启停状态 1：开启 2：关闭 默认关闭
  public formats: Array<any> = undefined; // 支持格式 1:PNG 2:JPG 3:GIF
  public link_types: Array<any> = undefined; // 链接类型 1: 视频链接 2: H5链接 3: 小程序原生页
  public remark: string = undefined; // 备注
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'click_stats') {
      return ClickStatisticsEntity;
    }
    return null;
  }
}

export class BoothLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BoothEntity> {
    const tempList: Array<BoothEntity> = [];
    results.forEach(res => {
      tempList.push(BoothEntity.Create(res));
    });
    return tempList;
  }
}

// 展位内容
export class BoothContentEntity extends EntityBase {
  public booth_content_id: string = undefined; // id
  public booth: BoothEntity = undefined; // 展位对象
  public title: string = undefined; // 标题
  public image: string = undefined; // 图片
  public link_type: number = undefined; // int 链接类型 1:视频链接 2:H5链接 3:小程序原生页
  public link_url: string = undefined; // 链接url
  public offline_type: number = undefined; // 下线时间类型 1：永不下线 2：定时下线 默认为1
  public offline_date: number = undefined; // float 下线时间 若offline_type=2,必填
  public remark: string = undefined; // 备注
  public order_num: number = undefined; // 展位序号
  public click_num: number = undefined; // 点击量
  public click_person_num: number = undefined; // 点击人数
  public day_average_click_num: number = undefined; // 日均点击量
  public status: number = undefined; // 展位序号
  public online_date: number = undefined; // 上线时间
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'booth') {
      return BoothEntity;
    }
    return null;
  }
}

export class BoothContentLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BoothContentEntity> {
    const tempList: Array<BoothContentEntity> = [];
    results.forEach(res => {
      tempList.push(BoothContentEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BoothService {
  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取Booth列表 */
  public requestBoothListData(searchParams: SearchBoothParams): Observable<BoothLinkResponse> {
    const httpUrl = `${this.domain}/admin/boothes`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new BoothLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求展位列表
   * @param string url linkUrl
   * @returns Observable<BoothLinkResponse>
   */
  public continueBoothListData(url: string): Observable<BoothLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new BoothLinkResponse(res)));
  }

  /**
   * 展位详情
   * @param booth_id ID
   * @returns Observable<BoothEntity>
   */
  public requestBoothDetail(booth_id: string): Observable<BoothEntity> {
    const httpUrl = `${this.domain}/admin/boothes/${booth_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return BoothEntity.Create(res.body);
    }));
  }

  /**
   * 添加Booth
   * @param  boothParams 添加参数
   */
  public requestAddBoothData(boothParams: BoothEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/boothes`;
    const params = boothParams.json();
    params.belong_to = params.belong_to === 0 ? null : params.belong_to;
    return this.httpService.post(httpUrl, params);
  }

  /**
   * 编辑Booth
   * @param booth_id ID
   * @param boothParams 编辑参数
   */
  public requestUpdateBoothData(booth_id: string, boothParams: BoothEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/boothes/${booth_id}`;
    return this.httpService.put(httpUrl, boothParams.json());
  }

  /** 获取Booth内容列表 */
  public requestBoothContentListData(searchParams: SearchBoothContentParams): Observable<BoothContentLinkResponse> {
    const httpUrl = `${this.domain}/admin/booth_contents`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new BoothContentLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求Booth内容列表
   * @param string url linkUrl
   * @returns Observable<BoothContentLinkResponse>
   */
  public continueBoothContentListData(url: string): Observable<BoothContentLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new BoothContentLinkResponse(res)));
  }
}
