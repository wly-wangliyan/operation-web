import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route,
  CanActivateChild
} from '@angular/router';
import { AuthService } from './auth.service';
import { GlobalConst } from '../share/global-const';

/* 权限守卫 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  public canLoad(route: Route): boolean {
    return this.checkLogin(`/${route.path}`);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  private checkLogin(url: string): boolean {
    this.authService.isShowExpandMenu = !url.includes('/notice-center');
    // 根据当前的登录状态来控制页面跳转
    if (url === '/login') {
      if (this.authService.isLoggedIn) {
        this.router.navigateByUrl(GlobalConst.HomePath);
        return false;
      }
    } else {
      // 根据是否有该模块权限来控制页面跳转
      if (!this.authService.checkPermissions(['ticket']) && url.includes('/notice-center')) {
        this.authService.isShowExpandMenu = true;
        return false;
      } else if (!this.authService.checkPermissions(['operation']) && url.includes('/operation')) {
        return false;
      } else if (!this.authService.checkPermissions(['insurance']) && url.includes('/insurance')) {
        return false;
      } else if (!this.authService.checkPermissions(['upkeep']) && url.includes('/maintenance')) {
        return false;
      } else if (!this.authService.checkPermissions(['ticket']) && url.includes('/ticket')) {
        return false;
      } else if (!this.authService.checkPermissions(['mall']) && url.includes('/mall')) {
        return false;
      } else if (!this.authService.checkPermissions(['management']) && url.includes('/management-setting')) {
        return false;
      } else if (!this.authService.isLoggedIn) {
        this.router.navigate(['login']);
        return false;
      }
    }
    return true;
  }
}
