import { Component, OnInit, ViewChild } from '@angular/core';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import {
  ServiceFeeEntity,
  ServiceFeesManagementService,
  SearchParams,
  SearchWorkFeesParams
} from '../service-fees-management.service';

@Component({
  selector: 'app-work-fees-edit',
  templateUrl: './work-fees-edit.component.html',
  styleUrls: ['./work-fees-edit.component.css']
})
export class WorkFeesEditComponent implements OnInit {
  constructor(
    private globalService: GlobalService,
    private feesService: ServiceFeesManagementService,
    private routerInfo: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild('chooseProject', { static: true })
  public chooseProject: ChooseProjectComponent;

  public serviceFeeData: ServiceFeeEntity = new ServiceFeeEntity();
  public searchWorkFeesParams = new SearchWorkFeesParams();
  public project_name = '';
  public loading = false;
  public service_fee_id = '';
  public original_amount = '';
  public sale_amount = '';
  public settlement_amount = '';
  public saleAmountPriceErrors = '';
  public settlementAmountPriceErrors = '';
  private searchText$ = new Subject<any>();

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.service_fee_id = params.service_fee_id;
    });
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.feesService
        .requestServiceFeeDetailData(this.service_fee_id)
        .subscribe(
          res => {
            this.serviceFeeData = res;
            this.searchWorkFeesParams.service_fee_name = this.serviceFeeData.service_fee_name;
            this.project_name = this.serviceFeeData.project
              ? this.serviceFeeData.project.project_name
              : '';
            this.searchWorkFeesParams.project_id = this.serviceFeeData.project
              ? this.serviceFeeData.project.project_id
              : '';
            this.original_amount = this.getFeeData(
              this.serviceFeeData.original_amount
            );
            this.sale_amount = this.getFeeData(this.serviceFeeData.sale_amount);
            this.settlement_amount = this.getFeeData(
              this.serviceFeeData.settlement_amount
            );
            this.loading = true;
          },
          err => {
            this.globalService.httpErrorProcess(err);
          }
        );
    });
    if (this.service_fee_id) {
      this.searchText$.next();
    }
  }

  // 价钱数据处理
  private getFeeData(fee: number) {
    return fee || fee === 0 ? (Number(fee) / 100).toFixed(2) : '';
  }

  public onCancelBtn() {
    this.router.navigateByUrl('/service-fees-management');
  }

  private clear() {
    this.settlementAmountPriceErrors = '';
    this.saleAmountPriceErrors = '';
  }

  // 保存数据
  public onSaveFormSubmit() {
    if (Number(this.sale_amount) > Number(this.original_amount)) {
      this.clear();
      this.saleAmountPriceErrors = '销售单价不得大于原价！';
    } else if (Number(this.settlement_amount) > Number(this.sale_amount)) {
      this.clear();
      this.settlementAmountPriceErrors = '结算价不得大于销售单价！';
    } else {
      this.clear();
      this.searchWorkFeesParams.original_amount = Math.round(
        Number(this.original_amount) * 100
      );
      this.searchWorkFeesParams.sale_amount = Math.round(
        Number(this.sale_amount) * 100
      );
      this.searchWorkFeesParams.settlement_amount = Math.round(
        Number(this.settlement_amount) * 100
      );
      if (!this.service_fee_id) {
        this.feesService
          .requestAddWorkFeeData(this.searchWorkFeesParams)
          .subscribe(
            () => {
              this.globalService.promptBox.open('新建保养服务费成功！');
              timer(2000).subscribe(() =>
                this.router.navigateByUrl('/service-fees-management')
              );
            },
            err => {
              this.handleErrorFunc(err, 1);
            }
          );
      } else {
        this.feesService
          .requestUpdateWorkFeeData(
            this.searchWorkFeesParams,
            this.service_fee_id
          )
          .subscribe(
            () => {
              this.globalService.promptBox.open('编辑保养服务费成功！');
              timer(2000).subscribe(() =>
                this.router.navigateByUrl('/service-fees-management')
              );
            },
            err => {
              this.handleErrorFunc(err, 2);
            }
          );
      }
    }
  }

  // 处理错误信息
  private handleErrorFunc(err, type: number) {
    const text = type === 1 ? '新建' : '编辑';
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field =
            content.field === 'service_fee_name'
              ? '服务费名称'
              : content.field === 'project_id'
              ? '项目名称'
              : content.field === 'original_amount'
              ? '原价'
              : content.field === 'sale_amount'
              ? '销售单价'
              : content.field === 'settlement_amount'
              ? '结算价'
              : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(
              `${field}字段未填写!`,
              null,
              2000,
              '/assets/images/warning.png'
            );
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(
              `${field}输入错误`,
              null,
              2000,
              '/assets/images/warning.png'
            );
          } else {
            this.globalService.promptBox.open(
              `${text}保养服务费失败,请重试!`,
              null,
              2000,
              '/assets/images/warning.png'
            );
          }
        }
      }
    }
  }

  // 打开所属项目选择组件
  public onOpenProjectModal(): void {
    this.chooseProject.open();
  }

  // 选择所属项目回调函数
  public onSelectedProject(event: any): void {
    if (event) {
      this.searchWorkFeesParams.project_id = event.project.project_id;
      this.project_name = event.project.project_name;
    }
  }
}
