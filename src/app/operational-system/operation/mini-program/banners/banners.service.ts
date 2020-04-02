import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export class SearchBannerParams extends EntityBase {
  // todo: 对应接口时需要变更
  public banner_name: string = undefined; // 所属展位
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// banner点击统计
export class ClickStatisticsEntity extends EntityBase {
  public date: number = undefined; // 时间
  public click_num: number = undefined; // 点击数
  public click_person: number = undefined; // 点击人数
}

// banner
export class BannerEntity extends EntityBase {
  public banner_id: string = undefined; // id
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'click_stats') {
      return ClickStatisticsEntity;
    }
    return null;
  }
}

export class BannerLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BannerEntity> {
    const tempList: Array<BannerEntity> = [];
    results.forEach(res => {
      tempList.push(BannerEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BannersService {
  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取Banner列表 */
  public requestBannerListData(searchParams: SearchBannerParams): Observable<BannerLinkResponse> {
    const httpUrl = `${this.domain}/admin/banner`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new BannerLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求Banner列表
   * @param string url linkUrl
   * @returns Observable<BannerLinkResponse>
   */
  public continueBannerListData(url: string): Observable<BannerLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new BannerLinkResponse(res)));
  }
}
