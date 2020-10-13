import { Component, OnInit } from '@angular/core';
import {
    IntegralMallHttpService,
    SearchIntegralCommodityParams,
    IntegralCommodityEntity, EditCommodityParams
} from '../integral-mall-http.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { HttpErrorEntity } from '../../../../../core/http.service';
import {
    CommodityEntity,
    CommoditySearchParams,
    GoodsManagementHttpService, SpecificationParams
} from '../../../../mall/goods-management/goods-management-http.service';
import { isNullOrUndefined } from 'util';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-commodity-list',
    templateUrl: './commodity-list.component.html',
    styleUrls: ['./commodity-list.component.css']
})
export class CommodityListComponent implements NzSearchAdapter, OnInit {
    public nzSearchAssistant: NzSearchAssistant;
    public searchParams = new SearchIntegralCommodityParams();
    public start_time: any = '';
    public end_time: any = '';
    public commoditySearchParams: CommoditySearchParams = new CommoditySearchParams();
    public commodityList: Array<CommodityEntity> = []; // 产品列表
    public sourceCommodityList: Array<CommodityEntity> = []; // 产品列表
    public selectedCommodity: CommodityEntity = new CommodityEntity(); // 选择的产品
    public selectedSpecificationId = '';
    public searchText$ = new Subject<any>();

    constructor(
        public globalService: GlobalService,
        private goodsManagementHttpService: GoodsManagementHttpService,
        private integralMallHttpService: IntegralMallHttpService
    ) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    public ngOnInit() {
        this.searchText$.pipe(debounceTime(500)).subscribe(() => {
            const commodity_name = this.commoditySearchParams.commodity_name;
            if (commodity_name) {
                this.commodityList = this.sourceCommodityList.filter(item => item.commodity_name.indexOf(commodity_name) > -1);
            } else {
                this.commodityList = this.sourceCommodityList.filter(item => item);
            }
        });
    }

    /**
     * 创建商品
     */
    public onClickCreateProduct() {
        this.commoditySearchParams = new CommoditySearchParams();
        $('#productCreatePromptDiv').modal('show');
        this.commodityList = [];
        this.sourceCommodityList = [];
        this.selectedCommodity = new CommodityEntity();
        this.selectedSpecificationId = '';
        this.requestCommodityListData(this.commoditySearchParams);
    }

