import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';
import {
    MerchantManagementEntity,
    MerchantManagementService,
    SearchParamsEntity
} from '../../../merchant-management/merchant-management.service';

@Component({
    selector: 'app-select-merchant',
    templateUrl: './select-merchant.component.html',
    styleUrls: ['./select-merchant.component.css']
})
export class SelectMerchantComponent implements OnInit, NzSearchAdapter {
    public nzSearchAssistant: NzSearchAssistant;
    public searchParams: SearchParamsEntity = new SearchParamsEntity();
    public selectedMerchant: MerchantManagementEntity = new MerchantManagementEntity(); // 勾选的商品

    @Output() public selectedMerchantEvent = new EventEmitter(); // 发送选中的商品信息
    constructor(
        private globalService: GlobalService,
        private merchantManagementService: MerchantManagementService
    ) {
    }

    ngOnInit() {
        this.nzSearchAssistant = new NzSearchAssistant(this, 5);
    }

    /**
     * 打开
     * @param selectedMerchant
     */
    public open(selectedMerchant: MerchantManagementEntity) {
        this.searchParams = new SearchParamsEntity();
        this.nzSearchAssistant.nzData = [];
        this.selectedMerchant = selectedMerchant.clone();
        timer(0).subscribe(() => {
            $('#chooseMerchantModal').modal();
            this.nzSearchAssistant.submitSearch(true);
        });
    }

    // 勾选商户
    public onItemChecked(merchant: MerchantManagementEntity, checked: boolean): void {
        this.selectedMerchant = checked ? merchant.clone() : new MerchantManagementEntity();
    }

    // 确定
    public onCheckClick() {
        if (this.selectedMerchant.merchant_id) {
            if (!this.selectedMerchant.consult_info || !this.selectedMerchant.consult_info.length) {
                this.globalService.promptBox.open('该商户未添加联系电话！', null, 2000, null, false);
                return;
            }
        }
        $('#chooseMerchantModal').modal('hide');
        this.selectedMerchantEvent.emit(this.selectedMerchant);
    }

    /** 翻页清除选中项 */
    public onPageSelectd(event: any) {
        this.nzSearchAssistant.pageSelected(event);
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.merchantManagementService.requestMerchantListData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.merchantManagementService.continueMerchantListData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(): any {
    }

}
