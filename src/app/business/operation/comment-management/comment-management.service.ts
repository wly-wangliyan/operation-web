import { EventEmitter, Injectable } from '@angular/core';
import {HttpService, LinkResponse} from '../../../core/http.service';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {HttpResponse} from '@angular/common/http';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';

export class FirstPageIconEntity extends EntityBase {
  public menu_id: string = undefined ; 	// 	string 	相机主键
  public title: string = undefined; 	// string	标题
  public application: string = undefined; 	// 	string	应用id
  public system: number = undefined; 	// 	int	系统(1,'IOS'),(2,'Android')
  public belong_to = 2; 	// 	int	从属(1,'原生'),(2,'H5')
  public jump_link: string = undefined; 	// 	string	跳转链接
  public corner: string = undefined; 	// 	string	角标应用内容
  public menu_describe: string = undefined; 	// 	string 	应用描述
  public sort_num: number = undefined; 	// 	int	用于排序
  public icon: string = undefined; 	// 	string	图片 一个url
  public background_color: string = undefined; 	// string 背景颜色
  public version = ''; 	// 	string	当前版本
  public created_time: number = undefined; 	// float 	创建时间
  public updated_time: number = undefined; 	// float 	修改时间
  public is_display = undefined;  // 	bool	是否隐藏 false为不隐藏
  public corner_display = 'true';  // 	bool	角标是否隐藏 false为不隐藏
  public is_delete = undefined;  // 	bool	是否删除 false为不删除
}

export class AppEntity extends EntityBase {
  public application_id: string = undefined ; 	// 	string 应用id
  public application_name: string = undefined ; 	// 	string 应用id
  public system: number = undefined ; 	// 	int 系统    (1,'IOS'),(2,'Android')
  public version: string = undefined ; 	// 	string 最新版本号
  public bundle_id: string = undefined ; 	// 	string bundle_id
}

export class VersionEntity extends EntityBase {
  public version_id: string = undefined ; 	// 	string 版本id
  public version: string = undefined ; 	// 	string 版本
  public is_display: string = undefined ; 	// 	bool  是否下线
  public created_time: number = undefined ; 	// 	string 创建时间
}

export class SearchCommentParams extends EntityBase {
  public status: number = undefined; 	// 	int 	F 	1:待审核,2:已通过,3:被驳回
  public work_id: string = undefined ; 	// 	String 	T 	评论业务id
  public object_name: string = undefined ; 	// 	string 	F 	object_name
  public is_top: boolean = undefined ; 	// 	bool 	F 	是否置顶
  public section: string = undefined ; 	// 	string 	F 	操作时间戳区间(小,大) 例:"1560415182.165, 1560415182.265"
  public page_size = 45; // integer	F	每页条数 默认20
  public page_num = 1 ; // integer	F	页码 默认1
}

export class FirstPageIconLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<FirstPageIconEntity> {
    const tempList: Array<FirstPageIconEntity> = [];
    results.forEach(res => {
      tempList.push(FirstPageIconEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FirstPageIconService {
  constructor(private httpService: HttpService) { }
  /**
   * 请求获取APP首页图标配置列表
   * @param application_id 应用编号
   * @returns Observable<FirstPageIconLinkResponse>
   */
  public requestFirstPageIconList(application_id: string): Observable<FirstPageIconLinkResponse> {
    const params = {
      page_size: 45,
      page_num: 1
    };
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/applications/${application_id}/menus`,
      params).pipe(map(res => new FirstPageIconLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求获取APP首页图标配置列表
   * @param string url linkUrl
   * @returns Observable<CameraLinkResponse>
   */
  public continueFirstPageIconList(url: string): Observable<FirstPageIconLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new FirstPageIconLinkResponse(res)));
  }

  /**
   * 请求获取应用列表
   * @returns Observable<Array<AppEntity>>
   */
  public requestAppList(): Observable<Array<AppEntity>> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/applications`)
        .pipe(map(res => {
          const tempList: Array<AppEntity> = [];
          res.body.forEach(data => {
            tempList.push(AppEntity.Create(data));
          });
          return tempList;
        }));
  }

  /**
   * 请求获取版本列表
   * @returns Observable<Array<VersionEntity>>
   */
  public requestVersionList(application_id: string): Observable<Array<VersionEntity>> {
    const param = {
      status: 1
    };
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/applications/${application_id}/versions`, param)
        .pipe(map(res => {
          const tempList: Array<VersionEntity> = [];
          res.body.forEach(data => {
            tempList.push(VersionEntity.Create(data));
          });
          return tempList;
        }));
  }

  /**
   * 删除APP首页图标配置
   * @param string menu_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteFirstPageIcon(menu_id: string, application_id: string): Observable<HttpResponse<any>> {
    return this.httpService.delete(environment.OPERATION_SERVE + `/admin/applications/${application_id}/menus/${menu_id}`);
  }

  /**
   * 隐藏、开启
   * @param menu_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestDisplayMenu(application_id: string, menu_id: string, params: any): Observable<HttpResponse<any>> {
    return this.httpService.patch(environment.OPERATION_SERVE +
        `/admin/applications/${application_id}/menus/${menu_id}/is_display`, params);
  }

  /**
   * 更新序列
   * @param menu_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateSort(menu_id: string, params: any): Observable<HttpResponse<any>> {
    return this.httpService.patch(environment.OPERATION_SERVE + `/admin/menus/${menu_id}/sort`, params);
  }

  /**
   * 详情
   * @param string menu_id 编号
   * @returns Observable<CameraVM>
   */
  public requestPageIconDetail(menu_id: string, application_id: string): Observable<FirstPageIconEntity> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/applications/${application_id}/menus/${menu_id}`
    ).pipe(map(res =>  FirstPageIconEntity.Create(res.body)));
  }

  /**
   * 新建APP首页图标配置信息
   * @param params 参数列表
   * @param application_id 应用id
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddPageIcon(params: FirstPageIconEntity, application_id: string): Observable<HttpResponse<any>> {
    return this.httpService.post(environment.OPERATION_SERVE + `/admin/applications/${application_id}/menus`, params.json());
  }

  /**
   * 编辑APP首页图标配置信息
   * @param params 参数列表
   * @param application_id 应用id
   * @param menu_id muneid
   * @returns Observable<HttpResponse<any>>
   */
  public requestModifyPageIcon(params: FirstPageIconEntity, application_id: string, menu_id: string): Observable<HttpResponse<any>> {
    return this.httpService.put(environment.OPERATION_SERVE + `/admin/applications/${application_id}/menus/${menu_id}`, params.json());
  }
}

