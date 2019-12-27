import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { HttpResponse } from '@angular/common/http';
import { CommodityEntity } from '../../../mall/goods-management/goods-management-http.service';

export class SearchParams extends EntityBase {
  public category = 1; // Integer	T	类别	1: 发现　2:　首页
  public page_type: number = undefined; // Integer	T	页面类型	1:　草稿　2: 发布记录
  public release_status = ''; // 	Integer	F	发布状态	0: 未发布　1: 生效　2: 失效
  // public page_num = 1; // 页码
  // public page_size = 45; // 每页条数
}

export class ContentEntity extends EntityBase {
  public title = ''; // String 标题
  public name = ''; // String 广告名称
  public image = undefined; // String
  public url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public url = ''; // 跳转链接
  public left_title = ''; // String 标题
  public left_image = undefined; // String
  public left_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public left_url = ''; // 跳转链接
  public right_title = ''; // String 标题
  public right_image = undefined; // String
  public right_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_url = ''; // 跳转链接
  public errMsg = '';
  public time = new Date().getTime();
}

export class ProductEntity extends EntityBase {
  public product_id: string = undefined; // String	产品id
  public product_type = ''; // 1:指定商品　2:指定票务产品
  public errMsg = '';
  public time = new Date().getTime();
}

export class TemplateContentEntity extends EntityBase {
  public title: string = undefined; // String 标题
  public count = 3; // 单行数量 取值范围　3, 4, 5
  public contents: Array<ContentEntity> = [];
  public products: Array<ProductEntity> = [];
  public left_title = ''; // String 标题
  public left_image = undefined; // String
  public left_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public left_url = ''; // 跳转链接
  public right_top_title = ''; // String 标题
  public right_top_image = undefined; // String
  public right_top_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_top_url = ''; // 跳转链接
  public right_bottom_title = ''; // String 标题
  public right_bottom_image = undefined; // String
  public right_bottom_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_bottom_url = ''; // 跳转链接
  public ticketProducts = [];
  public mallProducts = [];

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




/*export class IconMagicContentEntity extends EntityBase {
  public title = ''; // String 标题
  public image = undefined; // String
  public url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public url = ''; // 跳转链接
}

export class IconMagicEntity extends EntityBase {
  public count = 3;
  public contents: Array<IconMagicContentEntity> = [];

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'contents') {
      return IconMagicContentEntity;
    }
    return null;
  }
}

export class SingleRowBroadcastContentEntity extends EntityBase {
  public name = ''; // String 广告名称
  public image = undefined; // String
  public url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public url = ''; // 跳转链接
}

export class SingleRowBroadcastEntity extends EntityBase {
  public contents: Array<SingleRowBroadcastContentEntity> = [];

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'contents') {
      return SingleRowBroadcastContentEntity;
    }
    return null;
  }
}

export class LeftAndRightLayout1ContentEntity extends EntityBase {
  public left_title = ''; // String 标题
  public left_image = undefined; // String
  public left_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public left_url = ''; // 跳转链接
  public right_title = ''; // String 标题
  public right_image = undefined; // String
  public right_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_url = ''; // 跳转链接
  public errMsg = '';
  public time = new Date().getTime();
}

export class LeftAndRightLayout1Entity extends EntityBase {
  public contents: Array<LeftAndRightLayout1ContentEntity> = [];

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'contents') {
      return LeftAndRightLayout1ContentEntity;
    }
    return null;
  }
}

export class LeftAndRightLayout2ContentEntity extends EntityBase {
  public left_title = ''; // String 标题
  public left_image = undefined; // String
  public left_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public left_url = ''; // 跳转链接
  public right_top_title = ''; // String 标题
  public right_top_image = undefined; // String
  public right_top_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_top_url = ''; // 跳转链接
  public right_bottom_title = ''; // String 标题
  public right_bottom_image = undefined; // String
  public right_bottom_url_type = ''; // 跳转类型　1:指定商品　2:指定商品类别　3:指定票务产品　4:指定票务产品标签　5:小程序原生页　6:H5链接
  public right_bottom_url = ''; // 跳转链接
}

export class LeftAndRightLayout2Entity extends EntityBase {
  public contents: Array<LeftAndRightLayout2ContentEntity> = [];

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'contents') {
      return LeftAndRightLayout2ContentEntity;
    }
    return null;
  }
}

export class SingleLineScrollingProductEntity extends EntityBase {
  public product_id: string = undefined; // String	产品id
  public product_type = ''; // 1:指定商品　2:指定票务产品
  public errMsg = '';
  public time = new Date().getTime();
}

export class SingleLineScrollingEntity extends EntityBase {
  public title: string = undefined;
  public products: Array<SingleLineScrollingProductEntity> = [];
  public ticketProducts = [];
  public mallProducts = [];

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'products') {
      return SingleLineScrollingProductEntity;
    }
    return null;
  }
}*/

export class TemplateEntity extends EntityBase {
  public template_id: string = undefined; // String	模板id
  public template_type: number = undefined; // String 模板类型 1: ICON魔方 2:单行轮播广告 3:左右布局图文一 4:左右布局图文二　5:单行左右滑动 6:商品推荐
  public template_content: TemplateContentEntity = new TemplateContentEntity; // 模板内容
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'template_content') {
      return TemplateContentEntity;
    }
    return null;
  }

  /*public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'template_content') {
      switch (Number(this.template_type)) {
        case 1:
          return IconMagicEntity;
          break;
        case 2:
          return SingleRowBroadcastEntity;
          break;
        case 3:
          return LeftAndRightLayout1Entity;
          break;
        case 4:
          return LeftAndRightLayout2Entity;
          break;
        case 5:
          return SingleLineScrollingEntity;
          break;
        case 6:
        default:
          return SingleLineScrollingEntity;
          break;
      }
    }
    return null;
  }*/
}

