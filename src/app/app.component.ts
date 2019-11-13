import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { GlobalService, ChangePasswordParams } from './core/global.service';
import { AuthService } from './core/auth.service';
import { DateFormatHelper } from '../utils/date-format-helper';
import { RouteMonitorService } from './core/route-monitor.service';
import { Http403TipComponent } from './share/components/tips/http403-tip/http403-tip.component';
import { Http500TipComponent } from './share/components/tips/http500-tip/http500-tip.component';
import { Subscription } from 'rxjs/index';
import { ZConfirmationBoxComponent } from './share/components/tips/z-confirmation-box/z-confirmation-box.component';
import { ZPromptBoxComponent } from './share/components/tips/z-prompt-box/z-prompt-box.component';
import { ExpandedMenuComponent } from './share/components/expanded-menu/expanded-menu.component';
import { Router } from '@angular/router';
import { IntervalService } from './business/notice-center/interval.service';
import { HttpErrorEntity } from './core/http.service';
import { ValidateHelper } from '../utils/validate-helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  public user: string;

  public menu: number;

  public passwordPassword: ChangePasswordParams = new ChangePasswordParams();

  public repeat_password: string;

  private is_sava = false; // 标记是否在保存中

  @ViewChild(ZPromptBoxComponent, { static: false }) private promptBox: ZPromptBoxComponent;
  @ViewChild(ZConfirmationBoxComponent, { static: false }) private confirmationBox: ZConfirmationBoxComponent;
  @ViewChild(Http403TipComponent, { static: false }) public global403Tip: Http403TipComponent;
  @ViewChild(Http500TipComponent, { static: false }) public global500Tip: Http500TipComponent;
  @ViewChild('routerDiv', { static: false }) public routerDiv: ElementRef;
  @ViewChild(ExpandedMenuComponent, { static: false }) private menuComponent: ExpandedMenuComponent;

  private routePathSubscription: Subscription;

  constructor(
    public authService: AuthService,
    public globalService: GlobalService,
    private routeMonitorService: RouteMonitorService,
    private renderer2: Renderer2,
    private router: Router,
    private intervalService: IntervalService) {
    DateFormatHelper.NowBlock = () => {
      return new Date(globalService.timeStamp * 1000);
    };
    const url = this.router.routerState.snapshot.url;
    if ((url.includes('/operation') || url.includes('/home')) && this.authService.checkPermissions(['operation'])) {
      this.menu = 1;
    } else if ((url.includes('/insurance') || url.includes('/home')) && this.authService.checkPermissions(['insurance'])) {
      this.menu = 3;
    } else if ((url.includes('/maintenance') || url.includes('/home')) && this.authService.checkPermissions(['upkeep'])) {
      this.menu = 4;
    } else if ((url.includes('/ticket') || url.includes('/home')) && this.authService.checkPermissions(['ticket'])) {
      this.menu = 5;
    } else if ((url.includes('/mall') || url.includes('/home')) && this.authService.checkPermissions(['mall'])) {
      this.menu = 6;
    } else if ((url.includes('/management-setting') || url.includes('/home')) && this.authService.checkPermissions(['management'])) {
      this.menu = 7;
    } else if (url.includes('/notice-center') && this.authService.checkPermissions(['ticket'])) {
      this.menu = null;
    } else {
      if (this.authService.checkPermissions(['operation'])) {
        this.menu = 1;
      } else if (this.authService.checkPermissions(['insurance'])) {
        this.menu = 3;
      } else if (this.authService.checkPermissions(['upkeep'])) {
        this.menu = 4;
      } else if (this.authService.checkPermissions(['ticket'])) {
        this.menu = 5;
      } else if (this.authService.checkPermissions(['mall'])) {
        this.menu = 6;
      } else if (this.authService.checkPermissions(['management'])) {
        this.menu = 7;
      }
      this.router.navigate(['/main/home']);
    }
    // this.menu = url.includes('/insurance') ? 3 : url.includes('/maintenance') ? 4 : url.includes('/ticket') ? 5 : url.includes('/management-setting') ? 7 : url.includes('/notice-center') ? null : 1;
    this.globalService.menu_index = this.menu;
    this.intervalService.startTimer(); // 1.6启动定时
  }

  public ngAfterViewInit() {
    this.globalService.promptBox = this.promptBox;
    this.globalService.confirmationBox = this.confirmationBox;
    this.globalService.http403Tip = this.global403Tip;
    this.globalService.http500Tip = this.global500Tip;
    GlobalService.Instance = this.globalService;
    this.routeMonitorService.routePathChanged.subscribe(path => {
      // 到路由变更时重置显示状态
      this.global403Tip.http403Flag = false;
      this.global500Tip.http500Flag = false;
    });

    // 定时刷新通知中心未读数量;
    this.requestUnreadCount();
    this.intervalService.timer_5minutes.subscribe(() => {
      this.requestUnreadCount();
    });
  }

  public ngOnDestroy() {
    this.routePathSubscription && this.routePathSubscription.unsubscribe();
    this.intervalService.stopTimer();
  }

  // 退出
  public onLoginoutClick() {
    this.confirmationBox.open('提示', '确认退出?', () => {
      this.confirmationBox.close();
      this.authService.logout();
    });
  }

  public displayStateChanged(): void {
    if (this.global403Tip.http403Flag || this.global500Tip.http500Flag) {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'none');
    } else {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'block');
    }
  }

  public onMainMenuClick(index: any) {
    this.menu = index;
    this.globalService.menu_index = this.menu;
    this.getMenuList(index);
  }

  private getMenuList(index: any) {
    const url = this.router.routerState.snapshot.url;
    switch (index) {
      case 1:
        if (!url.includes('operation/')) {
          this.menuComponent.menuItems = this.menuComponent.generateMenus();
          this.router.navigate(['/main/operation/home']).then(() => {
            this.onMenuPrevent(this.menuComponent.generateMenus());
          });
        }
        break;
      case 3:
        if (!url.includes('insurance')) {
          this.menuComponent.menuItems = this.menuComponent.generateMenus_insurance();
          this.router.navigate(['/main/insurance/home']).then(() => {
            this.onMenuPrevent(this.menuComponent.generateMenus_insurance());
          });
        }
        break;
      case 4:
        if (!url.includes('maintenance')) {
          this.menuComponent.menuItems = this.menuComponent.generateMenus_maintenance();
          this.router.navigate(['/main/maintenance/home']).then(() => {
            this.onMenuPrevent(this.menuComponent.generateMenus_maintenance());
          });
        }
        break;
      case 5:
        if (!url.includes('/ticket')) {
          this.menuComponent.menuItems = this.menuComponent.generateMenus_ticket();
          this.router.navigate(['/main/ticket/home']).then(() => {
            this.onMenuPrevent(this.menuComponent.generateMenus_ticket());
          });
        }
        break;
      case 6:
        if (!url.includes('/mall')) {
          this.menuComponent.menuItems = this.menuComponent.generateMenus_mall();
          this.router.navigate(['/main/mall/home']).then(() => {
            this.onMenuPrevent(this.menuComponent.generateMenus_mall());
          });
        }
        break;
      case 7:
        if (!url.includes('/management-setting/')) {
          this.menuComponent.menuItems = this.menuComponent.generateMenus_management();
          this.router.navigate(['/main/management-setting/home']).then(() => {
            this.onMenuPrevent(this.menuComponent.generateMenus_management());
          });
        }
    }
  }

  // 打开通知中心
  public onNoticeCenterClick() {
    this.globalService.menu_last_index = this.menu;
    this.menu = null;
    this.globalService.menu_index = this.menu;
    this.getMenuList(this.menu);
    this.router.navigateByUrl('/main/notice-center/list').then(() => {
      const path = this.router.routerState.snapshot.url;
      if (path.includes('/ticket')) {
        this.menu = 5;
        this.globalService.menu_index = 5;
        this.menuComponent.menuItems = this.menuComponent.generateMenus_ticket();
        this.menuComponent.refreshMenu(path);
      } else {
        this.router.navigateByUrl('/main/notice-center/list');
        this.menuComponent.refreshMenu(path);
      }
    });
  }

  // 依据路由是否跳转进行菜单渲染
  private onMenuPrevent(func: any) {
    const path = location.pathname;
    if (path.includes('/ticket')) {
      this.menu = 5;
      this.globalService.menu_index = 5;
      this.menuComponent.menuItems = this.menuComponent.generateMenus_ticket();
      this.menuComponent.refreshMenu(path);
    } else if (path.includes('home')) {
      this.menuComponent.menuItems = func;
      this.menuComponent.refreshMenu(path);
    }
  }

  // 通知中心未读数量
  private requestUnreadCount() {
    this.globalService.requestUnreadCount().subscribe(res => {
      this.globalService.notice_Count = res.body ? res.body.unread_num : 0;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  public onModifyPwdDivClick() {
    this.passwordPassword = new ChangePasswordParams();
    this.repeat_password = '';
    this.is_sava = false;
    $('#modifyPasswordModal').modal();
  }

  /** 提交修改密码请求 */
  public onModifyPwdFormSubmit(): any {
    if (this.is_sava) {
      return;
    }
    if (!ValidateHelper.Length(this.passwordPassword.old_password, 6, 20)) {
      this.globalService.promptBox.open('旧密码输入有误，请重新输入!', null, 2000, null, false);
      return;
    } else if (!ValidateHelper.Length(this.passwordPassword.new_password, 6, 20)) {
      this.globalService.promptBox.open('新密码输入有误，请重新输入!', null, 2000, null, false);
      return;
    } else if (this.passwordPassword.new_password !== this.repeat_password) {
      this.globalService.promptBox.open('两次输入密码不一致，请重新输入！', null, 2000, null, false);
      return;
    } else if (this.passwordPassword.old_password === this.passwordPassword.new_password) {
      this.globalService.promptBox.open('新旧密码不可相同！', null, 2000, null, false);
    } else {
      this.is_sava = true;
      this.globalService.requestModifyPassword(this.passwordPassword).subscribe(() => {
        this.globalService.promptBox.open('密码修改成功,请重新登录！', () => {
          $('#modifyPasswordModal').modal('hide');
          this.is_sava = false;
          this.authService.kickOut();
        });
      }, err => {
        this.is_sava = false;
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

            for (const content of error.errors) {
              if (content.field === 'old_password' && content.code === 'invalid') {
                this.globalService.promptBox.open('旧密码输入有误，请重新输入!', null, 2000, null, false);
              } else if (content.field === 'new_password' && content.code === 'invalid') {
                this.globalService.promptBox.open('新密码输入有误，请重新输入!', null, 2000, null, false);
              } else {
                this.globalService.promptBox.open('参数错误或无效！', null, 2000, null, false);
              }
            }
          }
        }
      });
    }
  }
}

