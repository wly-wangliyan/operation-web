/**
 * Created by zack on 13/2/18.
 */
import {isNullOrUndefined} from 'util';

/* 统一管理控制 */
export class LocalStorageProvider {

  public static Instance: LocalStorageProvider = new LocalStorageProvider();

  /* 键值都放在这里 */
  public static readonly AccessToken = 'access_token';
  public static readonly CorporateEmail = 'corporate_email';
  public static readonly HistoryLoginName = 'history-login-name';
  public static readonly CompanyId = 'company_id';
  public static readonly VehicleList = 'vehicle_list';

  /* 有效键值列表,所有键值都要在其中 */
  private validList: Array<string> = ['access_token', 'corporate_email', 'history-login-name', 'company_id', 'vehicle_list'];

  private main: any;

  private constructor() {
    if (!localStorage) {
      // throw new Error('Current browser does not support Local Storage');
    }
    this.main = localStorage;
  }

  public set(key: string, value: string): void {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }

    this.main[key] = value;
  }

  public get(key: string): string {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    return this.main[key];
  }

  public setObject(key: string, value: any): void {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    this.main[key] = JSON.stringify(value);
  }

  public getObject(key: string): any {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    if (!isNullOrUndefined(this.main[key])) {
      return JSON.parse(this.main[key] || '{}');
    }
    return null;
  }

  public remove(key: string): any {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    this.main.removeItem(key);
  }

  public clear() {
    this.validList.forEach(key => {
      this.main.remove(key);
    });
  }
}
