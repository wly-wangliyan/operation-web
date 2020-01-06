import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/index';
import { ValidateHelper } from '../../utils/validate-helper';
import { DateFormatHelper } from '../../utils/date-format-helper';
import { AuthService } from '../core/auth.service';
import { HttpErrorEntity } from '../core/http.service';
import { ChangePasswordParams, GlobalService } from '../core/global.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { ZPromptBoxComponent } from '../share/components/tips/z-prompt-box/z-prompt-box.component';
import { ZConfirmationBoxComponent } from '../share/components/tips/z-confirmation-box/z-confirmation-box.component';
import { Http403TipComponent } from '../share/components/tips/http403-tip/http403-tip.component';
import { Http500TipComponent } from '../share/components/tips/http500-tip/http500-tip.component';
import { ExpandedMenuComponent } from '../share/components/expanded-menu/expanded-menu.component';
import { IntervalService } from './notice-center/interval.service';

@Component({
    selector: 'app-operational-system',
    templateUrl: './operational-system.component.html',
    styleUrls: ['./operational-system.component.css']
})
export class OperationalSystemComponent implements AfterViewInit, OnDestroy {

    public user: string;

    public passwordPassword: ChangePasswordParams = new ChangePasswordParams();

    public repeat_password: string;

    private is_sava = false; // 标记是否在保存中

    private routePathSubscription: Subscription;

    @ViewChild('routerDiv', {static: false}) public routerDiv: ElementRef;

    @ViewChild(ZPromptBoxComponent, {static: false}) private promptBox: ZPromptBoxComponent;

    @ViewChild(ZConfirmationBoxComponent, {static: false}) private confirmationBox: ZConfirmationBoxComponent;

    @ViewChild(Http403TipComponent, {static: false}) public global403Tip: Http403TipComponent;

    @ViewChild(Http500TipComponent, {static: false}) public global500Tip: Http500TipComponent;

    @ViewChild(ExpandedMenuComponent, {static: false}) private menuComponent: ExpandedMenuComponent;

    constructor(public authService: AuthService,
                public globalService: GlobalService,
                private routeMonitorService: RouteMonitorService,
                private renderer2: Renderer2,
                private router: Router,
                private intervalService: IntervalService) {
        DateFormatHelper.NowBlock = () => {
            return new Date(globalService.timeStamp * 1000);
        };
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

    public onMainMenuClick(menu: string) {
        switch (menu) {
            // 门店保养
            case '/store-maintenance':
                window.open(`${location.protocol}//${location.host}/store-maintenance`);
                break;
            // 免检换贴
            case '/exemption':
                window.open(`${location.protocol}//${location.host}/exemption`);
                break;
            // 机场停车（预约泊车）
            case '/order-parking':
                window.open(`${location.protocol}//${location.host}/order-parking`);
                break;
            // // 话题
            // case '/topic':
            //     window.open(`${location.protocol}//${location.host}/topic`);
            //     break;
            default:
                const menu_name = '/main' + menu;
                this.router.navigate([menu_name]);
                break;
        }
    }

    // 打开通知中心
    public onNoticeCenterClick() {
        this.router.navigateByUrl('/main/notice-center/list').then(() => {
            const path = this.router.routerState.snapshot.url;
            if (path.includes('/ticket')) {
                // this.menuComponent.menuItems = this.menuComponent.generateMenus_ticket();
                this.menuComponent.refreshMenu(path);
            } else {
                this.router.navigateByUrl('/main/notice-center/list');
                this.menuComponent.refreshMenu(path);
            }
        });
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

    public menuActive(path: string, menu_name: string): boolean {
        const url = this.router.routerState.snapshot.url;
        if ((url.includes(path)) && this.authService.checkPermissions([menu_name])) {
            return true;
        } else {
            return false;
        }
    }
}

