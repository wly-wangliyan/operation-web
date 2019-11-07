import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ProductService, SearchPriceCalendarParams, PriceCalendarEntity, SearchBatchImportParams } from '../../product.service';
import { HttpErrorEntity } from '../../../../../core/http.service';

@Component({
  selector: 'app-batch-import',
  templateUrl: './batch-import.component.html',
  styleUrls: ['./batch-import.component.css']
})

export class BatchImportComponent implements OnInit {

  public searchParams: SearchBatchImportParams = new SearchBatchImportParams();
  public calendarMap = {};
  public calendarMapKey = [];
  public datePriceList: Array<any> = [];

  private SearchCalendarParams: SearchPriceCalendarParams = new SearchPriceCalendarParams();
  private priceCalendarList: Array<PriceCalendarEntity> = [];
  private sureCallback: any;
  private searchText$ = new Subject<any>();
  private subscription: Subscription;

  @Input() public title: string;
  @Input() public product_id: string;
  @Input() public ticket_id: string;

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService, private productService: ProductService) {

  }

  ngOnInit() {
    this.datePriceList = [
      {
        startTime: null,
        endTime: null,
        price: '',
        time: new Date().getTime()
      }
    ];
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


  // 录入方式改变
  public onEntryModeChange(event: any) {
    this.searchParams.type = Number(event.target.value);
  }

  // 按日期录入方式添加时间
  public onDatePriceAddBtn() {
    const reg = /^\d+(\.\d+)?$/;
    const timeList = this.datePriceList.filter(v => !v.startTime || !v.endTime);
    const newDatePriceList = this.datePriceList.map(i => ({ ...i, section: this.getSectionTime(i.startTime, i.endTime) }));
    const timeValidList = newDatePriceList.filter(v => v.section.split(',')[0] > v.section.split(',')[1]);
    const priceList = this.datePriceList.filter(v => !(v.price || v.price === 0));
    const priceRegList = this.datePriceList.filter(v => v.price && !reg.test(v.price));
    if (timeList.length !== 0) {
      this.globalService.promptBox.open('请输入时间段后再添加！', null, 2000, '/assets/images/warning.png');
    } else if (timeValidList.length !== 0) {
      this.globalService.promptBox.open('结束日期必须大于等于起始日期！', null, 2000, '/assets/images/warning.png');
    } else if (priceList.length !== 0) {
      this.globalService.promptBox.open('请输入价格后再添加！', null, 2000, '/assets/images/warning.png');
    } else if (priceRegList.length !== 0) {
      this.globalService.promptBox.open('请输入正确的价格！', null, 2000, '/assets/images/warning.png');
    } else {
      const datePriceObj = {
        startTime: null,
        endTime: null,
        price: '',
        time: new Date().getTime()
      };
      this.datePriceList.push(datePriceObj);
    }
  }

  // 保存数据
  public onSaveBatchImport() {
    const reg = /^\d+(\.\d+)?$/;
    const timeList = this.datePriceList.filter(v => !v.startTime || !v.endTime);
    const newDatePriceList = this.datePriceList.map(i => ({
      ...i,
      section: this.getSectionTime(i.startTime, i.endTime),
      start: this.getSectionTime(i.startTime, i.endTime).split(',')[0],
      end: this.getSectionTime(i.startTime, i.endTime).split(',')[1]
    }));
    const timeValidList = newDatePriceList.filter(v => v.start > v.end);
    const priceList = this.datePriceList.filter(v => !(v.price || v.price === 0));
    const priceRegList = this.datePriceList.filter(v => v.price && !reg.test(v.price));
    if (timeList.length !== 0) {
      this.globalService.promptBox.open('请输入时间段后再添加！', null, 2000, '/assets/images/warning.png');
    } else if (timeValidList.length !== 0) {
      this.globalService.promptBox.open('结束日期必须大于等于起始日期！', null, 2000, '/assets/images/warning.png');
    } else if (priceList.length !== 0) {
      this.globalService.promptBox.open('请输入价格后再添加！', null, 2000, '/assets/images/warning.png');
    } else if (priceRegList.length !== 0) {
      this.globalService.promptBox.open('请输入正确的价格！', null, 2000, '/assets/images/warning.png');
    } else {
      let validSwitch = true;
      for (let i = 0; i < newDatePriceList.length; i++) {
        for (let j = i + 1; j < newDatePriceList.length; j++) {
          if ((newDatePriceList[j].start < newDatePriceList[i].start && newDatePriceList[j].end > newDatePriceList[i].start)
            || (newDatePriceList[j].start >= newDatePriceList[i].start && newDatePriceList[j].start < newDatePriceList[i].end)) {
            this.globalService.promptBox.open('时间段不可重复！', null, 2000, '/assets/images/warning.png');
            validSwitch = false;
            break;
          }
        }
        if (!validSwitch) {
          break;
        }
      }
      if (validSwitch) {// 校验成功之后调用接口
        console.log('保存数据');
      }

    }
  }

  // 按日期录入方式删除时间
  public onDatePriceDelBtn(i: number) {
    this.datePriceList.splice(i, 1);
  }

  // 获取时间戳
  public getSectionTime(start: any, end: any): string {
    const startTime = start ? (new Date(start).setHours(new Date(start).getHours(),
      new Date(start).getMinutes(), 0, 0) / 1000).toString() : 0;
    const endTime = end ? (new Date(end).setHours(new Date(end).getHours(),
      new Date(end).getMinutes(), 59, 0) / 1000).toString() : 0;
    return `${startTime},${endTime}`;
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public onCloseBatchImport() {
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
  public open(title: string = '编辑', product_id, ticket_id, sureFunc: any) {
    this.searchParams.type = 1;
    this.title = title;
    this.product_id = product_id;
    this.ticket_id = ticket_id;
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      this.searchText$.next();
      $(this.promptDiv.nativeElement).modal('show');
    });
  }
}
