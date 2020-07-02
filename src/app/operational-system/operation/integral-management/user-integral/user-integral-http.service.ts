import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class SearchUserIntegralParams extends EntityBase {
  public user_id: string = undefined; // 用户id
  public telephone: string = undefined; // 手机号
}

export class SearchIntegralDetailParams extends EntityBase {
  public status: any = ''; // 发放状态
  public section: string = undefined; // 产生时间/消耗时间/失效时间
  public tab_key = 1;
}

@Injectable({
  providedIn: 'root'
})
export class UserIntegralHttpService {
  private domain = environment.INTEGRAL_DOMAIN;

  constructor(private httpService: HttpService) { }
}
