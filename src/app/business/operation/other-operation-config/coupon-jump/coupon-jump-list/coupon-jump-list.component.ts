import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { GlobalService } from '../../../../../core/global.service';
import { ValidateHelper } from '../../../../../../utils/validate-helper';
import { CouponJumpHttpService, CouponUrlRecordEntity, SearchCouponUrlRecordParams } from '../coupon-jump-http.service';
import { HttpErrorEntity } from "../../../../../core/http.service";
import { isNullOrUndefined } from "util";

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

    public currentCouponUrlCanBeShared: string;

    public couponUrlErrMsg: string;

    private searchText$ = new Subject<any>();

    private linkUrl: string;

    private submitRequestSubscription: any;

    private continueRequestSubscription: Subscription;

    private get pageCount(): number {
        if (this.couponJumpList.length % PageSize === 0) {
            return this.couponJumpList.length / PageSize;
        }
        return this.couponJumpList.length / PageSize + 1;
    }

    @ViewChild('couponUrlRecordPromptDiv', {static: true}) public couponUrlRecordPromptDiv: ElementRef;

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
        this.submitRequestSubscription = null;
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

    // 点击添加/编辑打开优惠券使用跳转url记录模态框
    public onAddOrEditCouponUrlRecordModal(data?: CouponUrlRecordEntity) {
        this.currentCouponUrlCanBeShared = '';
        this.couponUrlErrMsg = '';
        this.submitRequestSubscription = null;
        this.currentCouponJump = new CouponUrlRecordEntity();
        if (data) {
            this.currentCouponJump = data.clone();
        }

        if (!isNullOrUndefined(this.currentCouponJump.can_be_shared)) {
            this.currentCouponUrlCanBeShared = this.currentCouponJump.can_be_shared ? 'true' : 'false';
        }

        timer().subscribe(() => {
            $(this.couponUrlRecordPromptDiv.nativeElement).modal('show');
        });
    }

    // 键盘按下事件
    public onKeydownEvent(event: any) {
        if (event.keyCode === 13) {
            this.onAddOrEditCouponUrlRecordSubmit();
            return false;
        }
    }

    // 修改是否可分享参数
    public onChangeShareClick(isShare: boolean) {
        this.currentCouponUrlCanBeShared = isShare ? 'true' : 'false';
        this.currentCouponJump.can_be_shared = isShare;
    }

    // 添加/编辑优惠券使用跳转url记录数据提交
    public onAddOrEditCouponUrlRecordSubmit() {
        if (this.submitRequestSubscription) {
            return;
        }
        if (!ValidateHelper.checkUrl(this.currentCouponJump.coupon_url)) {
            this.couponUrlErrMsg = '链接格式错误，请重新输入！';
        } else {
            if (this.currentCouponJump.coupon_url_record_id) {
                this.requestEditCouponUrlRecord();
            } else {
                this.requestAddCouponUrlRecord();
            }
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

    // 添加优惠券使用跳转url记录
    private requestAddCouponUrlRecord() {
        const addCouponUrlRecordParams = new CouponUrlRecordEntity(this.currentCouponJump);

        this.submitRequestSubscription = this.couponJumpHttpService.requestAddCouponUrlRecordData(addCouponUrlRecordParams)
            .subscribe(() => {
                this.successProcess('添加成功！');
            }, err => {
                this.errorProcess(err);
            });
    }

    // 编辑优惠券使用跳转url记录
    private requestEditCouponUrlRecord() {
        const editCouponUrlRecordParams = new CouponUrlRecordEntity(this.currentCouponJump);

        this.submitRequestSubscription = this.couponJumpHttpService.requestEditCouponUrlRecordData(
            this.currentCouponJump.coupon_url_record_id, editCouponUrlRecordParams)
            .subscribe(() => {
                this.successProcess('修改成功！');
            }, err => {
                this.errorProcess(err);
            });
    }

    // 请求成功处理
    private successProcess(msg: string) {
        this.submitRequestSubscription = null;
        $(this.couponUrlRecordPromptDiv.nativeElement).modal('hide');

        this.globalService.promptBox.open(msg, () => {
            this.pageIndex = 1;
            this.searchText$.next();
        });
    }

    // 请求错误处理
    private errorProcess(err: any) {
        this.submitRequestSubscription = null;
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

                for (const content of error.errors) {
                    if (content.field === 'coupon_name' && content.code === 'missing_field') {
                        this.globalService.promptBox.open('优惠券名称未填写！', null, 2000, null, false);
                    } else if (content.field === 'coupon_name' && content.code === 'invalid') {
                        this.globalService.promptBox.open('优惠券名称错误或无效！', null, 2000, null, false);
                    } else if (content.field === 'coupon_template_id' && content.code === 'missing_field') {
                        this.globalService.promptBox.open('优惠券模板id未填写！', null, 2000, null, false);
                    } else if (content.field === 'coupon_template_id' && content.code === 'invalid') {
                        this.globalService.promptBox.open('优惠券模板id错误或无效！', null, 2000, null, false);
                    } else if (content.field === 'url_type' && content.code === 'missing_field') {
                        this.globalService.promptBox.open('url类型未选择！', null, 2000, null, false);
                    } else if (content.field === 'url_type' && content.code === 'invalid') {
                        this.globalService.promptBox.open('url类型错误或无效！', null, 2000, null, false);
                    } else if (content.field === 'coupon_url' && content.code === 'missing_field') {
                        this.globalService.promptBox.open('使用页url未填写！', null, 2000, null, false);
                    } else if (content.field === 'coupon_url' && content.code === 'invalid') {
                        this.globalService.promptBox.open('使用页url错误或无效！', null, 2000, null, false);
                    } else if (content.field === 'can_be_shared' && content.code === 'missing_field') {
                        this.globalService.promptBox.open('页面是否可分享未选择！', null, 2000, null, false);
                    } else if (content.field === 'can_be_shared' && content.code === 'invalid') {
                        this.globalService.promptBox.open('页面是否可分享错误或无效！', null, 2000, null, false);
                    } else if (content.field === 'coupon_template_id' && content.code === 'already_exist') {
                        this.globalService.promptBox.open('优惠券模板id已存在！', null, 2000, null, false);
                    }
                }
            }
        }
    }
}
