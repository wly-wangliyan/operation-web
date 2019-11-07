import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class BannerEntity extends EntityBase {
  public banner_id: string = undefined; // id
  public title: string = undefined; // 标题
  public belong_to = 2; // 跳转类型 1:原生 2: h5
  public jump_link: string = undefined; // 跳转路径
  public banner_describe: string = undefined; // 描述
  public is_use: boolean = undefined; // 启停状态 true启用，false停用
  public offline_status: number = undefined; // 下线类型 1:永不下线 2: 定时下线
  public online_time: number = undefined; // 上线时间(时间戳)
  public offline_time: number = undefined; // 下线时间(时间戳)
  public image: string = undefined; // 图片
  public sort_num: number = undefined; 	// 	int	用于排序
  public click_num: number = undefined; // 点击量
  public click_person: number = undefined; 	// 	点击人数
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

export class SearchParams extends EntityBase {
  public title: string = undefined; // 标题
  public start_time: string = undefined; // 上架开始时间
  public end_time: string = undefined; // 上架结束时间
}

// 添加、编辑 banner
export class BannerParams extends EntityBase {
  public title: string = undefined; // 标题
  public belong_to: any = ''; // 跳转类型 1:原生 2: h5
  public jump_link: string = undefined; // 跳转路径
  public banner_describe: string = undefined; // 描述
  public offline_status: number = undefined; // 下线类型 1:永不下线 2: 定时下线
  public offline_time: number = undefined; // 下线时间(时间戳)
  public image: string = undefined; // 图片
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取Banner列表 */
  public requestBannerListData(searchParams: SearchParams): Observable<Array<BannerEntity>> {
    const httpUrl = `${this.domain}/admin/banner`;
    return this.httpService.get(httpUrl, searchParams.json()).pipe(map(res => {
      const tempList: Array<BannerEntity> = [];
      res.body.forEach(data => {
        tempList.push(BannerEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 更新序列
   * @param banner_id 参数
   * @param move_num 新的序号
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateSort(banner_id: string, move_num: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/banner/${banner_id}/sort`;
    const body = {
      move_num
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 添加Banner
   * @param  bannerParams 添加参数
   */
  public requestAddBannerData(bannerParams: BannerParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/banner`;
    return this.httpService.post(httpUrl, bannerParams.json());
  }

  /**
   * 编辑Banner
   * @param banner_id banner ID
   * @param bannerParams 编辑参数
   */
  public requestUpdateBannerData(banner_id: string, bannerParams: BannerParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/banner/${banner_id}`;
    return this.httpService.put(httpUrl, bannerParams.json());
  }

  /**
   * Banner详情
   * @param banner_id banner ID
   * @returns Observable<BannerEntity>
   */
  public requestBannerDetail(banner_id: string): Observable<BannerEntity> {
    const httpUrl = `${this.domain}/admin/banner/${banner_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return BannerEntity.Create(res.body);
    }));
  }

  /**
   * 修改banner 上线状态
   * @param banner_id banner ID
   * @param is_use boolean 启用状态(true启用，false停用)
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeUseStatus(banner_id: string, is_use: boolean): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/banner/${banner_id}`;
    const body = {
      is_use
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 删除banner
   * @param banner_id banner ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteBannerData(banner_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/banner/${banner_id}`;
    return this.httpService.delete(httpUrl);
  }
}
