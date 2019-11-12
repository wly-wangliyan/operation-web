import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { ProductService, BatchImportParams } from '../../product.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-batch-import',
  templateUrl: './batch-import.component.html',
  styleUrls: ['./batch-import.component.css']
})

export class BatchImportComponent implements OnInit {

  public batchImportParams: BatchImportParams = new BatchImportParams();
  public datePriceList: Array<any> = [];
  public dateSettingsList: Array<any> = [];
  public platform_price: string;

  private sureCallback: any;
  private searchText$ = new Subject<any>();
  private subscription: Subscription;
  private startValue: Date | null = null;
  private endValue: Date | null = null;

  @Input() public title: string;
  @Input() public product_id: string;
  @Input() public ticket_id: string;
  @Input() public priceCalendarList: Array<any> = [];

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService, private productService: ProductService) {

  }

  ngOnInit() {
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
  public open(title: string = '编辑', product_id: string, ticket_id: string, priceCalendarList: any, sureFunc: any) {
    this.batchImportParams.type = 1;
    this.platform_price = '';
    this.title = title;
    this.product_id = product_id;
    this.ticket_id = ticket_id;
    this.priceCalendarList = priceCalendarList;
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      this.searchText$.next();
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 开始时间校验
  public disabledStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) < 0) {
      return true;
    } else if (!startValue || !this.endValue) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.endValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 结束时间校验
  public disabledEndDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) < 0) {
      return true;
    } else if (!endValue || !this.startValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.startValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  public onStartTimeChange(date: Date): void {
    this.startValue = date;
  }

  public onEndTimeChange(date: Date): void {
    this.endValue = date;
  }

  public onStartTimeOpen(date: Date, i: number): void {
    this.endValue = this.datePriceList[i].endTime;
  }

  public onEndTimeOpen(date: Date, i: number): void {
    this.startValue = this.datePriceList[i].startTime;
  }

  // 录入方式改变
  public onEntryModeChange(event: any) {
    this.batchImportParams.type = Number(event.target.value);
    if (this.batchImportParams.type === 1) {
      this.platform_price = '';
    } else if (this.batchImportParams.type === 2) {
      this.datePriceList = [
        {
          startTime: null,
          endTime: null,
          price: '',
          time: new Date().getTime()
        }
      ];
      this.startValue = null;
      this.endValue = null;
    }
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
      this.startValue = null;
      this.endValue = null;
      this.datePriceList.push(datePriceObj);
    }
  }

  // 删除时间
  public onDatePriceDelBtn(i: number) {
    this.datePriceList.splice(i, 1);
  }

  // 保存数据
  public onSaveBatchImport() {
    if (this.batchImportParams.type === 1) {// 录入方式：全部统一价
      this.batchImportParams.platform_price = Number(this.platform_price) * 100;
      this.batchImportParams.date_settings = null;
      const reg = /^\d+(\.\d+)?$/;
      const buyPriceList = this.priceCalendarList.map(i => i.buy_price);
      const minBuyPrice = Math.max(...buyPriceList);
      const market_price = this.priceCalendarList[0].ticket.market_price;
      if (!this.platform_price) {
        this.globalService.promptBox.open('请输入统一售价！', null, 2000, '/assets/images/warning.png');
      } else if (!reg.test(this.platform_price)) {
        this.globalService.promptBox.open('请输入正确的售价！', null, 2000, '/assets/images/warning.png');
      } else if ((Number(this.platform_price) * 100) < (Number(minBuyPrice) / 0.94)) {
        this.globalService.confirmationBox.open('提示', '你设置的售价可能会造成亏损，确定要设置吗？\n计算公式：售价 ≥ 结算价 / 0.94', () => {
          this.globalService.confirmationBox.close();
          this.requestBatchImport();
        }, '确认保存', () => {
          this.platform_price = '';
        });
      } else if ((Number(this.platform_price) * 100) > Number(market_price)) {
        this.globalService.promptBox.open('平台售价不得大于市场价！', null, 2000, '/assets/images/warning.png');
      } else {
        this.requestBatchImport();
      }
    } else if (this.batchImportParams.type === 2) {// 录入方式：按日期设置
      this.dateSettingsList = this.datePriceList.map(i => ({
        start_date: i.startTime ? this.formatDate(i.startTime) : null,
        end_date: i.startTime ? this.formatDate(i.endTime) : null,
        platform_price: i.price ? Number(i.price) * 100 : '',
      }));
      this.batchImportParams.date_settings = JSON.stringify(this.dateSettingsList);
      this.batchImportParams.platform_price = null;
      this.validDataPrompt();
    } else {// 录入方式：按建议收件
      this.batchImportParams.platform_price = null;
      this.batchImportParams.date_settings = null;
      this.requestBatchImport();
    }
  }

  // 按日期设置录入方式时数据校验
  private validDataPrompt() {
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
      this.globalService.promptBox.open('请输入时间段后再保存！', null, 2000, '/assets/images/warning.png');
    } else if (timeValidList.length !== 0) {
      this.globalService.promptBox.open('结束日期必须大于等于起始日期！', null, 2000, '/assets/images/warning.png');
    } else if (priceList.length !== 0) {
      this.globalService.promptBox.open('请输入价格后再保存！', null, 2000, '/assets/images/warning.png');
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
        let validPriceSwitch = true;
        for (const value of this.priceCalendarList) {
          for (const item of this.dateSettingsList) {
            if (value.date >= item.start_date &&
              value.date <= item.end_date) {
              if (Number(item.platform_price) > Number(value.ticket.market_price)) {
                this.globalService.promptBox.open('平台售价不得大于市场价！', null, 2000, '/assets/images/warning.png');
                validPriceSwitch = false;
                break;
              }
            }
          }
          if (!validPriceSwitch) {
            break;
          }
        }

        if (validPriceSwitch) {
          let validBuyPriceSwitch = true;
          for (const value of this.priceCalendarList) {
            for (const item of this.dateSettingsList) {
              if (value.date >= item.start_date &&
                value.date <= item.end_date) {
                const newList = [];
                newList.push(value.buy_price);
                if (Number(item.platform_price) < (Number(Math.max(...newList)) / 0.94)) {
                  this.globalService.confirmationBox.open('提示', '你设置的售价可能会造成亏损，确定要设置吗？\n计算公式：售价 ≥ 结算价 / 0.94', () => {
                    this.globalService.confirmationBox.close();
                    this.requestBatchImport();
                  }, '确认保存');
                  validBuyPriceSwitch = false;
                  break;
                }
              }
            }
            if (!validBuyPriceSwitch) {
              break;
            }
          }
          if (validBuyPriceSwitch) {
            this.requestBatchImport();
          }
        }
      }
    }
  }

  // 调用保存数据接口
  private requestBatchImport() {
    this.productService.requestSetBatchImport(this.product_id, this.ticket_id, this.batchImportParams).subscribe(() => {
      this.globalService.promptBox.open('批量导入成功！');
      this.searchText$.next();
      if (this.sureCallback) {
        const temp = this.sureCallback;
        temp();
      }
      this.onCloseBatchImport();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            // tslint:disable-next-line:max-line-length
            const field = content.field === 'type' ? '录入方式' : 'type' ? '统一售价' : 'date_settings' ? '按日期录入' : '';
            if (content.code === 'missing_field') {
              this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
              return;
            } else if (content.code === 'invalid') {
              this.globalService.promptBox.open(`${field}输入错误`, null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('批量导入失败,请重试!', null, 2000, '/assets/images/warning.png');
            }
          }
        }
      }
    });
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

  // 获取时间戳
  private getSectionTime(start: any, end: any): string {
    const startTime = start ? (new Date(start).setHours(new Date(start).getHours(),
      new Date(start).getMinutes(), 0, 0) / 1000).toString() : 0;
    const endTime = end ? (new Date(end).setHours(new Date(end).getHours(),
      new Date(end).getMinutes(), 59, 0) / 1000).toString() : 0;
    return `${startTime},${endTime}`;
  }
}
