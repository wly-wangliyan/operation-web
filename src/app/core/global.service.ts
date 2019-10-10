import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Http500TipComponent } from '../share/components/tips/http500-tip/http500-tip.component';
import { Http403TipComponent } from '../share/components/tips/http403-tip/http403-tip.component';
import { ZPromptBoxComponent } from '../share/components/tips/z-prompt-box/z-prompt-box.component';
import { ZConfirmationBoxComponent } from '../share/components/tips/z-confirmation-box/z-confirmation-box.component';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // 特殊存储，全局化资源配置
  public static Instance: GlobalService;

  constructor(private authService: AuthService, private httpService: HttpService) {
  }

  public promptBox: ZPromptBoxComponent = undefined;
  public confirmationBox: ZConfirmationBoxComponent = undefined;
  public http500Tip: Http500TipComponent = undefined;
  public http403Tip: Http403TipComponent = undefined;
  public menu_index = undefined;
  private permissionErrorMessage = '授权失败，请重新登录';

  /**
   * 获取当前服务器时间戳(秒）
   * @returns number
   */
  public get timeStamp(): number {
    return this.httpService.timeStamp;
  }

  /**
   * 网络错误处理函数
   * @param err 错误信息
   * @returns boolean 是否处理了错误信息，未处理则返回false
   */
  public httpErrorProcess(err: HttpErrorResponse): boolean {
    if (err.status === 403) {
      this.promptBox.open(this.permissionErrorMessage, () => {
        this.authService.kickOut();
      });
      return true;
    } else if (err.status === 500) {
      this.http500Tip.http500Flag = true;
      return true;
    } else {
      console.error(err);
      return false;
    }
  }

  // 获取通知中心未读数量
  public requestUnreadCount(): Observable<HttpResponse<any>> {
    const httpUrl = `${environment.OPERATION_SERVE}/messages`;
    return this.httpService.get(httpUrl);
  }
}
