

import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ProductService, SearchPriceCalendarParams, PriceCalendarEntity } from '../../product.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { toUnicode } from 'punycode';

@Component({
  selector: 'app-product-calendar',
  templateUrl: './product-calendar.component.html',
  styleUrls: ['./product-calendar.component.css']
})

export class ProductCalendarComponent implements OnInit {

  public accounting_date: number = undefined; 	// 	integer	结算日 范围 1-28
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
  private subscription: Subscription;
  private selectYear: number;
  private selectMonth: number;
  private isEditPlatformPrice = false;

  @Input() public title: string;
  @Input() public product_id: string;
  @Input() public ticket_id: string;

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService, private productService: ProductService) {
  }

  ngOnInit() {
    // 价格日历
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestPriceCalendars(this.product_id, this.ticket_id, this.SearchCalendarParams))
    ).subscribe(res => {
      this.priceCalendarList = res.results.map(i => ({ ...i, platform_price: (Number(i.platform_price) / 100).toFixed(2) }));
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
    if (!this.isEditPlatformPrice) {
      this.calendarMap = {};
      this.calendarMapKey = [];
      this.selectYear = event.getFullYear();
      this.selectMonth = event.getMonth();
      if (this.selectMonth === new Date().getMonth()) {
        this.selectedDate = new Date();
      }
      this.selectedDateMonth = event.getMonth() + 1;
      this.SearchCalendarParams.start_date = this.getMonthStartDate(this.selectYear, this.selectMonth);
      this.SearchCalendarParams.end_date = this.getMonthEndDate(this.selectYear, this.selectMonth);
      this.searchText$.next();
    }
  }

  public onFocusPlatformPrice() {
    this.isEditPlatformPrice = true;
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
   */
  public close() {
    const list = this.priceCalendarList.filter(i => !i.platform_price);
    if (list.length !== 0) {
      this.globalService.promptBox.open('请填写平台售价!', null, 2000, '/assets/images/warning.png');
    } else {
      this.editAccountDateSwitch = true;
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      if (this.sureCallback) {
        this.sureCallback = null;
      }
      $(this.promptDiv.nativeElement).modal('hide');
      this.isEditPlatformPrice = false;
    }
  }

  /**
   * 打开确认框
   * @param message 消息体
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(title: string = '编辑', product_id, ticket_id, sureFunc: any) {
    this.onInitCalendar();
    this.title = title;
    this.product_id = product_id;
    this.ticket_id = ticket_id;
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      this.searchText$.next();
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 初始化日历数据
  private onInitCalendar() {
    this.calendarMap = {};
    this.calendarMapKey = [];
    this.selectedDate = new Date();
    this.selectedDateMonth = new Date().getMonth() + 1;
    this.SearchCalendarParams.start_date = this.getMonthStartDate(new Date().getFullYear(), new Date().getMonth());
    this.SearchCalendarParams.end_date = this.getMonthEndDate(new Date().getFullYear(), new Date().getMonth());
    this.isEditPlatformPrice = false;
  }

  // 平台售价输入框失去焦点校验
  public onBlurSavePlatformPrice(value: any) {
    this.isEditPlatformPrice = false;
    const reg = /^\d+(\.\d+)?$/;
    if (value.platform_price !== null && value.platform_price !== undefined && value.platform_price !== '') {
      if (!reg.test(value.platform_price)) {
        this.globalService.promptBox.open('请输入正确的平台售价！', null, 2000, '/assets/images/warning.png');
      } else if ((Number(value.platform_price) * 100) < (Number(value.buy_price) / 0.94)) {
        this.globalService.confirmationBox.open('提示', '你设置的售价可能会造成亏损，确定要设置吗？\n计算公式：售价 ≥ 结算价 / 0.94', () => {
          this.globalService.confirmationBox.close();
          this.submitPlatformPrice(value);
        }, '确认保存');
      } else if ((Number(value.platform_price) * 100) > Number(value.ticket.market_price)) {
        this.globalService.promptBox.open('平台售价不得大于市场价！', null, 2000, '/assets/images/warning.png');
      } else {
        this.submitPlatformPrice(value);
      }
    } else {
      this.globalService.promptBox.open('请填写平台售价!', null, 2000, '/assets/images/warning.png');
    }
  }

  // 保存平台售价
  private submitPlatformPrice(value: any) {
    this.productService.requestSetPlatformPrice(this.product_id, this.ticket_id, value).subscribe(() => {
      //  this.globalService.promptBox.open('平台售价保存成功！');
      this.searchText$.next();
      if (this.sureCallback) {
        const temp = this.sureCallback;
        temp();
      }
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            // tslint:disable-next-line:max-line-length
            const field = content.field === 'platform_price' ? '平台售价' : '';
            if (content.code === 'missing_field') {
              this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
              return;
            } else if (content.code === 'invalid') {
              this.globalService.promptBox.open(`${field}输入错误`, null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('平台售价保存失败,请重试!', null, 2000, '/assets/images/warning.png');
            }
          }
        }
      }
    });
  }
}
