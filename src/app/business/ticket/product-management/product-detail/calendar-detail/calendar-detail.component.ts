import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ProductService, SearchPriceCalendarParams, PriceCalendarEntity } from '../../product.service';
import { Type } from '@angular/compiler';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.css']
})
export class CalendarDetailComponent implements OnInit {


  public accounting_date: number = undefined; 	// 	integer	结算日 范围 1-28
  public loading = true;
  public carTypeList: Array<any> = [];
  public editAccountDateSwitch = true;
  public selectedDate: Date;
  public selectedDateMonth: number;
  public mode = 'month';
  public calendarMap = {};
  public calendarMapKey = [];

  private SearchCalendarParams: SearchPriceCalendarParams = new SearchPriceCalendarParams();
  private priceCalendarList: Array<PriceCalendarEntity> = [];
  private sureCallback: any;
  private searchText$ = new Subject<any>();
  private searchThirdText$ = new Subject<any>();
  private subscription: Subscription;
  private selectYear: number;
  private selectMonth: number;

  @Input() public title: string;
  @Input() public product_id: string;
  @Input() public ticket_id: string;
  @Input() public type: number;

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService, private productService: ProductService) {
    this.selectedDate = new Date();
    this.selectedDateMonth = new Date().getMonth() + 1;
    this.SearchCalendarParams.start_date = this.getMonthStartDate(new Date().getFullYear(), new Date().getMonth());
    this.SearchCalendarParams.end_date = this.getMonthEndDate(new Date().getFullYear(), new Date().getMonth());
  }

  ngOnInit() {
    // 价格日历
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestPriceCalendars(this.product_id, this.ticket_id, this.SearchCalendarParams))
    ).subscribe(res => {
      this.priceCalendarList = res.results;
      const calendarList = this.priceCalendarList.map((value, key) => [new Date(value.date).getDate(), value]);
      const map = new Map();
      for (const i of calendarList) {
        map.set(i[0], i[1]);
      }
      this.calendarMap = this.mapChangeObj(map);
      this.calendarMapKey = Object.keys(this.calendarMap);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });

    // 第三方价格日历
    this.searchThirdText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestThirdPriceCalendars(this.product_id, this.ticket_id, this.SearchCalendarParams))
    ).subscribe(res => {
      this.priceCalendarList = res.results;
      const calendarList = this.priceCalendarList.map((value, key) => [new Date(value.date).getDate(), value]);
      const map = new Map();
      for (const i of calendarList) {
        map.set(i[0], i[1]);
      }
      this.calendarMap = this.mapChangeObj(map);
      this.calendarMapKey = Object.keys(this.calendarMap);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // map转换为对象
  private mapChangeObj = (map) => {
    const obj = {};
    for (const [k, v] of map) {
      obj[k] = v;
    }
    return obj;
  }

  // 变更时间
  public onSelectChange(event) {
    this.selectYear = event.getFullYear();
    this.selectMonth = event.getMonth();
    this.SearchCalendarParams.start_date = this.getMonthStartDate(this.selectYear, this.selectMonth);
    this.SearchCalendarParams.end_date = this.getMonthEndDate(this.selectYear, this.selectMonth);
    this.searchText$.next();
  }

  // 获得本月的开始日期
  private getMonthStartDate(year: number, month: number) {
    const monthStartDate = new Date(year, month, 1);
    return this.formatDate(monthStartDate);
  }

  // 获得本月的结束时间
  private getMonthEndDate(year: number, month: number) {
    const lastMonthEndDate = new Date(year, month, this.getMonthDays(month));
    return this.formatDate(lastMonthEndDate);
  }


  // 格式化日期：yyyy-MM-dd
  private formatDate(date) {
    const myYear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = '0' + mymonth;
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday;
    }
    return (myYear + '-' + mymonth + '-' + myweekday);
  }

  // 获得某月的天数 可以
  private getMonthDays(myMonth) {
    const monthStartDate = new Date(new Date().getFullYear(), myMonth, 1);
    const monthEndDate = new Date(new Date().getFullYear(), myMonth + 1, 1);
    const days = (Number(monthEndDate) - Number(monthStartDate)) / (1000 * 60 * 60 * 24);
    return days;
  }


  /**
   * 取消按钮触发关闭模态框，释放订阅。
   * */
  public close() {
    this.loading = true;
    this.editAccountDateSwitch = true;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sureCallback) {
      this.sureCallback = null;
    }
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param message 消息体
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(title: string = '编辑', type: number, product_id, ticket_id, sureFunc: any) {
    this.title = title;
    this.product_id = product_id;
    this.ticket_id = ticket_id;
    this.type = type;
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      if (type === 1) {
        this.searchText$.next();
      } else if (type === 2) {
        this.searchThirdText$.next();
      } else {
        return;
      }
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /[\d]/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

}
