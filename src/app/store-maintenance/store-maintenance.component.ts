import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/index';
import { DateFormatHelper } from '../../utils/date-format-helper';
import { AuthService } from '../core/auth.service';
import { GlobalService } from '../core/global.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { ZPromptBoxComponent } from '../share/components/tips/z-prompt-box/z-prompt-box.component';
import { ZConfirmationBoxComponent } from '../share/components/tips/z-confirmation-box/z-confirmation-box.component';
import { Http500TipComponent } from '../share/components/tips/http500-tip/http500-tip.component';
import { initializer } from '../initializer';
import { HttpService } from '../core/http.service';
@Component({
  selector: 'app-store-maintenance',
  templateUrl: './store-maintenance.component.html',
  styleUrls: ['./store-maintenance.component.css', '../../assets/less/main-layout.less']
})
export class StoreMaintenanceComponent implements AfterViewInit, OnDestroy {

  public user: string;

  private routePathSubscription: Subscription;

  @ViewChild('routerDiv', { static: false }) public routerDiv: ElementRef;

  @ViewChild(ZPromptBoxComponent, { static: false }) private promptBox: ZPromptBoxComponent;

  @ViewChild(ZConfirmationBoxComponent, { static: false }) private confirmationBox: ZConfirmationBoxComponent;

  @ViewChild(Http500TipComponent, { static: false }) public global500Tip: Http500TipComponent;

  constructor(
    public authService: AuthService,
    public globalService: GlobalService,
    private routeMonitorService: RouteMonitorService,
    private renderer2: Renderer2,
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
    this.globalService.http500Tip = this.global500Tip;
    GlobalService.Instance = this.globalService;
    this.routeMonitorService.routePathChanged.subscribe(path => {
      // 到路由变更时重置显示状态
      this.global500Tip.http500Flag = false;
    });
  }

  public ngOnDestroy() {
    this.routePathSubscription && this.routePathSubscription.unsubscribe();
  }

  public displayStateChanged(): void {
    if (this.global500Tip.http500Flag) {
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

