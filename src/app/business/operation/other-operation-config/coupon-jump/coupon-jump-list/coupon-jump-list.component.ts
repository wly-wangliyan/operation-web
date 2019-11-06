import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { GlobalService } from '../../../../../core/global.service';
import { CouponJumpHttpService, CouponUrlRecordEntity, SearchCouponUrlRecordParams } from '../coupon-jump-http.service';

const PageSize = 15;

@Component({
    selector: 'app-coupon-jump-list',
    templateUrl: './coupon-jump-list.component.html',
    styleUrls: ['./coupon-jump-list.component.css']
})
export class CouponJumpListComponent implements OnInit, OnDestroy {

    public noResultText = '数据加载中...';

    public pageIndex = 1;

    public searchParams: SearchCouponUrlRecordParams = new SearchCouponUrlRecordParams();

    public couponJumpList: Array<CouponUrlRecordEntity> = [];

    public currentCouponJump: CouponUrlRecordEntity = new CouponUrlRecordEntity();

    private searchText$ = new Subject<any>();

    private linkUrl: string;

    private continueRequestSubscription: Subscription;

    private get pageCount(): number {
        if (this.couponJumpList.length % PageSize === 0) {
            return this.couponJumpList.length / PageSize;
        }
        return this.couponJumpList.length / PageSize + 1;
    }

    constructor(private globalService: GlobalService,
                private couponJumpHttpService: CouponJumpHttpService) {
    }

    public ngOnInit() {
        this.searchText$.pipe(
            debounceTime(500),
            switchMap(() => this.couponJumpHttpService.requestCouponUrlRecordListData(this.searchParams)))
            .subscribe(res => {
                this.pageIndex = 1;
                this.couponJumpList = res.results;
                this.linkUrl = res.linkUrl;
                this.noResultText = '暂无数据';
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        this.searchText$.next();
    }

    public ngOnDestroy() {
        this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
    }

    // 查询按钮
    public onSearchBtnClick() {
        this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
        this.pageIndex = 1;
        this.searchText$.next();
    }

    // 翻页方法
    public onNZPageIndexChange(pageIndex: number) {
        this.pageIndex = pageIndex;
        if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
            // 当存在linkUrl并且快到最后一页了请求数据
            this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
            this.continueRequestSubscription = this.couponJumpHttpService.requestContinueCouponUrlRecordListData(this.linkUrl)
                .subscribe(res => {
                    this.couponJumpList = this.couponJumpList.concat(res.results);
                    this.linkUrl = res.linkUrl;
                }, err => {
                    this.globalService.httpErrorProcess(err);
                });
        }
    }

    // 删除某一优惠券使用跳转url记录
    public onDeleteBtnClick(data: CouponUrlRecordEntity) {
        this.globalService.confirmationBox.open('警告', '删除后将不可恢复，确认删除吗？', () => {
            this.globalService.confirmationBox.close();
            this.couponJumpHttpService.requestDeleteCouponUrlRecordData(data.coupon_url_record_id).subscribe(() => {
                this.couponJumpList = this.couponJumpList.filter(icon => icon.coupon_url_record_id !== data.coupon_url_record_id);
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        });
    }
}
