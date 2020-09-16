import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    DistributionActivitiesService,
    SearchParamsBeianMerchantsEntity,
    BeianMerchantEntity, SearchParamsActivityBusinessListEntity, ActivityBusinessDailyEntity
} from '../../distribution-activities.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../../core/global.service';
import { EntityBase } from '../../../../../../../utils/z-entity';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-select-business',
    templateUrl: './select-business.component.html',
    styleUrls: ['./select-business.component.css']
})
export class SelectBusinessComponent implements NzSearchAdapter {
    public searchParams: SearchParamsBeianMerchantsEntity = new SearchParamsBeianMerchantsEntity();
    public nzSearchAssistant: NzSearchAssistant;
    public selectedBusinessList: Array<SelectedBusinessItem> = [];
    public isHasData = false; // 是否有已选商家数据
    public noResultText = '请选择业务';
    private activity_id = '';
    @Output() public selectBusiness = new EventEmitter();

    constructor(private globalService: GlobalService,
                private distributionActivitiesService: DistributionActivitiesService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
    }

    /**
     * 选择商家
     * @param event
     * @param beianMerchant
     */
    public onClickChecked(event, beianMerchant: BeianMerchantEntity) {
        beianMerchant.isChecked = event;
        const index = this.selectedBusinessList.findIndex(item => item.type === beianMerchant.merchant_type);
        const businessIndex = this.selectedBusinessList[index].businessList.findIndex(item => item.merchant_id === beianMerchant.merchant_id);
        if (beianMerchant.isChecked) {
            businessIndex < 0 && this.selectedBusinessList[index].businessList.push(beianMerchant);
        } else {
            businessIndex > -1 && this.selectedBusinessList[index].businessList.splice(businessIndex, 1);
        }
        let isHasData = false;
        this.selectedBusinessList.forEach(item => {
            if (item.businessList.length) {
                isHasData = true;
            }
        });
        this.isHasData = isHasData;
    }

    public open(activity_id: string) {
        this.activity_id = activity_id;
        this.searchParams = new SearchParamsBeianMerchantsEntity();
        this.nzSearchAssistant.nzData = [];
        const searchParamsActivityBusiness: SearchParamsActivityBusinessListEntity = new SearchParamsActivityBusinessListEntity();
        this.noResultText = '请选择业务';
        this.selectedBusinessList = [];
        const temp1 = new SelectedBusinessItem();
        temp1.type = 1;
        this.selectedBusinessList.push(temp1);
        const temp2 = new SelectedBusinessItem();
        temp2.type = 2;
        this.selectedBusinessList.push(temp2);
        const temp3 = new SelectedBusinessItem();
        temp3.type = 3;
        this.selectedBusinessList.push(temp3);
        this.isHasData = false;
        this.requestActivityBusinessListData(searchParamsActivityBusiness);
        $('#selectBusinessModal').modal();
    }

    /**
     * 移除
     * @param type
     * @param index
     * @param merchant_id
     */
    public onClickDeleteSelectedBusiness(type: number, index: number, merchant_id: string) {
        const _index = this.selectedBusinessList.findIndex(item => item.type === type);
        this.selectedBusinessList[_index].businessList.splice(index, 1);
        const beianMerchant: BeianMerchantEntity = this.nzSearchAssistant.nzData.find(item => item.merchant_id === merchant_id);
        beianMerchant && (beianMerchant.isChecked = false);
        let isHasData = false;
        this.selectedBusinessList.forEach(item => {
            if (item.businessList.length) {
                isHasData = true;
            }
        });
        this.isHasData = isHasData;
    }

    /**
     * 获取选择的商家列表
     */
    public get selectedBusinesses(): Array<BeianMerchantEntity> {
        let businessList = [];
        this.selectedBusinessList.forEach(item => {
            businessList = [...businessList, ...item.businessList];
        });
        return businessList;
    }

    /**
     * 保存
     */
    public onClickSaveBusiness() {
        this.distributionActivitiesService.requestAddActivityMerchantsData(this.selectedBusinesses, this.activity_id).subscribe(data => {
            $('#selectBusinessModal').modal('hide');
            this.globalService.promptBox.open('选择商家成功！', () => {
                this.selectBusiness.emit();
            });
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        this.noResultText = '数据加载中...';
        return this.distributionActivitiesService.requestBeianMerchantsData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.distributionActivitiesService.continueBeianMerchantsData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        if (!this.searchParams.merchant_type) {
            this.globalService.promptBox.open('请选择业务！', null, 2000, null, false);
            return false;
        }
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.noResultText = '暂无数据';
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(results: Array<BeianMerchantEntity>): any {
        this.noResultText = '暂无数据';
        this.selectedBusinessList.forEach(item => {
            item.businessList.forEach(business => {
                const beianMerchant = results.find(result => result.merchant_id === business.merchant_id);
                beianMerchant && (beianMerchant.isChecked = true);
            });
        });
    }

    /**
     * 递归取所有商家
     * @param searchParams
     * @param targetArr
     * @private
     */
    private requestActivityBusinessListData(searchParams, targetArr?: Array<ActivityBusinessDailyEntity>) {
        if (isNullOrUndefined(targetArr)) {
            targetArr = [];
        }
        this.distributionActivitiesService.requestActivityBusinessListData(searchParams, this.activity_id).subscribe(data => {
            data.results.forEach(item => {
                targetArr.push(item);
            });
            if (data.linkUrl) {
                searchParams.page_num += 1;
                this.requestActivityBusinessListData(searchParams, targetArr);
            } else {
                const carLineList = targetArr.filter(item => item.merchant_type === 1);
                if (carLineList.length > 0) {
                    this.isHasData = true;
                    this.selectedBusinessList[0].businessList = carLineList.map(item => new BeianMerchantEntity(item));
                }
                const carMaintenanceList = targetArr.filter(item => item.merchant_type === 2);
                if (carMaintenanceList.length > 0) {
                    this.isHasData = true;
                    this.selectedBusinessList[1].businessList = carMaintenanceList.map(item => new BeianMerchantEntity(item));
                }
                const parkingList = targetArr.filter(item => item.merchant_type === 3);
                if (parkingList.length > 0) {
                    this.isHasData = true;
                    this.selectedBusinessList[2].businessList = parkingList.map(item => new BeianMerchantEntity(item));
                }
            }
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}

class SelectedBusinessItem extends EntityBase {
    public type: number = undefined;
    public businessList: Array<BeianMerchantEntity> = [];
}
