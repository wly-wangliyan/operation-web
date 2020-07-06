import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { timer } from 'rxjs';
import { MathHelper } from '../../../../utils/math-helper';

class MonthItem {
  public month: string; // 月份
  public length: number; // 当月日期长度
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.less']
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input() public width = '198';
  @Input() public month: number; // 年
  @Input() public day: number; // 月、
  @Input() public placeholder: string; // 输入框提示
  @Input() public offsetLeft: number; // 插入位置偏移量
  @Input() public offsetTop: number; // 插入位置偏移量
  public elementId: string = Math.random().toString(36).substr(-10);
  public selectedMonth: MonthItem = new MonthItem();
  public selectedDay: string;
  public dateStr: string;
  public isShowDatePicker = false;
  public month_list: Array<MonthItem> = [];
  private day_list = [];
  public tempDays = [];
  constructor() { }

  ngOnInit() {
    this.initDaysOfMonth();
    this.initDaysList();
    this.initForm();
  }

  ngOnChanges(changes: { [msg: string]: SimpleChange }) {
    if ((changes.offsetLeft && changes.offsetLeft.currentValue || changes.offsetTop && changes.offsetTop.currentValue)) {
      this.generatePosition();
    }
  }

  // 根据插入位置偏移量使日期选择框保持跟随
  public generatePosition() {
    const box = document.getElementById(`date-picker-group_${this.elementId}`);
    const datePickerEle = document.getElementById(`date-picker_${this.elementId}`);
    const offsetLeft = this.offsetLeft + box.parentElement.parentElement.offsetLeft + 'px';
    const offsetTop = this.offsetTop + box.parentElement.parentElement.offsetTop + 34 + 'px';
    datePickerEle.style.top = offsetTop;
    datePickerEle.style.left = offsetLeft;
  }

  // 打开日期选择
  public onOpenDatePicker(event: any) {
    this.isShowDatePicker = true;
    this.generatePosition();
    this.scrollToSelectedMonth();
    this.scrollToSelectedDay();
  }

  // 初始化月份及日期数据
  public initForm(): void {
    this.selectedMonth = this.month_list.find(monthItem => monthItem.month === MathHelper.MathPadStart(this.month, 2)) || new MonthItem();
    this.selectedDay = MathHelper.MathPadStart(this.day, 2);
    this.generateDateStr();
  }

  // 关闭日期选择
  public onCloseDatePicker(): void {
    this.isShowDatePicker = false;
    if (!this.selectedMonth.month || !this.selectedDay) {
      this.onClearForm();
    }
  }

  // 清除信息
  public onClearForm(): void {
    this.selectedMonth = new MonthItem();
    this.selectedDay = null;
    this.dateStr = null;
  }

  // 选中月
  public onSelectMonth(monthItem: MonthItem) {
    this.selectedMonth = monthItem;
    this.scrollToSelectedDay();
    this.generateDateStr();
  }

  // 选中日
  public onSelectDay(day: string) {
    this.selectedDay = day;
    this.generateDateStr();
  }

  // 将选中“月”移到视野范围内
  private scrollToSelectedMonth(): void {
    if (this.selectedMonth.month) {
      const offsetMonth = (Number(this.selectedMonth.month) - 1) * 25;
      timer(0).subscribe(() => {
        $('.month-box').scrollTop(offsetMonth);
      });
    }
  }

  // 将选中“日”移到视野范围内
  private scrollToSelectedDay(): void {
    this.tempDays = this.selectedMonth.length ? this.day_list.slice(0, Number(this.selectedMonth.length)) : this.day_list;
    if (this.selectedMonth.month && this.selectedDay) {
      let offsetDay = (Number(this.selectedDay) - 1) * 25;
      if (this.selectedMonth.length < Number(this.selectedDay)) {
        this.selectedDay = this.day_list[this.selectedMonth.length - 1];
        offsetDay = (Number(this.selectedDay) - 1) * 25;
      }
      timer(0).subscribe(() => {
        $('.day-box').scrollTop(offsetDay);
      });
    }
  }

  // 格式化日期字符串
  private generateDateStr(splitMonthStr: string = '月', splitDayStr: string = '日') {
    if (isNullOrUndefined(this.selectedMonth.month) || isNaN(Number(this.selectedMonth.month))
      || isNullOrUndefined(this.selectedDay) || isNaN(Number(this.selectedDay))) {
      this.dateStr = null;
      return;
    }
    this.dateStr = `${this.selectedMonth.month} ${splitMonthStr} ${this.selectedDay} ${splitDayStr}`;
  }

  // 初始化日列表数据
  private initDaysList() {
    for (let day = 1; day <= 31; day++) {
      this.day_list.push(MathHelper.MathPadStart(day, 2));
    }
  }

  // 初始化月份列表数据
  private initDaysOfMonth() {
    for (let month = 1; month <= 12; month++) {
      const item = new MonthItem();
      item.month = MathHelper.MathPadStart(month, 2);
      const even_number = month % 2 === 0; // 标记是否偶数
      if (month <= 7) {
        if (even_number) {
          if (month === 2) {
            item.length = 29;
          } else {
            item.length = 30;
          }
        } else {
          item.length = 31;
        }
      } else {
        if (even_number) {
          item.length = 31;
        } else {
          item.length = 30;
        }
      }
      this.month_list.push(item);
    }
  }
}
