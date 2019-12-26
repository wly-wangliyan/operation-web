import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../core/global.service';
import { UpkeepOrderService, UpkeepOrderEntity } from '../upkeep-order.service';
import { PromptLoadingComponent } from '../../../share/components/prompt-loading/prompt-loading.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AccessoryEntity } from '../../accessory-library/accessory-library.service';
import { HttpErrorEntity } from '../../../core/http.service';

@Component({
  selector: 'app-battery-detail',
  templateUrl: './battery-detail.component.html',
  styleUrls: ['./battery-detail.component.css']
})
export class BatteryDetailComponent implements OnInit, AfterViewInit {

  public orderRecord: UpkeepOrderEntity = new UpkeepOrderEntity();

  private order_id: string; // order_id

  public expect_date: any = '';

  public isEditExpectDate = false;
  public isEditRemark = false;

  private searchText$ = new Subject<any>();

  @ViewChild(PromptLoadingComponent, { static: true }) public promptLoading: PromptLoadingComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private upkeepOrderService: UpkeepOrderService
  ) {
    this.route.paramMap.subscribe(map => {
      this.order_id = map.get('order_id');
    });
  }

  public ngOnInit() {
    if (this.order_id) {
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.getOrderDetail();
      });
      this.searchText$.next();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  public ngAfterViewInit() {
    this.promptLoading.open(null, true);
  }

  // 获取订单详情
  private getOrderDetail(): void {
    this.upkeepOrderService.requestOrderDetailData(this.order_id).subscribe(data => {
      this.orderRecord = data;
      this.isEditExpectDate = false;
      this.isEditRemark = false;
      this.promptLoading.close();
    }, err => {
      this.promptLoading.close();
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.orderRecord = null;
          this.globalService.promptBox.open('订单不存在！', null, 2000, null, false);
          return;
        }
      }
    });
  }

  public onResendMessageClick() {
    this.globalService.confirmationBox.open('提示', '确认重新发送短信给汽修店吗？', () => {
      this.globalService.confirmationBox.close();
      this.resendMessage();
    }, '重新发送');
  }

  private resendMessage() {
    this.upkeepOrderService.requestResendMessage(this.order_id, 2).subscribe(res => {
      this.globalService.promptBox.open('短信重发成功！');
      this.getOrderDetail();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          if (err.error) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.code === 'not_found' && content.field === 'order_id') {
                this.globalService.promptBox.open('订单不存在，请刷新重试！', null, 2000, null, false);
                return;
              } else if (content.code === 'not_found' && content.field === 'service_telephone') {
                this.globalService.promptBox.open('未找到该汽修店的电话，短信重发失败！', null, 2000, null, false);
                return;
              } else {
                this.globalService.promptBox.open('短信重发失败，请稍后再试！', null, 2000, null, false);
                return;
              }
            }
          } else {
            this.globalService.promptBox.open('短信重发失败，请稍后再试！', null, 2000, null, false);
            return;
          }
        } else if (err.status === 404) {
          this.globalService.promptBox.open('订单不存在，请刷新重试！', null, 2000, null, false);
          return;
        }
      }
    });
  }

  /**编辑
   * @param type 1:期望送达日期 2:订单备注
   */
  public onEditClick(type: number) {
    if (type === 1) {
      this.isEditExpectDate = true;
      this.expect_date = this.orderRecord.expect_date * 1000 || '';
    } else if (type === 2) {
      this.isEditRemark = true;
    }
  }

  /**保存
   * @param type 1:期望送达日期 2:订单备注
   */
  public onSaveClick(type: number) {
    if (type === 1) {
      this.requestExpectDate();
    } else if (type === 2) {
      this.requestEditRemark();
    }
  }

  /**取消编辑
   * @param type 1:期望送达日期 2:订单备注
   */
  public onCancleClick(type: number) {
    if (type === 1) {
      this.isEditExpectDate = false;
    } else if (type === 2) {
      this.isEditRemark = false;
    }
    this.searchText$.next();
  }

  private requestExpectDate() {
    // 格式化期望送达日期
    if (this.expect_date) {
      const eTimestamp = new Date(this.expect_date).setHours(new Date(this.expect_date).getHours(),
        new Date(this.expect_date).getMinutes(), 0, 0) / 1000;
      const currentTimeStamp = new Date().getTime() / 1000;
      if (eTimestamp - currentTimeStamp <= 0) {
        this.globalService.promptBox.open('期望送达日期应大于当前时间！', null, 2000, null, false);
        return;
      }
      this.orderRecord.expect_date = eTimestamp;
    } else {
      this.globalService.promptBox.open('请选择期望送达日期！', null, 2000, null, false);
      return;
    }
    this.upkeepOrderService.requestEditDate(this.order_id, this.orderRecord.expect_date).subscribe(() => {
      this.globalService.promptBox.open('保存成功');
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'invalid' && content.field === 'expect_date') {
              this.globalService.promptBox.open('期望送达日期数据错误，请重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('期望送达日期数据错误，请重试!', null, 2000, null, false);
              return;
            }
          }
        }
      }
    });
  }

  private requestEditRemark() {
    this.upkeepOrderService.requestEditRemark(this.order_id, this.orderRecord.remark).subscribe(() => {
      this.globalService.promptBox.open('保存成功');
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'invalid' && content.field === 'remark') {
              this.globalService.promptBox.open('订单备注数据错误，请重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('订单备注数据错误，请重试!', null, 2000, null, false);
              return;
            }
          }
        }
      }
    });
  }

  // 期望送达日期的禁用部分(仅可选择当前时间后的一年内时间)
  public disabledExpectTime = (value: Date): boolean => {
    const end_time = new Date().setFullYear(new Date().getFullYear() + 1);
    if (differenceInCalendarDays(value, new Date()) < 0) {
      return true;
    } else if (new Date(value).setHours(0, 0, 0, 0) >= new Date(end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
}
