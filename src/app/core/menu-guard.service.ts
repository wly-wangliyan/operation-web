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
export class MenuGuardService implements CanActivate, CanLoad, CanActivateChild {

    constructor(private authService: AuthService, private router: Router) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkMenu(state.url);
    }

    public canLoad(route: Route): boolean {
        return this.checkMenu(`/${route.path}`);
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkMenu(state.url);
    }

    private checkMenu(url: string): boolean {
        // 根据当前的登录状态来控制页面跳转
        if (url.includes('/operation/') && !this.authService.checkPermissions(['operation'])) {
            this.router.navigateByUrl('/main/insurance/home');
            return false;
        } else if (url.includes('/insurance') && !this.authService.checkPermissions(['insurance'])) {
            this.router.navigateByUrl('/main/maintenance/home');
            return false;
        } else if (url.includes('/maintenance') && !this.authService.checkPermissions(['upkeep'])) {
            this.router.navigateByUrl('/main/ticket/home');
            return false;
        } else if (url.includes('/notice-center') && !this.authService.checkPermissions(['ticket'])) {
            this.router.navigateByUrl('/main/mall/home');
            return false;
        } else if (url.includes('/ticket') && !this.authService.checkPermissions(['ticket'])) {
            this.router.navigateByUrl('/main/mall/home');
            return false;
        } else if (url.includes('/mall') && !this.authService.checkPermissions(['mall'])) {
            this.router.navigateByUrl('/management-setting');
            return false;
        } else if (url.includes('/management-setting') && !this.authService.checkPermissions(['management'])) {
            window.open(`${location.protocol}//${location.host}/store-maintenance`);
            return false;
        } else if (url.includes('/store-maintenance') && !this.authService.checkPermissions(['store'])) {
            return false;
        }
        return true;
    }
}
