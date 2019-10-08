import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateComponent } from '../share/interfaces/can-deactivate-component';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

/* 用来阻止页面跳转的服务 */
@Injectable()
export class RoutePreventService implements CanDeactivate<CanDeactivateComponent> {

  constructor(private authService: AuthService, private globalService: GlobalService) {
  }

  public canDeactivate(component: CanDeactivateComponent, currentRoute: ActivatedRouteSnapshot,
                       currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> {
    if (!this.authService.isLoggedIn) {
      // 未登录时不做页面阻止操作
      return true;
    }
    if (this.globalService.http403Tip) {
      // 当页面报403时页面跳转不阻止操作
      return true;
    }

    return Observable.create(observer => {
      // 如果修改页面信息，则离开页面弹出提示
      if (!component.canDeactivate()) {
        this.globalService.promptBox.open('您还没有保存，是否确定要离开？', () => {
          this.globalService.promptBox.close();
          observer.next(true);
          observer.complete();
        }, null);
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }
}
