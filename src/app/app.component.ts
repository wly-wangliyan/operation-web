import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GlobalService } from './core/global.service';
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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit, OnDestroy {

    public user: string;
    public menu: number;

    @ViewChild(ZPromptBoxComponent, {static: false}) private promptBox: ZPromptBoxComponent;
    @ViewChild(ZConfirmationBoxComponent, {static: false}) private confirmationBox: ZConfirmationBoxComponent;
    @ViewChild(Http403TipComponent, {static: false}) public global403Tip: Http403TipComponent;
    @ViewChild(Http500TipComponent, {static: false}) public global500Tip: Http500TipComponent;
    @ViewChild('routerDiv', {static: false}) public routerDiv: ElementRef;
    @ViewChild(ExpandedMenuComponent, {static: false}) private menuComponent: ExpandedMenuComponent;

    private routePathSubscription: Subscription;

    constructor(public authService: AuthService,
                public globalService: GlobalService,
                private routeMonitorService: RouteMonitorService,
                private renderer2: Renderer2,
                private router: Router,
                private intervalService: IntervalService) {
        DateFormatHelper.NowBlock = () => {
            return new Date(globalService.timeStamp * 1000);
        };
        const url = this.router.routerState.snapshot.url;
        this.menu = url.includes('/insurance') ? 3 : url.includes('/maintenance') ? 4 : url.includes('/ticket') ? 5 : url.includes('/notice-center') ? null : 1;
        this.globalService.menu_index = this.menu;
        this.intervalService.startTimer(); // 1.6启动定时
    }

    ngAfterViewInit() {
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

    ngOnDestroy() {
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
                    this.router.navigate(['/main/home']);
                } else if (url.includes('home')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus();
                }
                break;
            case 3:
                if (!url.includes('insurance')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_insurance();
                    this.router.navigate(['/main']);
                } else if (url.includes('home')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_insurance();
                }
                break;
            case 4:
                if (!url.includes('maintenance')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_maintenance();
                    this.router.navigate(['/main']);
                } else if (url.includes('home')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_maintenance();
                }
                break;
            case 5:
                if (!url.includes('/ticket')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_ticket();
                    this.router.navigate(['/main']);
                } else if (url.includes('home')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_ticket();
                }
                break;
            case 6:
                if (!url.includes('mall')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_mall();
                    this.router.navigate(['/main']);
                } else if (url.includes('home')) {
                    this.menuComponent.menuItems = this.menuComponent.generateMenus_mall();
                }
                break;
        }
    }

    // 打开通知中心
    public onNoticeCenterClick() {
        this.globalService.menu_last_index = this.menu;
        this.menu = null;
        this.globalService.menu_index = this.menu;
        this.getMenuList(this.menu);
        this.router.navigateByUrl('/main/notice-center/list');
    }

    // 通知中心未读数量
    private requestUnreadCount() {
        this.globalService.requestUnreadCount().subscribe(res => {
            this.globalService.notice_Count = res.body ? res.body.unread_num : 0;
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}

