import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../core/global.service';
import { OrderManagementService, BookingOrderEntity } from '../order-management.service';
import { HttpErrorEntity } from 'src/app/core/http.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public orderRecord: BookingOrderEntity = new BookingOrderEntity();

  public refund_fee: number; // 退款金额

  public loading = true;

  public imageUrls = [];

  public isEditOrderRemark = false; // 标记是否编辑订单备注

  private order_id: string; // 订单id

  private searchText$ = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService, private orderService: OrderManagementService) {
    this.route.paramMap.subscribe(map => {
      this.order_id = map.get('order_id');
    });
  }

  public ngOnInit() {
    if (this.order_id) {
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.requestOrderDetail();
      });
      this.searchText$.next();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  // 获取免检订单详情
  private requestOrderDetail(): void {
    this.orderService.requestOrderDetailData(this.order_id).subscribe(data => {
      this.orderRecord = data;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.globalService.httpErrorProcess(err);
    });
  }

  /**编辑
   */
  public onEditClick() {
    this.isEditOrderRemark = true;
  }

  /**保存
   */
  public onSaveClick() {
    this.requestUpdateOrderDetail();
  }

  /**取消编辑
   */
  public onCancleClick() {
    this.isEditOrderRemark = false;
    this.searchText$.next();
  }

  /** 修改订单详情
   * @param isEditRemark true 只修改备注 false 办理流程操作
   */
  private requestUpdateOrderDetail(): void {
    this.orderService.requestUpdateOrderDetailData({remark: this.orderRecord.remark}, this.order_id).subscribe(() => {
      this.globalService.promptBox.open('保存成功');
      this.onCancleClick();
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'failed' && content.field === 'refund') {
              this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
              return;
            }
          }
        }
      }
    });
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 重新发送短信
  public onResendMessage(receive) {
    const param = {receive_type: receive};
    this.orderService.requestResendMessage(this.order_id, param).subscribe(res => {
      this.globalService.promptBox.open('短信重发成功！');
      this.requestOrderDetail();
    }, err => {
      this.globalService.promptBox.open('短信重发失败，请稍后再试！', null, 2000, '/assets/images/warning.png');
    });
  }
}
