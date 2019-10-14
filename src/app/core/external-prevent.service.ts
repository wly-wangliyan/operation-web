import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { ExternalCanDeactivateComponent } from '../share/interfaces/can-deactivate-component';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalPreventService implements CanDeactivate<ExternalCanDeactivateComponent> {
  constructor(private authService: AuthService, private globalService: GlobalService) {
  }
  public canDeactivate(component: ExternalCanDeactivateComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
                       nextState?: RouterStateSnapshot): boolean | Observable<boolean> {
    return Observable.create(observer => {
      if (!component.canDeactivate()) {
        // 如果修改过页面信息则弹出提示
        this.globalService.confirmationBox.open('提示', '信息未保存，是否放弃本次编辑？', () => {
          this.globalService.confirmationBox.close();
          observer.next(true);
          observer.complete();
        }, '确定', () => {
          observer.next(false);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }
}
