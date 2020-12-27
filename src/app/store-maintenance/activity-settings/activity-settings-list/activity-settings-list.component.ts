import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityEntity, ActivitySettingsService, SearchParams } from '../activity-settings.service';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { AccessoryBrandEntity } from '../../brand-management/brand-management-http.service';
import { BrandEditComponent } from '../../brand-management/brand-list/brand-edit/brand-edit.component';
import { WashCarEditComponent } from './wash-car-edit/wash-car-edit.component';
import { HttpErrorEntity } from '../../../core/http.service';

const PageSize = 15;

export class ActiviyTabItem {
    key: number;
    value: string;
}

@Component({
    selector: 'app-activity-settings-list',
    templateUrl: './activity-settings-list.component.html',
    styleUrls: ['./activity-settings-list.component.css',
        '../../../../assets/less/tab-bar-list.less']
})
export class ActivitySettingsListComponent implements OnInit {

    public activityList: Array<ActivityEntity> = [];
    public searchParams = new SearchParams();
    public tabs: Array<ActiviyTabItem> = [
        {key: 0, value: '洗车服务'}
    ];
    public selectedTabIndex = 0;
    public pageIndex = 1;
    public noResultText = '数据加载中...';

    private searchText$ = new Subject<any>();
    private linkUrl: string;
    private continueRequestSubscription: Subscription;

    private get pageCount(): number {
        if (this.activityList.length % PageSize === 0) {
            return this.activityList.length / PageSize;
        }
        return this.activityList.length / PageSize + 1;
    }

    constructor(private globalService: GlobalService,
                private activityService: ActivitySettingsService) {
    }

    @ViewChild('washCarEdit', { static: false }) public washCarEdit: WashCarEditComponent;

    ngOnInit() {
        // 洗车服务
        this.searchText$.pipe(debounceTime(500)).subscribe(() => {
            this.requestActivityList();
        });
        this.searchText$.next();
    }

    // 查询按钮
    public onSearchBtnClick() {
        this.pageIndex = 1;
        this.searchText$.next();
    }

    // 点击新建、编辑弹出
    public onShowModal(data?: ActivityEntity) {
        this.washCarEdit.open(data, () => {
            this.washCarEdit.clear();
            timer(0).subscribe(() => {
                this.searchText$.next();
            });
        }, () => {
            this.washCarEdit.clear();
        });
    }

    // 分页
    public onNZPageIndexChange(pageIndex: number) {
        this.pageIndex = pageIndex;
        if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
            // 当存在linkUrl并且快到最后一页了请求数据
            // tslint:disable-next-line:no-unused-expression
            this.continueRequestSubscription &&
            this.continueRequestSubscription.unsubscribe();
            this.continueRequestSubscription = this.activityService
                .continueActivityListData(this.linkUrl)
                .subscribe(
                    res => {
                        this.activityList = this.activityList.concat(res.results);
                        this.linkUrl = res.linkUrl;
                    },
                    err => {
                        this.globalService.httpErrorProcess(err);
                    }
                );
        }
    }

    // 活动开关状态改变
    public onSwitchChange(status: number, event: boolean) {
        timer(2000).subscribe(() => {
            return (status = event ? 1 : 2);
        });
    }

    // 活动开关点击调用接口
    public onSwitchClick(activity_id: string, status: number) {
        const text = status === 1 ? '关闭' : '开启';
        const newStatus = status === 1 ? 2 : 1;
        this.activityService
            .requestUpdateStatusData(activity_id, newStatus)
            .subscribe(res => {
                    this.globalService.promptBox.open(`${text}成功`);
                    this.searchText$.next();
                }, err => {
                    if (!this.globalService.httpErrorProcess(err)) {
                        if (err.status === 422) {
                            this.globalService.promptBox.open(
                                `${text}失败，请重试！`, null, 2000, null, false
                            );
                        }
                    }
                    this.searchText$.next();
                }
            );
    }

    // 删除洗车活动
    public onDeleteActivity(data: ActivityEntity) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.activityService.requestDeleteActivityData(data.activity_id).subscribe(() => {
                this.globalService.promptBox.open('删除成功', () => {
                    this.searchText$.next();
                });
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    if (err.status === 422) {
                    this.globalService.promptBox.open(`删除失败，请重试!`, null, 2000, '/assets/images/warning.png');
                }}
            });
        });
    }

    // 请求洗车活动列表
    private requestActivityList(): void {
        this.activityService.requestActivityListData(this.searchParams).subscribe(
            res => {
                this.activityList = res.results;
                this.linkUrl = res.linkUrl;
                this.noResultText = '暂无数据';
                this.pageIndex = 1;
            },
            err => {
                this.pageIndex = 1;
                this.noResultText = '暂无数据';
                this.globalService.httpErrorProcess(err);
            }
        );
    }
}
