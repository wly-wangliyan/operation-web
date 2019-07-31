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
}

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) {
  }

  // 登录
  public requestLogin(loginParams: LoginParams): Observable<UserInfoEntity> {
    const url = this.domain + '/login';
    return this.httpService.postFormData(url, loginParams).pipe(map(data => UserInfoEntity.Create(data.body)));
  }
}

