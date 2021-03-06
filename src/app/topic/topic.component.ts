import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/index';
import { DateFormatHelper } from '../../utils/date-format-helper';
import { AuthService } from '../core/auth.service';
import { GlobalService } from '../core/global.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { IntervalService } from '../operational-system/notice-center/interval.service';
import { ZPromptBoxComponent } from '../share/components/tips/z-prompt-box/z-prompt-box.component';
import { ZConfirmationBoxComponent } from '../share/components/tips/z-confirmation-box/z-confirmation-box.component';
import { Http403TipComponent } from '../share/components/tips/http403-tip/http403-tip.component';
import { Http500TipComponent } from '../share/components/tips/http500-tip/http500-tip.component';
import { ExpandedMenuComponent } from '../share/components/expanded-menu/expanded-menu.component';
import { initializer } from '../initializer';
import { HttpService } from '../core/http.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css', '../../assets/less/main-layout.less']
})
export class TopicComponent implements AfterViewInit, OnDestroy {

  public user: string;

  private routePathSubscription: Subscription;

  @ViewChild('routerDiv', { static: false }) public routerDiv: ElementRef;

  @ViewChild(ZPromptBoxComponent, { static: false }) private promptBox: ZPromptBoxComponent;

  @ViewChild(ZConfirmationBoxComponent, { static: false }) private confirmationBox: ZConfirmationBoxComponent;

  @ViewChild(Http403TipComponent, { static: false }) public global403Tip: Http403TipComponent;

  @ViewChild(Http500TipComponent, { static: false }) public global500Tip: Http500TipComponent;

  @ViewChild(ExpandedMenuComponent, { static: false }) private menuComponent: ExpandedMenuComponent;

  constructor(public authService: AuthService,
              public globalService: GlobalService,
              private routeMonitorService: RouteMonitorService,
              private renderer2: Renderer2,
              private intervalService: IntervalService,
              private httpService: HttpService) {
    authService.authorizeBySecretKey(initializer.user);
    httpService.setStartTimeStamp(initializer.startTimeStamp);
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
    this.routeMonitorService.routePathChanged.subscribe(() => {
      // 到路由变更时重置显示状态
      this.global403Tip.http403Flag = false;
      this.global500Tip.http500Flag = false;
    });
  }

  public ngOnDestroy() {
    this.routePathSubscription && this.routePathSubscription.unsubscribe();
    this.intervalService.stopTimer();
  }

  public displayStateChanged(): void {
    if (this.global403Tip.http403Flag || this.global500Tip.http500Flag) {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'none');
    } else {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'block');
    }
  }

  // 退出
  public onLoginoutClick() {
    this.confirmationBox.open('提示', '确认退出?', () => {
      this.confirmationBox.close();
      this.authService.logout();
    });
  }
}
