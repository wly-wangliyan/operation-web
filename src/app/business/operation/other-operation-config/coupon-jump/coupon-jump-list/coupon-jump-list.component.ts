import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs/index';
import { GlobalService } from '../../../../../core/global.service';
import { CouponJumpHttpService, SearchCouponParams } from '../coupon-jump-http.service';

const PageSize = 15;

@Component({
    selector: 'app-coupon-jump-list',
    templateUrl: './coupon-jump-list.component.html',
    styleUrls: ['./coupon-jump-list.component.css']
})
export class CouponJumpListComponent implements OnInit {

    public noResultText = '数据加载中...';

    public pageIndex = 1;

    public searchParams: SearchCouponParams = new SearchCouponParams();

    public couponJumpList: Array<any> = [];

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
                private activatedRoute: ActivatedRoute,
                private couponJumpHttpService: CouponJumpHttpService) {
    }

    public ngOnInit() {
    }

    // 翻页方法
    public onNZPageIndexChange(pageIndex: number) {
        // this.pageIndex = pageIndex;
        // if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
        //     // 当存在linkUrl并且快到最后一页了请求数据
        //     this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
        //     this.continueRequestSubscription = this.versionManagementService.continueVersionList(this.linkUrl).subscribe(res => {
        //         this.versionList = this.versionList.concat(res.results);
        //         this.linkUrl = res.linkUrl;
        //     }, err => {
        //         this.globalService.httpErrorProcess(err);
        //     });
        // }
    }
}
