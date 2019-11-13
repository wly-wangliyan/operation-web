import { Injectable } from '@angular/core';
import { AuthService, UserPermissionGroupEntity } from './auth.service';
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Http500TipComponent } from '../share/components/tips/http500-tip/http500-tip.component';
import { Http403TipComponent } from '../share/components/tips/http403-tip/http403-tip.component';
import { ZPromptBoxComponent } from '../share/components/tips/z-prompt-box/z-prompt-box.component';
import { ZConfirmationBoxComponent } from '../share/components/tips/z-confirmation-box/z-confirmation-box.component';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { EntityBase } from '../../utils/z-entity';

export class ChangePasswordParams extends EntityBase {
    public old_password: string = undefined;	 // T	原始密码
    public new_password: string = undefined;	// T	新密码
}

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    // 特殊存储，全局化资源配置
    public static Instance: GlobalService;

    private _permissionGroups: Array<UserPermissionGroupEntity>;

    constructor(private authService: AuthService, private httpService: HttpService) {
    }

    public promptBox: ZPromptBoxComponent = undefined;
    public confirmationBox: ZConfirmationBoxComponent = undefined;
    public http500Tip: Http500TipComponent = undefined;
    public http403Tip: Http403TipComponent = undefined;
    public menu_index = undefined;
    public menu_last_index = undefined;
    public notice_Count = 0;
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
        const httpUrl = `${environment.TICKET_SERVER}/messages/unread_num`;
        return this.httpService.get(httpUrl);
    }

    /**
     * 字符串限制标签
     * @param limitMsg
     * @param {number} limitLength
     * @returns {string}
     */
    public limitStrLengthTitle(limitMsg: any, limitLength: number = 10): string {
        if (limitMsg && limitMsg.length > limitLength) {
            return limitMsg;
        }
        return '';
    }

    /**
     * 获取权限组列表
     * @returns any
     */
    public get permissionGroups(): Observable<Array<UserPermissionGroupEntity>> {
        // if (isUndefined(this._permissionGroups)) {
        return this.authService.requestPermissionGroups().pipe(map(permissionGroups => {
            this._permissionGroups = permissionGroups;
            return permissionGroups;
        }));
        // } else {
        //   return Observable.create(observer => {
        //     observer.next(this._permissionGroups);
        //     observer.complete();
        //   });
        // }
    }

    /**
     * 请求修改密码
     * @param oldPwd 旧密码
     * @param newPwd 新密码
     */
    public requestModifyPassword(passwordParams: ChangePasswordParams): Observable<HttpResponse<any>> {
        const body = passwordParams.json();
        return this.httpService.patch(environment.OPERATION_SERVE + '/user/password', body);
    }
}
