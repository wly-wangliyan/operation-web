import { Injectable, EventEmitter } from '@angular/core';
import { Subscription, Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntervalService {

  private count = 0;

  private timerSubscription: Subscription;

  private _timer_5minutes: EventEmitter<any> = new EventEmitter();

  public get timer_5minutes(): Observable<any> {
    return this._timer_5minutes.asObservable();
  }


  constructor() { }

  /**
   * 启动timer
   */
  public startTimer() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.timerSubscription = interval(1000 * 10).subscribe(() => {
      // 每10s触发一次数据刷新
      this.count++;
      if (this.count * 10 % (60 * 5) === 0) {
        this._timer_5minutes.emit();
      }
    });
  }

  /**
   * 停止timer
   */
  public stopTimer() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }
}
