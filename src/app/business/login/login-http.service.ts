import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpService } from '../../core/http.service';
import {EntityBase} from '../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class LoginParams extends EntityBase {
  public username:	string = undefined;	 // T	用户账号
  public password:	string = undefined;	// T	用户密码
}

export class UserInfoEntity extends EntityBase {
  public username: string = undefined;
  public access_token: string = undefined;
  public refresh_token: string = undefined;
  public expires_in: number = undefined;
}

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

  private domain = environment.CAMERA_MONITOR_DEPLOYMENT_SERVE;

  constructor(private httpService: HttpService) {
  }

  // 登录
  public requestLogin(loginParams: LoginParams): Observable<UserInfoEntity> {
    const url = this.domain + '/login_by_passport';
    const body = loginParams.json();
    return this.httpService.post(url, body).pipe(map(data => UserInfoEntity.Create(data.body)));
  }
}

