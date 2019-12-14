import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import {
  ServiceFeeEntity,
  ServiceFeesManagementService,
  SearchFeeParams,
} from '../service-fees-management.service';
import { HttpErrorEntity } from '../../../core/http.service';

@Component({
  selector: 'app-rescue-fees-edit',
  templateUrl: './rescue-fees-edit.component.html',
  styleUrls: ['./rescue-fees-edit.component.css']
})
export class RescueFeesEditComponent implements OnInit {

  constructor(private globalService: GlobalService, private feesService: ServiceFeesManagementService,
    private routerInfo: ActivatedRoute, private router: Router) {
  }

  public serviceFeeData: ServiceFeeEntity = new ServiceFeeEntity();
  public searchFeeParams: SearchFeeParams = new SearchFeeParams();
  public loading = false;
  public service_fee_id: string;
  public balance_initial_price: string;
  public balance_current_price: string;
  public prepay_initial_price: string;
  public prepay_current_price: string;
  public balanceCurrentPriceErrors = '';
  public prepayCurrentPriceErrors = '';

  private searchText$ = new Subject<any>();

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.service_fee_id = params.service_fee_id;
    });
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.feesService.requestServiceFeeDetailData(this.service_fee_id).subscribe(res => {
        this.serviceFeeData = res;
        this.balance_initial_price = this.getFeeData(this.serviceFeeData.balance_initial_price);
        this.balance_current_price = this.getFeeData(this.serviceFeeData.balance_current_price);
        this.prepay_initial_price = this.getFeeData(this.serviceFeeData.prepay_initial_price);
        this.prepay_current_price = this.getFeeData(this.serviceFeeData.prepay_current_price);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchText$.next();
  }

  // 价钱数据处理
  private getFeeData(fee: number) {
    return (fee || fee === 0) ? (Number(fee) / 100).toFixed(2) : '';
  }

  public onCancelBtn() {
    this.router.navigateByUrl('/store-maintenance/service-fees-management');
  }

  // 保存数据
  public onSaveFormSubmit() {

    if (Number(this.balance_current_price) > Number(this.balance_initial_price)) {
      this.balanceCurrentPriceErrors = '尾款现价不得大于尾款原价！';
      this.prepayCurrentPriceErrors = '';
    } else if (Number(this.prepay_current_price) > Number(this.prepay_initial_price)) {
      this.prepayCurrentPriceErrors = '预付现价不得大于预付原价！';
      this.balanceCurrentPriceErrors = '';
    } else {
      this.balanceCurrentPriceErrors = '';
      this.prepayCurrentPriceErrors = '';
      this.searchFeeParams.balance_initial_price = Number(this.balance_initial_price) * 100;
      this.searchFeeParams.balance_current_price = Number(this.balance_current_price) * 100;
      this.searchFeeParams.prepay_initial_price = Number(this.prepay_initial_price) * 100;
      this.searchFeeParams.prepay_current_price = Number(this.prepay_current_price) * 100;
      this.feesService.requestUpdateFeeData(this.searchFeeParams, this.service_fee_id, 2).subscribe(() => {
        this.globalService.promptBox.open('编辑救援费成功！');
        this.searchText$.next();
        timer(2000).subscribe(() => this.router.navigateByUrl('/store-maintenance/service-fees-management'));
      }, err => {
        this.handleErrorFunc(err);
      });
    }

  }

  // 处理错误信息
  private handleErrorFunc(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field = content.field === 'balance_initial_price' ? '尾款原价' : content.field === 'balance_current_price' ?
            '尾款现价' : content.field === 'prepay_initial_price' ? '预付原价' : content.field === 'prepay_current_price' ? '预付现价'
              : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}输入错误`, null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('编辑救援费失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }

}
