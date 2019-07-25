import {AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {GlobalService} from './core/global.service';
import {AuthService} from './core/auth.service';
import {DateFormatHelper} from '../utils/date-format-helper';
import {RouteMonitorService} from './core/route-monitor.service';
import {Http403TipComponent} from './share/components/tips/http403-tip/http403-tip.component';
import {Http500TipComponent} from './share/components/tips/http500-tip/http500-tip.component';
import {Subscription} from 'rxjs/index';
import {ZConfirmationBoxComponent} from './share/components/tips/z-confirmation-box/z-confirmation-box.component';
import {ZPromptBoxComponent} from './share/components/tips/z-prompt-box/z-prompt-box.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  public user: string;

  @ViewChild(ZPromptBoxComponent, {static: false} ) private promptBox: ZPromptBoxComponent;
  @ViewChild(ZConfirmationBoxComponent, {static: false}) private confirmationBox: ZConfirmationBoxComponent;
  @ViewChild(Http403TipComponent, {static: false}) public global403Tip: Http403TipComponent;
  @ViewChild(Http500TipComponent, {static: false}) public global500Tip: Http500TipComponent;
  @ViewChild('routerDiv', {static: false}) public routerDiv: ElementRef;

  private routePathSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private globalService: GlobalService,
    private routeMonitorService: RouteMonitorService,
    private renderer2: Renderer2) {
    DateFormatHelper.NowBlock = () => {
      return new Date(globalService.timeStamp * 1000);
    };

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
  }

  ngOnDestroy() {
    this.routePathSubscription && this.routePathSubscription.unsubscribe();
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
}

