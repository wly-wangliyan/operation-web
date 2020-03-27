import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { ExpenseHttpService, ExpenseVerifyEntity, ExpenseSearchParams } from '../expense-http.service';
import { GlobalConst } from '../../../share/global-const';
import { debounceTime } from 'rxjs/operators';
import { DisabledTimeHelper } from '../../../../utils/disabled-time-helper';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit {
  public expenseVerifyRecords: Array<ExpenseVerifyEntity> = []; // 核销记录列表
  public searchParams: ExpenseSearchParams = new ExpenseSearchParams();
  public couponTypes = [1, 2]; // 劵码类型
  public carTypes = [1, 2]; // 车型

  public expense_start_time: any = ''; // 核销开始时间
  public expense_end_time: any = ''; // 核销结束时间

  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';

  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url
  private searchUrl: string;
  public total_num = 0; // 总条数

  private get pageCount(): number {
    if (this.expenseVerifyRecords.length % GlobalConst.NzPageSize === 0) {
      return this.expenseVerifyRecords.length / GlobalConst.NzPageSize;
    }
    return this.expenseVerifyRecords.length / GlobalConst.NzPageSize + 1;
  }
  constructor(private expenseHttpService: ExpenseHttpService, private globalService: GlobalService) { }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.exportSearchUrl();
      this.requestExpenseVerifyRecords();
    });
    this.searchText$.next();
  }

  private requestExpenseVerifyRecords(): void {
    this.requestSubscription = forkJoin(
      this.expenseHttpService.requestExpenseRecordData(this.searchParams),
      this.expenseHttpService.requestExpenseStatisticsData(this.searchParams)
    ).subscribe(result => {
      this.pageIndex = 1;
      this.expenseVerifyRecords = result[0].results;
      this.linkUrl = result[0].linkUrl;
      this.noResultText = '暂无数据';
      this.total_num = result[1].expense_verifies_num || 0;
      this.exportSearchUrl();
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.total_num = 0;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = forkJoin(
        this.expenseHttpService.continueExpenseRecordData(this.linkUrl),
        this.expenseHttpService.requestExpenseStatisticsData(this.searchParams)
      ).subscribe(continueData => {
        this.expenseVerifyRecords = this.expenseVerifyRecords.concat(continueData[0].results);
        this.linkUrl = continueData[0].linkUrl;
        this.total_num = continueData[1].expense_verifies_num || 0;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
    }
  }

  // 导出
  public onExportRecords(): void {
    if (this.generateAndCheckParamsValid()) {
      window.open(this.searchUrl);
    }
  }

  // 导出url
  private exportSearchUrl() {
    this.searchUrl = `${environment.STORE_DOMAIN}/admin/wash_car/expense_verifies/export?default=1`;
    const params = this.searchParams.json();
    for (const key in params) {
      if (params[key]) {
        this.searchUrl += `&${key}=${params[key]}`;
      }
    }
  }

  /* 生成并检查参数有效性 */
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.expense_start_time ? (new Date(this.expense_start_time).setHours(new Date(this.expense_start_time).getHours(),
      new Date(this.expense_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.expense_end_time ? (new Date(this.expense_end_time).setHours(new Date(this.expense_end_time).getHours(),
      new Date(this.expense_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;

    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('核销开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }

    if (this.expense_start_time || this.expense_end_time) {
      this.searchParams.expense_section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.expense_section = null;
    }
    return true;
  }

  // 开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.expense_end_time);
  }

  // 结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.expense_start_time);
  }
}
