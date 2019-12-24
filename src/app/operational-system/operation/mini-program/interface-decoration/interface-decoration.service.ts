import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { HttpResponse } from '@angular/common/http';

export class SearchParams extends EntityBase {
  public category = ''; // Integer	T	类别	1: 发现　2:　首页
  public page_type: number = undefined; // Integer	T	页面类型	1:　草稿　2: 发布记录
  public release_status = ''; // 	Integer	F	发布状态	0: 未发布　1: 生效　2: 失效
  // public page_num = 1; // 页码
  // public page_size = 45; // 每页条数
}

export class ContentEntity extends EntityBase {
  public title: string = undefined; // String 标题
  public name: string = undefined; // String 广告名称
  public image: string = undefined; // String
  public url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public url: string = undefined; // 跳转链接
  public left_title: string = undefined; // String 标题
  public left_image: string = undefined; // String
  public left_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public left_url: string = undefined; // 跳转链接
  public right_title: string = undefined; // String 标题
  public right_image: string = undefined; // String
  public right_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_url: string = undefined; // 跳转链接
  public right_top_title: string = undefined; // String 标题
  public right_top_image: string = undefined; // String
  public right_top_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_top_url: string = undefined; // 跳转链接
  public right_bottom_title: string = undefined; // String 标题
  public right_bottom_image: string = undefined; // String
  public right_bottom_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_bottom_url: string = undefined; // 跳转链接
}

export class ProductEntity extends EntityBase {
  public product_id: string = undefined; // String	产品id
  public product_type: string = undefined; // 1:指定商品　2:指定票务产品
}

export class TemplateContentEntity extends EntityBase {
  public title: string = undefined; // String 标题
  public count = 3; // 单行数量 取值范围　3, 4, 5
  public contents: ContentEntity = undefined;
  public products: ProductEntity = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'contents') {
      return ContentEntity;
    }
    if (propertyName === 'products') {
      return ProductEntity;
    }
    return null;
  }
}

export class TemplateEntity extends EntityBase {
  public template_id: string = undefined; // String	模板id
  public template_type: string = undefined; // String 模板类型 1: ICON魔方 2:单行轮播广告 3:左右布局图文一 4:左右布局图文二　5:单行左右滑动 6:商品推荐
  public template_content = undefined; // 模板内容
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'template_content') {
      return TemplateContentEntity;
    }
    return null;
  }
}

export class PageEntity extends EntityBase {
  public page_id: string = undefined; // String	页面id
  public page_name: string = undefined; // String	页面名称
  public category: number = undefined; // Integer	类别	1: 发现　2:　首页
  public release_status: number = undefined; // Integer	发布状态	0: 未发布　1: 生效　2: 失效
  public page_type: number = undefined; // Integer	页面类型	1:　草稿　2: 发布记录
  public page_content: string = undefined; // String	页面内容	模板id集合　例：　“sdfljksjdkfj,sdfsdfsdfsdf,sdfsdfsdfsdfsdf”
  public templates: TemplateEntity = undefined; // 页面模板内容
  public deleted_time: number = undefined; // Float	删除时间
  public release_time: number = undefined; // Float	发布时间
  public is_deleted: boolean = undefined; // 	bool	逻辑删除
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'templates') {
      return TemplateEntity;
    }
    return null;
  }
}

export class PageLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PageEntity> {
    const tempList: Array<PageEntity> = [];
    results.forEach(res => {
      tempList.push(PageEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class InterfaceDecorationService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取发布记录列表 */
  public requestPageListData(searchParams: SearchParams): Observable<PageLinkResponse> {
    const httpUrl = `${this.domain}/pages`;
    return this.httpService.get(httpUrl, searchParams.json())
        .pipe(map(res => new PageLinkResponse(res)));
  }

  /**
   * 获取发布记录详情
   * @param page_id 推送 ID
   * @returns Observable<PageEntity>
   */
  public requestPageDetail(page_id: string): Observable<PageEntity> {
    const httpUrl = `${this.domain}/pages/${page_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return PageEntity.Create(res.body);
    }));
  }

  /**
   * 删除发布记录
   * @param page_id 发布记录ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeletePageData(page_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/pages/${page_id}`;
    return this.httpService.delete(httpUrl);
  }
}
