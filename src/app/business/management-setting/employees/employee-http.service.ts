import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Observable } from 'rxjs';
import { UserEntity, UserPermissionGroupEntity } from '../../../core/auth.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class UserSearchParams extends EntityBase {
  public realname: string = undefined; // String F	姓名
  public telephone: string = undefined; // String	F	联系电话
  public page_num = 1; // int	F	页码
  public page_size = 45; // int	F	每页条数
}

export class UserEditParams extends EntityBase {
  public username: string = undefined; // String	F	用户名
  public realname: string = undefined; // String F	姓名
  public telephone: string = undefined; // String	F	联系电话
  public permission_group_ids: string = undefined; // 权限组id 用逗号分隔
  public remark: string = undefined; // String	备注

  constructor(user?: UserEntity) {
    super();
    if (user) {
      this.username = user.username;
      this.realname = user.realname;
      this.telephone = user.telephone;
      this.remark = user.remark;
      // permission_groups数据在外部处理
    }
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.username;
    return json;
  }
}

export class PermissionItem {

  public source: UserPermissionGroupEntity;

  public isChecked = false;

  public isDisabled = false;

  constructor(source: UserPermissionGroupEntity) {
    this.source = source;
  }
}

export class UserLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UserEntity> {
    const tempList: Array<UserEntity> = [];
    results.forEach(res => {
      tempList.push(UserEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeHttpService {

  private domain = environment.OPERATION_SERVE; // 运营域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取用户列表
   * @param searchParams 条件筛选参数
   * @returns Observable<R>
   */
  public requestUserList(searchParams: UserSearchParams): Observable<UserLinkResponse> {
    return this.httpService.get(`${this.domain}/users`, searchParams.json())
      .pipe(map(data => new UserLinkResponse(data)));
  }

  /**
   * 通过link获取列表
   * @param url url
   * @returns Observable<R>
   */
  public continueUserList(url: string): Observable<UserLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new UserLinkResponse(data)));
  }

  /**
   * 请求添加用户信息
   * @param editParams 用户参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddUser(editParams: UserEditParams): Observable<HttpResponse<any>> {
    return this.httpService.post(`${this.domain}/users`, editParams.json());
  }

  /**
   * 请求编辑用户信息
   * @param editParams 用户参数
   * @param username 用户名
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditUser(editParams: UserEditParams, username: string): Observable<HttpResponse<any>> {
    return this.httpService.put(`${this.domain}/users/${username}`, editParams.toEditJson());
  }

  /**
   * 请求获取用户信息
   * @param username 用户名
   * @returns Observable<R>
   */
  public requestUserInfo(username: string): Observable<UserEntity> {
    return this.httpService.get(`${this.domain}/users/${username}`).pipe(map(res => res.body));
  }

  /**
   * 请求删除用户
   * @param username 用户名
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteUser(username: string): Observable<HttpResponse<any>> {
    return this.httpService.delete(`${this.domain}/users/${username}`);
  }

  /**
   * 请求重置密码
   * @param username 用户名
   * @returns Observable<HttpResponse<any>>
   */
  public requestResetPassword(username: string): Observable<HttpResponse<any>> {
    const body = {
      username
    };
    return this.httpService.put(`${this.domain}/user/password/reset`, body);
  }
}
