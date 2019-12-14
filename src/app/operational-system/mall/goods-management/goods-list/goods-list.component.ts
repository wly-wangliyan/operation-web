import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { differenceInCalendarDays } from 'date-fns';
import { HttpErrorEntity } from '../../../../core/http.service';
import { GlobalService } from '../../../../core/global.service';
import {
    CommodityEntity,
    CommodityOperationParams,
    CommoditySearchParams,
    GoodsManagementHttpService
} from '../goods-management-http.service';

const PageSize = 15;

@Component({
    selector: 'app-goods-list',
    templateUrl: './goods-list.component.html',
    styleUrls: ['./goods-list.component.css']
})
export class GoodsListComponent implements OnInit, OnDestroy {

    public searchParams: CommoditySearchParams = new CommoditySearchParams(); // 条件筛选

    public pageIndex = 1; // 当前页码

    public noResultText = '数据加载中...';

    public saleStatus = [1, 2]; // 销售状态 1:销售中 2:已下架

    public sale_status = ''; // 销售状态

    public start_time = ''; // 上架开始时间

    public end_time = ''; // 上架结束时间

    public commodityList: Array<CommodityEntity> = []; // 产品列表

    private searchText$ = new Subject<any>();

    private linkUrl: string; // 分页url

    private requestSubscription: Subscription; // 获取数据

    private continueRequestSubscription: Subscription; // 分页获取数据

    private get pageCount(): number {
        if (this.commodityList.length % PageSize === 0) {
            return this.commodityList.length / PageSize;
        }
        return this.commodityList.length / PageSize + 1;
    }

    constructor(public globalService: GlobalService,
                private goodsManagementHttpService: GoodsManagementHttpService) {
    }

    public ngOnInit() {
        // 定义查询延迟时间
        this.searchText$.pipe(debounceTime(500)).subscribe(() => {
            // 获取商品列表
            this.requestSubscription = this.goodsManagementHttpService.requestCommodityListData(this.searchParams)
                .subscribe(res => {
                    this.commodityList = res.results;
                    this.linkUrl = res.linkUrl;
                    this.pageIndex = 1;
                    this.noResultText = '暂无数据';
                }, err => {
                    this.pageIndex = 1;
                    this.noResultText = '暂无数据';
                    this.globalService.httpErrorProcess(err);
                });
        });
        this.searchText$.next();
    }

    public ngOnDestroy() {
        this.requestSubscription && this.requestSubscription.unsubscribe();
        this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    }

    // 修改销售状态
    public onChangeSalesStatus(event: any) {
        this.searchParams.sales_status = event.target.value ? Number(event.target.value) : null;
    }

    // 上架开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        if (differenceInCalendarDays(startValue, new Date()) > 0) {
            return true;
        } else if (!startValue || !this.end_time) {
            return false;
        } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_time).setHours(0, 0, 0, 0)) {
            return true;
        } else {
            return false;
        }
    }

    // 上架结束时间的禁用部分
    public disabledEndTime = (endValue: Date): boolean => {
        if (differenceInCalendarDays(endValue, new Date()) > 0) {
            return true;
        } else if (!endValue || !this.start_time) {
            return false;
        } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.start_time).setHours(0, 0, 0, 0)) {
            return true;
        } else {
            return false;
        }
    }

    // 点击查询
    public onSearchClickBtn() {
        if (this.generateAndCheckParamsValid()) {
            this.searchText$.next();
        }
    }

    // 翻页
    public onNZPageIndexChange(pageIndex: number) {
        this.pageIndex = pageIndex;
        if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
            // 当存在linkUrl并且快到最后一页了请求数据
            this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
            this.continueRequestSubscription = this.goodsManagementHttpService.requestContinueCommodityListData(this.linkUrl)
                .subscribe(res => {
                    this.commodityList = this.commodityList.concat(res.results);
                    this.linkUrl = res.linkUrl;
                }, err => {
                    this.globalService.httpErrorProcess(err);
                });
        }
    }

    // 商品上架/下架
    public onChangeCommodityOperationClick(data: CommodityEntity) {
        const commodityOperationParams = new CommodityOperationParams();
        commodityOperationParams.operation = 1;
        let successMsg = '上架成功';
        let failMsg = '上架失败';
        if (data.sales_status === this.saleStatus[0]) {
            commodityOperationParams.operation = 2;
            successMsg = '下架成功';
            failMsg = '下架失败';
        }

        this.goodsManagementHttpService.requestCommodityOperationData(data.commodity_id, commodityOperationParams).subscribe(() => {
            this.globalService.promptBox.open(successMsg, () => {
                this.searchText$.next();
            });
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

                    for (const content of error.errors) {
                        if (content.field === 'operation' && content.code === 'missing_field') {
                            failMsg = data.sales_status === this.saleStatus[0] ? '下架参数缺失！' : '上架参数缺失！';
                        } else if (content.field === 'operation' && content.code === 'invalid') {
                            failMsg = data.sales_status === this.saleStatus[0] ? '下架参数错误或无效！' : '上架参数错误或无效！';
                        } else if (content.resource === 'operation' && content.code === 'not_allow') {
                            failMsg = '不允许上架！';
                        } else if (content.resource === 'commodity' && content.code === 'not_operation') {
                            failMsg = '此商品供应商不在营业中，不能上架！';
                        }
                    }
                }
                this.searchText$.next();
                this.globalService.promptBox.open(failMsg, null, 2000, null, false);
            }
        });
    }

    // 删除商品
    public onDeleteCommodityClick(data: CommodityEntity) {
        this.globalService.confirmationBox.open('删除', '删除后将不可恢复，确认删除吗？', () => {
            this.globalService.confirmationBox.close();
            this.goodsManagementHttpService.requestDeleteCommodityData(data.commodity_id).subscribe(() => {
                this.globalService.promptBox.open('删除成功', () => {
                    this.commodityList = this.commodityList.filter(commodity => commodity.commodity_id !== data.commodity_id);
                });
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    if (err.status === 404) {
                        this.globalService.promptBox.open('请求地址错误！', null, 2000, null, false);
                    }
                }
            });
        });
    }

    // 生成并检查参数有效性
    private generateAndCheckParamsValid(): boolean {
        const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
            new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
        const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
            new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;

        if (sTimestamp > eTimeStamp) {
            this.globalService.promptBox.open('上架开始时间不能大于结束时间！', null, 2000, null, false);
            return false;
        }

        if (this.start_time || this.end_time) {
            this.searchParams.created_time = `${sTimestamp},${eTimeStamp}`;
        } else {
            this.searchParams.created_time = null;
        }
        return true;
    }
}
