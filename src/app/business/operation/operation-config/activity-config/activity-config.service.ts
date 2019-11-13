import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { FileUpdate } from '../../../../../utils/file-update';

// 领赠设置实体
export class RewardEntity extends EntityBase {
  public reward_record_id: string = undefined; // 奖品记录id(唯一主键)
  public reward_id: string = undefined; // 奖品-优惠券模板ID
  public reward_num: number = undefined; // 奖品库存
  public reward_probability: number = undefined; // 中奖概率
  public real_reward_probability: number = undefined; // 实际的中奖概率
  public related_reward_id = ''; // 赠品-优惠券模板ID
  public related_reward_type = 1; // 赠品类型 1:优惠券,2:优惠券组
  public is_deleted = false; // 逻辑删除
  public time: number = undefined; // 时间戳

  constructor(source?: RewardEntity) {
    super();
    if (source) {
      this.reward_record_id = source.reward_record_id ? source.reward_record_id : '';
      this.reward_id = source.reward_id;
      this.reward_num = source.reward_num;
      this.reward_probability = source.reward_probability;
      this.related_reward_id = source.related_reward_id;
      this.related_reward_type = source.related_reward_type;
      this.is_deleted = source.is_deleted;
    }
  }
}

/** 活动配置记录实体类 */
export class PromotionEntity extends EntityBase {
  public promotion_id: string = undefined; // 活动id
  public promotion_name: string = undefined; // 活动名称
  public promotion_type: number = undefined; // 活动类型,1:消费赠券,99:其他
  public image: string = undefined; // 活动图片
  public status: number = undefined; // 活动状态1:开启,2:停止
  public start_time: number = undefined; // 活动开始时间
  public end_time: number = undefined; // 活动结束时间
  public description: string = undefined; // 活动描述
  public rewards: Array<RewardEntity> = undefined; // 领赠设置奖品列表
  public is_deleted: boolean = undefined; // 逻辑删除
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public toEditJson(): any {
    const json = this.json();
    delete json.promotion_id;
    delete json.status;
    delete json.rewards;
    delete json.is_deleted;
    delete json.updated_time;
    delete json.created_time;
    return json;
  }

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'rewards') {
      return RewardEntity;
    }
    return null;
  }
}

export class PromotionLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PromotionEntity> {
    const tempList: Array<PromotionEntity> = [];
    results.forEach(res => {
      tempList.push(PromotionEntity.Create(res));
    });
    return tempList;
  }
}

// 活动配置条件筛选
export class SearchParams extends EntityBase {
  public promotion_name: string = undefined; // 活动名称
  public promotion_id: string = undefined; // 活动id
  public promotion_type: any = ''; // 活动类型,1:消费赠券,99:其他
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

@Injectable({
  providedIn: 'root'
})
export class ActivityConfigService {

  private domain = environment.OPERATION_SERVE; // 域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取活动配置品列表
   * @param searchParams 条件检索参数
   */
  public requestActivityConfigListData(searchParams: SearchParams): Observable<PromotionLinkResponse> {
    const httpUrl = `${this.domain}/promotions`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new PromotionLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求产品列表
   * @param string url linkUrl
   * @returns Observable<PromotionLinkResponse>
   */
  public continueActivityConfigListData(url: string): Observable<PromotionLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new PromotionLinkResponse(res)));
  }

  /**
   * 活动配置详情
   * @param string promotion_id id
   * @returns Observable<PromotionEntity>
   */
  public requestActivityConfigDetail(promotion_id: string): Observable<PromotionEntity> {
    return this.httpService.get(`${this.domain}/promotions/${promotion_id}`
    ).pipe(map(res => {
      return PromotionEntity.Create(res.body);
    }));
  }

  /**
   * 添加活动配置
   * @param  bannerParams 添加参数
   */
  public requestAddActivityConfigData(bannerParams: PromotionEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/promotions`;
    return this.httpService.post(httpUrl, bannerParams.toEditJson());
  }

  /**
   * 编辑活动配置
   * @param banner_id banner ID
   * @param bannerParams 编辑参数
   */
  public requestUpdateActivityConfigData(promotion_id: string, bannerParams: PromotionEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/promotions/${promotion_id}`;
    return this.httpService.put(httpUrl, bannerParams.toEditJson());
  }

  /**
   * 更改(增加,删除,修改)奖品列表
   * @param  bannerParams 添加参数
   */
  public requestUpdateRewardData(promotion_id: string, rewards: Array<RewardEntity>): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/promotions/${promotion_id}/rewards`;
    const body = {
      rewards
    };
    return this.httpService.post(httpUrl, body);
  }

  /**
   * 修改活动配置 上线状态
   * @param promotion_id ID
   * @param status number 启用状态(状态,1:开启,2:关闭)
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeStatus(promotion_id: string, status: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/promotions/${promotion_id}/status`;
    const body = {
      status
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 上传图片
   * @param file 文件
   * @returns any
   */
  public requestUploadPicture(file: any): Observable<any> {
    const url = environment.STORAGE_DOMAIN + `/storages/images`;
    return Observable.create(observer => {
      FileUpdate(file, url, (sourceUrl) => {
        observer.next({ sourceUrl });
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }
}