    /**
     * 添加产品
     */
    public onCreateProduct() {
        const _selectedCommodity = new EditCommodityParams(this.selectedCommodity);
        const selectedCommodity = _selectedCommodity.clone();
        selectedCommodity.buy_max_num = _selectedCommodity.buy_max_num ? _selectedCommodity.buy_max_num : -1;
        selectedCommodity.people_buy_max_num = _selectedCommodity.people_buy_max_num ? _selectedCommodity.people_buy_max_num : -1;
        selectedCommodity.day_buy_max_num = _selectedCommodity.day_buy_max_num ? _selectedCommodity.day_buy_max_num : -1;
        this.integralMallHttpService.requestAddCommodityData(selectedCommodity).subscribe(() => {
            this.requestModifyCommoditySpecification();
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                    for (const content of error.errors) {
                        if (content.field === 'commodity_name' && content.code === 'missing_field') {
                            this.globalService.promptBox.open('产品名称未填写！', null, 2000, null, false);
                        } else if (content.field === 'commodity_name' && content.code === 'invalid') {
                            this.globalService.promptBox.open('产品名称错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'subtitle' && content.code === 'missing_field') {
                            this.globalService.promptBox.open('副标题未填写！', null, 2000, null, false);
                        } else if (content.field === 'subtitle' && content.code === 'invalid') {
                            this.globalService.promptBox.open('副标题错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'sort_id' && content.code === 'missing_field') {
                            this.globalService.promptBox.open('所属分类未选择！', null, 2000, null, false);
                        } else if (content.field === 'sort_id' && content.code === 'invalid') {
                            this.globalService.promptBox.open('所属分类错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'cover_image' && content.code === 'missing_field') {
                            this.globalService.promptBox.open('封面图片未选择！', null, 2000, null, false);
                        } else if (content.field === 'cover_image' && content.code === 'invalid') {
                            this.globalService.promptBox.open('封面图片错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'commodity_images' && content.code === 'missing_field') {
                            this.globalService.promptBox.open('产品图片未选择！', null, 2000, null, false);
                        } else if (content.field === 'commodity_images' && content.code === 'invalid') {
                            this.globalService.promptBox.open('产品图片错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'commodity_videos' && content.code === 'missing_field') {
                            this.globalService.promptBox.open('视频未选择！', null, 2000, null, false);
                        } else if (content.field === 'commodity_videos' && content.code === 'invalid') {
                            this.globalService.promptBox.open('视频错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'commodity_description' && content.code === 'missing_field') {
                            this.globalService.promptBox.open('产品描述未填写！', null, 2000, null, false);
                        } else if (content.field === 'commodity_description' && content.code === 'invalid') {
                            this.globalService.promptBox.open('产品描述错误或无效！', null, 2000, null, false);
                        }
                    }
                }
            }
        });
    }

    /**
     * 选择商品
     * @param isChecked
     * @param temp
     */
    public onClickChecked(isChecked: boolean, temp: CommodityEntity) {
        this.commodityList.forEach(item => item.isChecked = false);
        temp.isChecked = isChecked;
        this.selectedCommodity = isChecked ? (temp.clone()) : new CommodityEntity();
    }

    // 置顶商品
    public onTopCommodityClick(commodity_id: string): void {
        this.integralMallHttpService.requestTopCommodity(commodity_id)
            .subscribe(res => {
                this.nzSearchAssistant.submitSearch(true);
                this.globalService.promptBox.open('置顶成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`置顶失败，请刷新重试！`, null, 2000, null, false);
                }
            });
    }


    /** 删除商品 */
    public onDeleteCommodityClick(commodity_id: string): void {
        this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
            this.globalService.confirmationBox.close();
            this.integralMallHttpService.requestDeleteCommodityData(commodity_id)
                .subscribe(res => {
                    this.nzSearchAssistant.submitSearch(true);
                    this.globalService.promptBox.open('删除成功');
                }, err => {
                    if (!this.globalService.httpErrorProcess(err)) {
                        this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                    }
                });
        });
    }

    // 变更销售状态
    public onChangeSwitchStatus(data: IntegralCommodityEntity): void {
        const swith_status = data.status === 1 ? 2 : 1;
        const tipMsg = swith_status === 1 ? '上架' : '下架';
        this.integralMallHttpService.requestChangeCommodityStatus(data.commodity_id, swith_status).subscribe(() => {
            this.nzSearchAssistant.submitSearch(true);
            this.globalService.promptBox.open(`${tipMsg}成功`);
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                    for (const content of error.errors) {
                        if (content.field === 'status' && content.code === 'missing_field') {
                            this.globalService.promptBox.open(`参数缺失，无法${tipMsg}!`, null, 2000, null, false);
                        } else if (content.field === 'status' && content.code === 'invalid') {
                            this.globalService.promptBox.open(`参数不合法，无法${tipMsg}!`, null, 2000, null, false);
                        } else {
                            this.globalService.promptBox.open(`${tipMsg}失败！`, null, 2000, null, false);
                        }
                    }
                }
            }
        });
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.integralMallHttpService.requestIntegralCommodityListData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.integralMallHttpService.continueIntegralCommodityData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        const cTime = new Date().getTime() / 1000;
        const sTime = this.start_time ? ((new Date(this.start_time).setSeconds(0, 0) / 1000)) : 0;
        const eTime = this.end_time ? ((new Date(this.end_time).setSeconds(0, 0) / 1000)) : cTime;
        if (sTime > eTime) {
            this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
            return false;
        }
        this.searchParams.section = `${sTime},${eTime}`;
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(): any {
    }

    // 开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
    };

    // 结束时间的禁用部分
    public disabledEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
    };

    /**
     * 添加商品对应的规格
     * @private
     */
    private requestModifyCommoditySpecification() {
        const specifications = this.selectedCommodity.specifications.filter(item => {
            item.specification_id === this.selectedSpecificationId;
        });
        const specificationParams = new SpecificationParams();
        specificationParams.specification_objs = specifications;
        this.integralMallHttpService.requestModifyCommoditySpecificationData(this.selectedCommodity.commodity_id, specificationParams).subscribe(() => {
            this.globalService.promptBox.open('新建商品成功', () => {
                this.nzSearchAssistant.submitSearch(true);
            });
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

                    for (const content of error.errors) {
                        if (content.field === 'specification_objs' && content.code === 'invalid') {
                            this.globalService.promptBox.open('产品规格对象列表错误或无效！', null, 2000, null, false);
                        } else if (content.field === 'delete_specification_ids' && content.code === 'invalid') {
                            this.globalService.promptBox.open('删除产品规格参数错误或无效！', null, 2000, null, false);
                        } else if (content.resource === 'specifications' && content.code === 'errors') {
                            this.globalService.promptBox.open('产品规格保存失败，请重新编辑保存！', null, 2000, null, false);
                        }
                    }
                }
            }
        });
    }

    /**
     * 递归取所有商品
     * @param searchParams
     * @param targetArr
     * @private
     */
    private requestCommodityListData(searchParams: CommoditySearchParams, targetArr?: Array<CommodityEntity>) {
        if (isNullOrUndefined(targetArr)) {
            targetArr = [];
        }
        this.goodsManagementHttpService.requestCommodityListData(searchParams).subscribe(data => {
            data.results.forEach(item => {
                targetArr.push(item);
            });
            if (data.linkUrl) {
                searchParams.page_num += 1;
                this.requestCommodityListData(searchParams, targetArr);
            } else {
                this.commodityList = targetArr.filter(item => (item.commodity_type !== 2) || (item.commodity_type === 2 && item.validity_type === 1));
                this.sourceCommodityList = targetArr.filter(item => (item.commodity_type !== 2) || (item.commodity_type === 2 && item.validity_type === 1));
            }
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}
