import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { isNullOrUndefined } from 'util';
import { GlobalConst } from '../share/global-const';
import { environment } from '../../environments/environment';
import { EntityBase } from '../../utils/z-entity';
import { LocalStorageProvider } from '../share/localstorage-provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class UserPermissionGroupEntity extends EntityBase {
  public permission_group_id: string = undefined; // string	T	权限组id
  public english_name: string = undefined; // string	T	权限组名称(英文)
  public chinese_name: string = undefined; // string	T	权限组名称(中文)
  public sort_num: number = undefined; // int T 权限排序
  public created_time: string = undefined; // double	T	创建时间
  public updated_time: string = undefined; // double	T	更新时间
}

export class UserEntity extends EntityBase {
  public username: string = undefined; // string	用户账号主键
  public realname: string = undefined;	// string	用户姓名
  public telephone: string = undefined; // Array	联系方式
  public company_id: string = undefined;	// string	企业id
  public permission_groups: Array<UserPermissionGroupEntity> = undefined; // Array	权限组
  public remark: string = undefined; // String	备注
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public is_superuser: boolean = undefined; // 是否为管理员

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'permission_groups') {
      return UserPermissionGroupEntity;
    }
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = false;
  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  private _user: UserEntity;
  public get user(): UserEntity {
    return this._user;
  }

  public isShowExpandMenu: boolean; // 用于设置菜单栏是否显示

  constructor(private router: Router, private httpService: HttpService) {
  }

  /**
   * 秘钥方式授权直接授权
   * @param user 当前用户
   */
  public authorizeBySecretKey(user: UserEntity) {
    this._user = user;
    this._isLoggedIn = !isNullOrUndefined(user);
  }

  /**
   * 登录方式授权获取用户信息
   */
  public authorizeByLogin() {
    this.httpService.get(environment.OPERATION_SERVE + '/user').subscribe(res => {
      this._user = UserEntity.Create(res.body);
      LocalStorageProvider.Instance.set(LocalStorageProvider.CompanyId, this._user.company_id);
      /*const tempRes = res['body'];
      if (!tempRes.is_superuser) {
        if (!tempRes['roles'] || tempRes['roles'].length === 0) {
          this.noAuthority();
        } else {
          for (let i = 0; i < tempRes['roles'].length; i++) {
            if (res['body'].roles[i].role_logo === 'gly') {
              this._isLoggedIn = true;
              location.href = location.origin + GlobalConst.HomePath;
              break;
            } else {
              if (i === (tempRes['roles'].length - 1)) {
                this.noAuthority();
              }
            }
          }
        }
      } else {
        this._isLoggedIn = true;
        location.href = location.origin + GlobalConst.HomePath;
      }*/
      this._isLoggedIn = true;
      location.href = location.origin + '/operational-system' + GlobalConst.HomePath;
    }, err => {
      if (err.status === 403) {
        // this.noAuthority();
      }
    });
  }

  /**
   * 授权失败时踢出登录状态
   */
  public kickOut() {
    this._isLoggedIn = false;
    this._user = null;
    location.href = location.origin + '/login';
  }

  /**
   * 登出
   */
  public logout() {
    this.httpService.get(environment.OPERATION_SERVE + '/logout').subscribe(() => {
      this._isLoggedIn = false;
      this._user = null;
      location.href = location.origin + '/login';
    }, err => {
      this._isLoggedIn = false;
      this._user = null;
      location.href = location.origin + '/login';
    });
  }

  /**
   * 没有权限登出
   */
  private noAuthority() {
    // this.promptBox && this.promptBox.open('授权失败，请重新登录', () => {
    //   this.kickOut();
    // });
  }

  /**
   * 刷新授权信息(修改用户权限时调用)
   */
  public refreshAuthorize() {
    this.httpService.get(environment.OPERATION_SERVE + '/user').subscribe(data => {
      this._user = UserEntity.Create(data.body);
    });
  }

  /**
   * 检查权限是否授权
   * @param permissions 权限英文名集合
   * @returns boolean 是否有权限
   */
  public checkPermissions(permissions: Array<string>): boolean {
    if (this.user) {
      if (this.user.is_superuser) {
        return true;
      }
      for (const permission of this.user.permission_groups) {
        if (permissions.indexOf(permission.english_name) >= 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  /**
   * 请求权限组列表
   * @returns Array<UserPermissionGroupEntity> 权限组列表
   */
  public requestPermissionGroups(): Observable<Array<UserPermissionGroupEntity>> {
    return this.httpService.get(environment.OPERATION_SERVE + '/admin/permission_groups').pipe(map(data => {
      const json = data.body;
      const tempGroups = [];
      json.forEach(jsonObj => {
        tempGroups.push(UserPermissionGroupEntity.Create(jsonObj));
      });
      return tempGroups;
    }));
  }
}


/*
chinese_name: "管理设置", english_name: "management", sort_num:1
chinese_name: "运营", english_name: "operation", sort_num:2
chinese_name: "保险", english_name: "insurance", sort_num:3
chinese_name: "保养", english_name: "upkeep", sort_num:4
chinese_name: "票务", english_name: "ticket", sort_num:5
chinese_name: "商城", english_name: "mall", sort_num:6
* */
