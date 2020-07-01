import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';

export class SearchUserIntegralParams extends EntityBase {
  public user_id: string = undefined; // 用户id
  public telephone: string = undefined; // 手机号
}

@Injectable({
  providedIn: 'root'
})
export class UserIntegralHttpService {

  constructor() { }
}
