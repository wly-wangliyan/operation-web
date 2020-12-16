import { Component } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { carReviewStatus } from '../../../../../share/pipes/information-delivery.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingStatus } from '../../../../../../utils/common-enums';
import { InformationDeliveryManagementService, PlaceListParams, ParkingPlaceEntity } from '../information-delivery-management.service';
import {
    ReviewStatus,
    OnlineStatus,
} from '../../../used-car/information-delivery-management/information-delivery-management.service';
import { timer } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-information-delivery-list',
    templateUrl: './information-delivery-list.component.html',
    styleUrls: ['../../parking-space-sell.component.css',
        './information-delivery-list.component.css',
        '../../../../../../assets/less/tab-bar-list.less']
})
export class InformationDeliveryListComponent implements NzSearchAdapter {
    public OnlineStatus = OnlineStatus;
    public OperationType = OperationType;
    public ReviewStatus = ReviewStatus;
    public carReviewStatus = carReviewStatus;
    public searchParams: PlaceListParams = new PlaceListParams(); // 条件筛选参数
    public review_start_time: any = '';
    public review_end_time: any = '';
    public nzSearchAssistant: NzSearchAssistant;
    public selectedParkingPlace: ParkingPlaceEntity = new ParkingPlaceEntity();
    public rejectReason = ''; // 驳回理由
    public tabList = [
        {key: 0, label: '全部'},
        {key: 1, label: '待审核'},
        {key: 2, label: '已审核'},
        {key: 3, label: '被驳回'}
    ];
    public districtList: Array<DistrictItem> = [];
    public activeTabIndex = 0;
    private parkingPlaceList: Array<ParkingPlaceEntity> = [];

    constructor(private globalService: GlobalService,
                private route: ActivatedRoute,
                private router: Router,
                private informationDeliveryManagementService: InformationDeliveryManagementService) {
        this.nzSearchAssistant = new NzSearchAssistant(this);
        this.nzSearchAssistant.submitSearch(true);
        this.initDistrictList();
    }

    // 切换tab
    public onTabChange(key: number) {
        this.searchParams = new PlaceListParams();
        this.review_start_time = '';
        this.review_end_time = '';
        this.searchParams.review_status = (key === 0 ? null : key);
        this.nzSearchAssistant.loadStatus = LoadingStatus.none;
        this.nzSearchAssistant.nzData = [];
        this.nzSearchAssistant.submitSearch(true);
    }

    // 开始时间的禁用部分
    public disabledReviewStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.review_end_time);
    };

    // 结束时间的禁用部分
    public disabledReviewEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.review_start_time);
    };

    // 列表排序
    public onClickDrop(event: CdkDragDrop<string[]>, results: Array<ParkingPlaceEntity>): void {
        console.log(121212);
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        const to_parking_place_info_id = this.parkingPlaceList[event.currentIndex].parking_place_info_id;
        const parking_place_info_id = this.parkingPlaceList[event.previousIndex].parking_place_info_id;
        moveItemInArray(results, event.previousIndex, event.currentIndex);
        this.informationDeliveryManagementService.requestParkingPlaceOrderNum(parking_place_info_id, to_parking_place_info_id).subscribe(data => {
            this.nzSearchAssistant.submitSearch(true);
            this.globalService.promptBox.open('排序成功！');
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 启停
     * @param parkingPlace
     */
    public onSwitchChange(parkingPlace: ParkingPlaceEntity) {
        const swicth = parkingPlace.online_status === OnlineStatus.off ? OnlineStatus.on : OnlineStatus.off;
        this.informationDeliveryManagementService.requestParkingPlaceOnlineStatus(parkingPlace.parking_place_info_id, swicth)
            .subscribe(res => {
                if (parkingPlace.online_status === OnlineStatus.off) {
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
     * 去驳回
     * @param parkingPlace
     */
    public onClickRejected(parkingPlace: ParkingPlaceEntity) {
        this.selectedParkingPlace = parkingPlace.clone();
        this.rejectReason = '';
        timer(10).subscribe(() => {
            $('#rejectedPromptDiv').modal('show');
        });
    }

    /**
     * 审核信息
     * @param parking_place_info_id
     * @param review_status
     * @param reject_reason
     */
    public onClickReviewStatusData(parking_place_info_id: string, review_status: ReviewStatus, reject_reason?: string) {
        $('#rejectedPromptDiv').modal('hide');
        this.globalService.confirmationBox.open('审核', review_status === ReviewStatus.reviewed ? '确认通过该信息并发布上线？' : '确认驳回该信息？', () => {
            this.globalService.confirmationBox.close();
            this.informationDeliveryManagementService.requestParkingPlaceReviewStatusData
            (parking_place_info_id, review_status, reject_reason).subscribe(res => {
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
        return this.informationDeliveryManagementService.requestParkingPlaceList(this.searchParams);
    }

    public continueSearch(url: string): any {
        return this.informationDeliveryManagementService.continueRequestParkingPlaceList(url);
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
            this.searchParams.review_section = '';
        }
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(results: Array<ParkingPlaceEntity>): any {
        this.parkingPlaceList = results;
    }

    /**
     * 删除
     * @param parking_place_info_id
     */
    public onDeleteParkingPlaceClick(parking_place_info_id: string) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.informationDeliveryManagementService.requestDeleteParkingPlaceDetailData(parking_place_info_id).subscribe(res => {
                this.nzSearchAssistant.submitSearch(true);
                this.globalService.promptBox.open('删除成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                }
            });
        }, '确定');
    }

    /**
     * 初始化区域列表
     */
    private initDistrictList() {
        this.districtList = [
            new DistrictItem('全部', ''),
            new DistrictItem('沈阳市-浑南区', '210112'),
            new DistrictItem('沈阳市-大东区', '210104'),
            new DistrictItem('沈阳市-法库', '210124'),
            new DistrictItem('沈阳市-和平区', '210102'),
            new DistrictItem('沈阳市-皇姑区', '210105'),
            new DistrictItem('沈阳市-康平', '210123'),
            new DistrictItem('沈阳市-辽中', '210115'),
            new DistrictItem('沈阳市-沈北新区', '210113'),
            new DistrictItem('沈阳市-沈河区', '210103'),
            new DistrictItem('沈阳市-铁西区', '210106'),
            new DistrictItem('沈阳市-苏家屯', '210111'),
        ];
    }

}

enum OperationType {
    update,
    delete,
}

class DistrictItem {
    public name: string = undefined;
    public region_id: string = undefined;

    constructor(name: string, region_id: string) {
        this.name = name;
        this.region_id = region_id;
    }
}
