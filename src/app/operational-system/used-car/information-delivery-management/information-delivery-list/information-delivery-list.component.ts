import { Component } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';
import {
    InformationDeliveryManagementService,
    SearchParamsCarEntity,
    OnlineStatus,
    ReviewStatus,
    InformationDeliveryManagementEntity
} from '../information-delivery-management.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { carReviewStatus } from '../../../../share/pipes/information-delivery.pipe';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-information-delivery-list',
    templateUrl: './information-delivery-list.component.html',
    styleUrls: ['./information-delivery-list.component.css', '../../../../../assets/less/tab-bar-list.less']
})
export class InformationDeliveryListComponent implements NzSearchAdapter {
    public OnlineStatus = OnlineStatus;
    public OperationType = OperationType;
    public ReviewStatus = ReviewStatus;
    public carReviewStatus = carReviewStatus;
    public searchParams: SearchParamsCarEntity = new SearchParamsCarEntity(); // 条件筛选参数
    public start_time: any = '';
    public end_time: any = '';
    public review_start_time: any = '';
    public review_end_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;
    public tabList = [
        {key: 0, label: '全部'},
        {key: 1, label: '待审核'},
        {key: 2, label: '已审核'},
        {key: 3, label: '被驳回'}
    ];
    public activeTabIndex = 0;

    constructor(private globalService: GlobalService,
                private route: ActivatedRoute,
                private router: Router,
                private informationDeliveryManagementService: InformationDeliveryManagementService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
    }

    // 切换tab
    public onTabChange(key: number) {
        this.nzSearchAssistant.nzData = [];
        this.searchParams = new SearchParamsCarEntity();
        this.start_time = '';
        this.end_time = '';
        this.review_start_time = '';
        this.review_end_time = '';
        this.searchParams.review_status = (key === 0 ? null : key);
        this.nzSearchAssistant.submitSearch(true);
    }

    // 开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
    };


    // 结束时间的禁用部分
    public disabledEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
    };

    // 开始时间的禁用部分
    public disabledReviewStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.review_end_time);
    };

    // 结束时间的禁用部分
    public disabledReviewEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.review_start_time);
    };

    /**
     * 判断二手车信息是否关联上线标签
     * @param car_info_id
     * @param type
     */
    public informationDeliveryLabelStatus(car_info_id, type: OperationType) {
        this.informationDeliveryManagementService.requestInformationDeliveryLabelData(car_info_id).subscribe(data => {
            // 1已关联上线标签/ 2未关联上线标签
            if (data.status === 1) {
                this.globalService.promptBox.open
                ('此信息存在线上关联标签，不允许' + (type === OperationType.update ? '编辑' : '删除') + '。', null, 2000, null, false);
            } else {
                if (type === OperationType.update) {
                    this.router.navigate(['../information-delivery-edit', car_info_id], {relativeTo: this.route});
                } else {
                    this.onDeleteInformationDeliveryClick(car_info_id);
                }
            }

        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 启停
     * @param informationDelivery
     */
    public onSwitchChange(informationDelivery: InformationDeliveryManagementEntity) {
        const swicth = informationDelivery.online_status === OnlineStatus.off ? OnlineStatus.on : OnlineStatus.off;
        this.informationDeliveryManagementService.requestInformationDeliveryOnlineStatusData(informationDelivery.car_info_id, swicth).subscribe(res => {
            if (informationDelivery.online_status === OnlineStatus.off) {
                this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
            } else {
                this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
            }
            this.nzSearchAssistant.submitSearch(true);
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                    for (const content of error.errors) {
                        if (content.field === 'online_status' && content.code === 'not_allowed') {
                            this.globalService.promptBox.open('待审核或者已驳回不可上线', null, 2000, null, false);
                            return;
                        }
                    }
                }
            }
        });
    }

    /**
     * 审核二手车信息
     * @param car_info_id
     * @param review_status
     */
    public onClickReviewStatusData(car_info_id: string, review_status: ReviewStatus) {
        this.globalService.confirmationBox.open('审核', review_status === ReviewStatus.reviewed ? '确认通过该信息并发布上线？' : '确认驳回该信息？', () => {
            this.globalService.confirmationBox.close();
            this.informationDeliveryManagementService.requestInformationDeliveryReviewStatusData
            (car_info_id, review_status).subscribe(res => {
                this.nzSearchAssistant.submitSearch(true);
                this.globalService.promptBox.open(review_status === ReviewStatus.reviewed ? '通过成功' : '驳回成功');
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        }, '确定');
    }

    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.informationDeliveryManagementService.requestInformationDeliveryListData(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.informationDeliveryManagementService.continueInformationDeliveryListData(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        if (this.review_start_time || this.review_end_time) {
            const sReviewTime = this.review_start_time ? ((new Date(this.review_start_time).setSeconds(0, 0) / 1000)) : 0;
            const eReviewTime = this.review_end_time ? ((new Date(this.review_end_time).setSeconds(0, 0) / 1000)) : 253370764800;
            if (sReviewTime > eReviewTime) {
                this.globalService.promptBox.open('发布时间的开始时间应小于等于结束时间！', null, 2000, null, false);
                return false;
            }
            this.searchParams.review_section = `${sReviewTime},${eReviewTime}`;
        } else {
            this.searchParams.review_section = null;
        }


        const sTime = this.start_time ? ((new Date(this.start_time).setSeconds(0, 0) / 1000)) : 0;
        const eTime = this.end_time ? ((new Date(this.end_time).setSeconds(0, 0) / 1000)) : 253370764800;
        if (sTime > eTime) {
            this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
            return false;
        }
        this.searchParams.created_section = `${sTime},${eTime}`;
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(): any {
    }

    /**
     * 删除
     * @param car_info_id
     */
    private onDeleteInformationDeliveryClick(car_info_id: string) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.informationDeliveryManagementService.requestDeleteInformationDeliveryData(car_info_id).subscribe(res => {
                this.nzSearchAssistant.submitSearch(true);
                this.globalService.promptBox.open('删除成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                }
            });
        }, '确定');
    }

}

enum OperationType {
    update,
    delete,
}
