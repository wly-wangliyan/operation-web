import { Component, OnInit, ViewChild } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { GlobalService } from '../../../../core/global.service';
import { AuthService, UserEntity } from '../../../../core/auth.service';
import { Subscription, timer } from 'rxjs/index';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.css']
})
export class LabelManagementComponent implements OnInit {
  public usersList: Array<UserEntity> = [];
  public noResultText = '数据加载中...';
  public tabs: Array<any> = [];
  public start_Time = null;
  public end_Time = null;
  public labelList: Array<any> = [];
  public isAllDisplayDataChecked = false;
  public isIndeterminate = false;
  public mapOfCheckedId: { [key: string]: boolean } = {};
  public checkedList: Array<any> = [];
  public pageSizeOptions = [15, 30, 50, 100, 200, 500];

  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private startValue: Date | null = null;
  private endValue: Date | null = null;
  private tab = 2;

  constructor(private authService: AuthService, private globalService: GlobalService) { }

  ngOnInit() {
    this.tabs = [
      { key: 1, value: '全部' },
      { key: 2, value: '已推荐' },
    ];
    this.labelList = [
      { name: 132132, id: 3243534546 },
      { name: 5435, id: 3243534546 },
    ];
    this.onTabChange(2);
  }

  // 初始化检索参数
  public initSearchParams() {
    this.start_Time = null;
    this.end_Time = null;
    this.mapOfCheckedId = {};
    this.isAllDisplayDataChecked = false;
    this.isIndeterminate = false;
    this.checkedList = [];
  }

  // 切换tab加载页面
  public onTabChange(key: number) {
    this.tab = key;
    // this.quotationService.requestQuotationList(key, this.searchParams).subscribe(res => {
    //   // this.quotationList = res.results;
    //   this.quotationList = res.results.map(i => ({
    //     ...i,
    //     insurance_company_name: i.latest_insurance_action ?
    //       i.latest_insurance_action.insurance_company_name && i.latest_insurance_action.insurance_company_name.split(',') : []
    //   }));
    //   this.linkUrl = res.linkUrl;
    //   this.noResultText = '暂无数据';
    // }, err => {
    //   this.globalService.httpErrorProcess(err);
    // });
  }

  // 开始时间校验
  public disabledStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
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
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.startValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.startValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  public onStartChange(date: Date): void {
    this.startValue = date;
  }

  public onEndChange(date: Date): void {
    this.endValue = date;
  }

  // 列表排序
  public drop(event: CdkDragDrop<string[]>, data: any): void {
    moveItemInArray(this.labelList, event.previousIndex, event.currentIndex);
    // if (event.previousIndex === event.currentIndex) {
    //   return;
    // }
    // let param = {};
    // if (event.previousIndex > event.currentIndex) {
    //   const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
    //   param = { move_num: this.labelList[index].sort_num };
    //   if (event.currentIndex === 0 && this.labelList[index].sort_num === 1) {
    //     param = { move_num: 0 };
    //   }
    // } else {
    //   param = { move_num: this.labelList[event.currentIndex].sort_num };
    // }
    // moveItemInArray(data, event.previousIndex, event.currentIndex);
    // this.firstPageIconService.requestUpdateSort(this.labelList[event.previousIndex].menu_id, param).subscribe((e) => {
    //   this.searchText$.next();
    //   this.globalService.promptBox.open('排序成功');
    // }, err => {
    //   this.globalService.httpErrorProcess(err);
    //   this.searchText$.next();
    // });
  }

  // 获取下单时间时间戳
  public getSectionTime(): string {
    // 创建时间
    const startTime = this.start_Time ? (new Date(this.start_Time).setHours(
      new Date(this.start_Time).getHours(), new Date(this.start_Time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const endTime = this.end_Time ? (new Date(this.end_Time).setHours(new Date(this.end_Time).getHours(),
      new Date(this.end_Time).getMinutes(), 59, 0) / 1000).toString() : 253402185600;
    return `${startTime},${endTime}`;
  }


}
