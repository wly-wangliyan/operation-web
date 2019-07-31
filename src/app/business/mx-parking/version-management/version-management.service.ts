import { EventEmitter, Injectable } from '@angular/core';
import {HttpService, LinkResponse} from '../../../core/http.service';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {EntityBase} from '../../../../utils/z-entity';
import {HttpResponse} from '@angular/common/http';

export class AppEntity extends EntityBase {
  public application_id: string = undefined ; 	// 	string 应用id
  public application_name: string = undefined ; 	// 	string 应用id
  public system: number = undefined ; 	// 	int 系统    (1,'IOS'),(2,'Android')
  public version: string = undefined ; 	// 	string 最新版本号
}

export class VersionEntity extends EntityBase {
  public version_id: string = undefined ; 	// 	string 版本id
  public version: string = undefined ; 	// 	string 版本
  public is_display: string = undefined ; 	// 	bool  是否下线
  public created_time: number = undefined ; 	// 	string 创建时间
}

export class AddApplicationParams extends EntityBase {
  public application_name: string = undefined ; 	// 	string 应用id
  public system: number = undefined ; 	// 	int 系统    (1,'IOS'),(2,'Android')
  public bundle_id: string = undefined ; 	// 	string bundle_id
}

export class AddVersionParams extends EntityBase {
  public version: string = undefined; 	// 	string 最新版本号
}

export class SearchVersionParams extends EntityBase {
  page_size = 45; // integer	F	每页条数 默认20
  page_num = 1 ; // integer	F	页码 默认1
}

export class VersionLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<VersionEntity> {
    const tempList: Array<VersionEntity> = [];
    results.forEach(res => {
      tempList.push(VersionEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class VersionManagementService {
  constructor(private httpService: HttpService) { }
  /**
   * 请求获取应用列表
   * @returns Observable<Array<AppEntity>>
   */
  public requestAppList(): Observable<Array<AppEntity>> {
    return this.httpService.get(environment.OPERATION_SERVE + `/operation/applications`)
        .pipe(map(res => {
          const tempList: Array<AppEntity> = [];
          res.body.forEach(data => {
            tempList.push(AppEntity.Create(data));
          });
          return tempList;
        }));
  }

  /**
   * 请求删除应用
   * @param string menu_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteApplication(application_id: string): Observable<HttpResponse<any>> {
    return this.httpService.delete(environment.OPERATION_SERVE + `/admin/applications/${application_id}`);
  }

  /**
   * 请求获取版本列表
   * @returns Observable<Array<VersionLinkResponse>>
   */
  public requestVersionList(application_id: string, params: SearchVersionParams): Observable<VersionLinkResponse> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/applications/${application_id}/versions`, params)
        .pipe(map(res => new VersionLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求获取版本列表
   * @param string url linkUrl
   * @returns Observable<VersionLinkResponse>
   */
  public continueVersionList(url: string): Observable<VersionLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new VersionLinkResponse(res)));
  }

  /**
   * 请求删除版本
   * @param string version_id 版本ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteVersion(version_id: string): Observable<HttpResponse<any>> {
    return this.httpService.delete(environment.OPERATION_SERVE + `/admin/versions/${version_id}`);
  }

  /**
   * 请求上线、下线版本
   * @param version_id 版本id
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestDisplayVersion(version_id: string, params: any): Observable<HttpResponse<any>> {
    return this.httpService.patch(environment.OPERATION_SERVE +
        `/admin/versions/${version_id}/is_display`, params);
  }

  /**
   * 新建APP
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddApplication(params: AddApplicationParams): Observable<HttpResponse<any>> {
    return this.httpService.post(environment.OPERATION_SERVE + `/admin/applications`, params.json());
  }

  /**
   * 新建version
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddVersion(params: AddVersionParams, application_id: string): Observable<HttpResponse<any>> {
    return this.httpService.post(environment.OPERATION_SERVE + `/admin/applications/${application_id}/versions`, params.json());
  }
}

