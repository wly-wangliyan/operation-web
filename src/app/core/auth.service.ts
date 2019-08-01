import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from './http.service';
import {isNullOrUndefined} from 'util';
import {GlobalConst} from '../share/global-const';
import {environment} from '../../environments/environment';
import {EntityBase} from '../../utils/z-entity';
import {ZPromptBoxComponent} from '../share/components/tips/z-prompt-box/z-prompt-box.component';
import { LocalStorageProvider } from '../share/localstorage-provider';

export class UserEntity extends EntityBase {
  public username: string = undefined; // string	用户账号主键
  public realname: string = undefined;	// string	用户姓名
  public password: string = undefined;	// string	密码
  public company_id: string = undefined;	// string	企业id
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public promptBox: ZPromptBoxComponent;

  private _isLoggedIn = false;
  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  private _user: UserEntity;
  public get user(): UserEntity {
    return this._user;
  }


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
              this.router.navigateByUrl(GlobalConst.HomePath);
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
        this.router.navigateByUrl(GlobalConst.HomePath);
      }*/
      this._isLoggedIn = true;
      this.router.navigateByUrl(GlobalConst.HomePath);
    }, err => {
      if (err.status === 403) {
        this.noAuthority();
      }
    });
  }

  /**
   * 授权失败时踢出登录状态
   */
  public kickOut() {
    this._isLoggedIn = false;
    this._user = null;
    this.router.navigate(['login']);
  }

  /**
   * 登出
   */
  public logout() {
    this.httpService.get(environment.OPERATION_SERVE + '/logout').subscribe(() => {
      this._isLoggedIn = false;
      this._user = null;
      this.router.navigate(['login']);
    });
  }

  /**
   * 没有权限登出
   */
  private noAuthority() {
    this.promptBox && this.promptBox.open('授权失败，请重新登录', () => {
      this.kickOut();
    });
  }

}


// gly    管理员
// kty    勘探员
// zgssy    中杆实施员
// xjssy    相机实施员
