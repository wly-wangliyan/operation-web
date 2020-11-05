import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import {
    ServiceFeeEntity,
    ServiceFeesManagementService,
    SearchFeeParams,
    RescueCostConfigureEntity,
} from '../service-fees-management.service';
import { HttpErrorEntity } from '../../../core/http.service';
import { DateFormatHelper, TimeItem } from '../../../../utils/date-format-helper';

@Component({
    selector: 'app-rescue-fees-edit',
    templateUrl: './rescue-fees-edit.component.html',
    styleUrls: ['./rescue-fees-edit.component.css']
})
export class RescueFeesEditComponent implements OnInit {
    // public serviceFeeData: ServiceFeeEntity = new ServiceFeeEntity();
    public service_fee_name = '';
    public loading = false;
    // public balance_initial_price = '';
    // public balance_current_price = '';
    // public prepay_initial_price = '';
    // public prepay_current_price = '';
    // public balanceCurrentPriceErrors = '';
    // public prepayCurrentPriceErrors = '';
    public rescueFeeList: Array<RescueCostConfigureEntity> = [];
    public telephoneList: Array<TelephoneItem> = [];
    private service_fee_id: string;

    constructor(private globalService: GlobalService, private feesService: ServiceFeesManagementService,
                private routerInfo: ActivatedRoute, private router: Router) {
        this.routerInfo.params.subscribe((params: Params) => {
            this.service_fee_id = params.service_fee_id;
        });
    }

    public ngOnInit() {
        if (this.service_fee_id) {
            this.requestServiceFeeDetail();
        }
    }

    /**
     * 添加
     * @param type
     */
    public onClickAdd(type: number) {
        if (type === 1) {
            const first = this.rescueFeeList[this.rescueFeeList.length - 1];
            const rescueCostConfigure = new RescueCostConfigureEntity();
            rescueCostConfigure.startTime = first.endTime;
            this.rescueFeeList.push(rescueCostConfigure);
        } else {
            this.telephoneList.push(new TelephoneItem());
        }
    }

    /**
     * 删除
     * @param type
     * @param index
     */
    public onClickDelete(type: number, index: number) {
        if (type === 1) {
            if (index === 0) {
                const next = this.rescueFeeList[index + 1];
                next.startTime = new TimeItem();
            } else if (index === this.rescueFeeList.length - 1) {
                const last = this.rescueFeeList[index - 1];
                last.endTime = new TimeItem('24');
            } else {
                const last = this.rescueFeeList[index - 1];
                const next = this.rescueFeeList[index + 1];
                last.endTime = next.startTime;
            }
            this.rescueFeeList.splice(index, 1);
        } else {
            this.telephoneList.splice(index, 1);
        }
    }

    public onCancelBtn() {
        this.router.navigateByUrl('/service-fees-management');
    }

    // 保存数据
    public onSaveFormSubmit() {
        let flagError = false;
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < this.rescueFeeList.length; index++) {
            const temp = this.rescueFeeList[index];
            temp.start_time = DateFormatHelper.getSecondTimeSum(temp.startTime, 'mm');
            temp.end_time = DateFormatHelper.getSecondTimeSum(temp.endTime, 'mm');
            if (Number(temp.balance_current_price) > Number(temp.balance_initial_price)) {
                temp.balanceCurrentPriceErrors = '尾款现价不得大于尾款原价！';
                temp.prepayCurrentPriceErrors = '';
                temp.timeErrors = '';
                return flagError = true;
            } else if (Number(temp.prepay_current_price) > Number(temp.prepay_initial_price)) {
                temp.prepayCurrentPriceErrors = '预付现价不得大于预付原价！';
                temp.balanceCurrentPriceErrors = '';
                temp.timeErrors = '';
                return flagError = true;
            } else if (Number(temp.start_time) >= Number(temp.end_time)) {
                temp.timeErrors = '开始时间不得大于等于结束时间！';
                temp.prepayCurrentPriceErrors = '';
                temp.balanceCurrentPriceErrors = '';
                return flagError = true;
            } else {
                temp.prepayCurrentPriceErrors = '';
                temp.balanceCurrentPriceErrors = '';
                temp.timeErrors = '';
            }
        }
        if (!flagError) {
            const searchFeeParams: SearchFeeParams = new SearchFeeParams();
            searchFeeParams.rescue_cost_configure = this.rescueFeeList;
            searchFeeParams.rescue_person_telephone = this.telephoneList.map(item => item.telephone).join(',');
            this.feesService.requestUpdateFeeData(searchFeeParams, this.service_fee_id, 2).subscribe(() => {
                this.globalService.promptBox.open('编辑救援费成功！');
                timer(2000).subscribe(() => this.router.navigateByUrl('/service-fees-management'));
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

    /**
     * 获取产品配置详情
     * @private
     */
    private requestServiceFeeDetail() {
        this.feesService.requestServiceFeeDetailData(this.service_fee_id).subscribe(res => {
            this.service_fee_name = res.service_fee_name;
            if (res.rescue_cost_configure.length) {
                this.rescueFeeList = res.rescue_cost_configure.map(item => new RescueCostConfigureEntity(item));
            } else {
                const rescueCostConfigure = new RescueCostConfigureEntity();
                this.rescueFeeList.push(rescueCostConfigure);
            }
            if (res.rescue_person_telephone) {
                const telephoneList = res.rescue_person_telephone.split(',');
                this.telephoneList = telephoneList.map(item => new TelephoneItem(item));
            }
            // this.serviceFeeData = res;
            // this.balance_initial_price = this.getFeeData(this.serviceFeeData.balance_initial_price);
            // this.balance_current_price = this.getFeeData(this.serviceFeeData.balance_current_price);
            // this.prepay_initial_price = this.getFeeData(this.serviceFeeData.prepay_initial_price);
            // this.prepay_current_price = this.getFeeData(this.serviceFeeData.prepay_current_price);
            this.loading = true;
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

}

class TelephoneItem {
    public telephone: string = undefined;
    public timeStamp: number = undefined;

    constructor(telephone?: string) {
        this.telephone = telephone || '';
        this.timeStamp = GlobalService.Instance.timeStamp;
    }
}
