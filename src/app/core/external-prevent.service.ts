import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { ExternalCanDeactivateComponent } from '../share/interfaces/can-deactivate-component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalPreventService implements CanDeactivate<ExternalCanDeactivateComponent> {

  public canDeactivate(component: ExternalCanDeactivateComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
                       nextState?: RouterStateSnapshot): boolean | Observable<boolean> {

    return Observable.create(observer => {
      if (!component.canDeactivate()) {
        // 如果修改过页面信息则弹出提示
        component.confirmationBox.open('提示' , '操作未完成，是否放弃？', () => {
          component.confirmationBox.close();
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
