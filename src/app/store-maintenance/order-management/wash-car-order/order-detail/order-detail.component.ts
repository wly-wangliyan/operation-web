import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { HttpErrorEntity } from '../../../../core/http.service';
import { WashCarOrderEntity, WashOrderService } from '../wash-car-order.service';
import { ExpenseVerifyEntity } from '../../../expense-management/expense-http.service';
import { PromptLoadingComponent } from '../../../../share/components/prompt-loading/prompt-loading.component';
import { CheckRefundComponent } from '../check-refund/check-refund.component';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, AfterViewInit {
  public orderRecord: WashCarOrderEntity = new WashCarOrderEntity();
  public expenseVerifyRecords: Array<ExpenseVerifyEntity> = [];
  public isEditRemark = false;
  public expenseStatus = ['default', '已核销', '未核销', '已失效'];
  public searchText$ = new Subject<any>();
  private wash_car_order_id: string; // wash_car_order_id

  @ViewChild(PromptLoadingComponent, { static: true }) public promptLoading: PromptLoadingComponent;
  @ViewChild(CheckRefundComponent, {static: true}) public checkRefundComponent: CheckRefundComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private orderService: WashOrderService) {
    this.route.paramMap.subscribe(map => {
      this.wash_car_order_id = map.get('wash_car_order_id');
    });
  }

  public ngOnInit() {
    if (this.wash_car_order_id) {
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
    forkJoin(this.orderService.requestOrderDetailData(this.wash_car_order_id),
      this.orderService.requestExpenseVerifyRecordsData(this.wash_car_order_id)).subscribe(res => {
        this.orderRecord = res[0];
        this.expenseVerifyRecords = res[1];
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

  // 保存备注
  public onSaveClick(): void {
    this.orderService.requestEditRemark(this.wash_car_order_id, this.orderRecord.remark).subscribe(() => {
      this.globalService.promptBox.open('保存成功');
      this.isEditRemark = false;
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'invalid' && content.field === 'remark') {
              this.globalService.promptBox.open('备注数据错误，请重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('备注数据错误，请重试!', null, 2000, null, false);
              return;
            }
          }
        }
      }
    });
  }

  // 取消编辑
  public onCancelClick(): void {
    this.isEditRemark = false;
    this.searchText$.next();
  }

  // 审核并退款
  public onCheckRefundClick(orderItem: WashCarOrderEntity): void {
    this.checkRefundComponent.open(orderItem, () => {
      this.searchText$.next();
    });
  }
}
