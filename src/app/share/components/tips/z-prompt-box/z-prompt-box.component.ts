import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-z-prompt-box',
  templateUrl: './z-prompt-box.component.html',
  styleUrls: ['./z-prompt-box.component.css']
})
export class ZPromptBoxComponent implements AfterViewInit {

  public src = '/assets/images/success.png';
  private errSrc = '/assets/images/warning.png';
  private callback: any;
  private delaySubscription: Subscription;

  @Input() public message: string;

  @ViewChild('promptDiv', { static: false }) public promptDiv: ElementRef;

  /**
   * 模态框消失，如果有关闭回调则执行，释放订阅。
   */
  public ngAfterViewInit() {
    $(this.promptDiv.nativeElement).on('hidden.bs.modal', () => {
      if (this.callback) {
        const temp = this.callback;
        this.callback = null;
        this.delaySubscription && this.delaySubscription.unsubscribe();
        this.delaySubscription = null;
        temp();
      }
    });
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public close() {
    this.delaySubscription && this.delaySubscription.unsubscribe();
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param message 消息体
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   * @param delay 延时关闭时间 (-1为不自动关闭,默认两秒)
   */

  public open(message: string, closeFunc: any = null, delay: number = 2000, src?: string, isSuccess: boolean = true) {
    timer(0).subscribe(() => {
      this.message = message;
      this.src = src ? src : this.src;
      this.src = isSuccess ? this.src : this.errSrc;
      $(this.promptDiv.nativeElement).modal('show');
    });
    this.callback = closeFunc;
    if (delay !== -1) {
      this.delaySubscription = timer(delay).subscribe(() => {
        this.close();
      });
    }
  }
}