export class PageEntity extends EntityBase {
  public page_id: string = undefined; // String	页面id
  public page_name: string = undefined; // String	页面名称
  public category: number = undefined; // Integer	类别	1: 发现　2:　首页
  public release_status: number = undefined; // Integer	发布状态	0: 未发布　1: 生效　2: 失效
  public page_type: number = undefined; // Integer	页面类型	1:　草稿　2: 发布记录
  public page_content: string = undefined; // String	页面内容	模板id集合　例：　“sdfljksjdkfj,sdfsdfsdfsdf,sdfsdfsdfsdfsdf”
  public templates: Array<TemplateEntity> = undefined; // 页面模板内容
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

  private mall_domain = environment.MALL_DOMAIN;

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
   * 草稿/发布记录删除
   * @param page_id 发布记录ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeletePageData(page_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/pages/${page_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 创建草稿
   * @param  pageParams 添加参数
   */
  public requestCreatePageData(pageParams: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/pages`;
    return this.httpService.post(httpUrl, pageParams);
  }

  /**
   * 草稿更新
   * @param  templateParams 添加参数
   * @param page_id 草稿id
   */
  public requestUpdatePageData(templateParams: any, page_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/pages/${page_id}`;
    return this.httpService.put(httpUrl, templateParams);
  }

  /**
   * 草稿发布/发布记录重新发布
   * @param page_id 草稿id
   */
  public requestPageReleaseData(page_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/pages/${page_id}/release`;
    return this.httpService.put(httpUrl);
  }

  /**
   * 添加模板信息
   * @param  templateParams 添加参数
   */
  public requestCreateTemplateData(templateParams: TemplateEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/templates`;
    return this.httpService.post(httpUrl, templateParams.json());
  }

  /**
   * 获取模板详情
   * @param template_id 模板 ID
   * @returns Observable<TemplateEntity>
   */
  public requestTemplatesDetail(template_id: string): Observable<TemplateEntity> {
    const httpUrl = `${this.domain}/templates/${template_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return TemplateEntity.Create(res.body);
    }));
  }

  /**
   * 模板更新
   * @param  templateParams 添加参数
   * @param page_id 草稿id
   */
  public requestUpdateTemplateData(params: any, template_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/templates/${template_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 模板拷贝
   * @param  templateParams 添加参数
   */
  public requestCopyPageData(pageParams: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/pages/copy`;
    return this.httpService.post(httpUrl, pageParams);
  }

  /**
   * 模板删除
   * @param template_id 模板ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteTemplateData(template_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/templates/${template_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 根据商品id获取商品列表
   * @param template_id 模板 ID
   * @returns Observable<TemplateEntity>
   */
  public requestProductList(params: any): Observable<Array<CommodityEntity>> {
    const httpUrl = `${this.mall_domain}/admin/commodities/batch`;
    return this.httpService.get(httpUrl, params).pipe(map(res => res.body));
  }
}
