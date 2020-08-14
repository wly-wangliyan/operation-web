import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorEntity } from '../../../../core/http.service';
import { NzSearchAssistant } from '../../../../share/nz-search-assistant';
import { ActivatedRoute, Router } from '@angular/router';
import {
    InformationDeliveryManagementEntity,
    InformationDeliveryManagementService, SearchParamsCarEntity
} from '../../information-delivery-management/information-delivery-management.service';
import { TagManagementEntity, TagManagementService } from '../tag-management.service';

@Component({
    selector: 'app-tag-car-list',
    templateUrl: './tag-car-list.component.html',
    styleUrls: ['./tag-car-list.component.css']
})
export class TagCarListComponent implements OnInit {
    public searchParams: SearchParamsCarEntity = new SearchParamsCarEntity(); // 条件筛选参数
    public start_time: any = '';
    public end_time: any = '';
    public review_start_time: any = '';
    public review_end_time: any = '';
    public tagCarList: Array<InformationDeliveryManagementEntity> = [];
    public noResultText = '数据加载中...';
    public label_id: string;

    constructor(private globalService: GlobalService,
                private route: ActivatedRoute,
                private router: Router,
                private tagManagementService: TagManagementService) {
        this.route.paramMap.subscribe(map => {
            this.label_id = map.get('label_id');
        });
    }

    public ngOnInit() {
        if (this.label_id) {
            this.requestTagCarList();
        }
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

    // 列表排序
    public onClickDrop(event: CdkDragDrop<string[]>, results: Array<InformationDeliveryManagementEntity>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        const to_car_info_id = this.tagCarList[event.currentIndex].car_info_id;
        const car_info_id = this.tagCarList[event.previousIndex].car_info_id;
        moveItemInArray(results, event.previousIndex, event.currentIndex);
        this.requestCarSort(car_info_id, to_car_info_id);
    }

    /**
     * 标签排序
     * @param car_info_id
     */
    public onCarSortClick(car_info_id: string) {
        const to_car_info_id = this.tagCarList[0].car_info_id;
        this.requestCarSort(car_info_id, to_car_info_id);
    }

    /**
     * 搜索
     */
    public onClickRearch() {
        if (this.generateAndCheckParamsValid()) {
            this.requestTagCarList();
        }
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

    /**
     * 模板列表
     */
    private requestTagCarList() {
        this.noResultText = '数据加载中...';
        this.tagManagementService.requestTagCarListData(this.searchParams, this.label_id).subscribe(data => {
            this.tagCarList = data;
            if (data.length === 0) {
                this.noResultText = '暂无数据';
            }
        }, err => {
            this.noResultText = '暂无数据';
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 请求排序
     * @param car_info_id
     * @param to_car_info_id
     * @param isTop
     * @private
     */
    private requestCarSort(car_info_id: string, to_car_info_id: string, isTop = false) {
        this.tagManagementService.requestCarSortData(this.label_id, car_info_id, to_car_info_id).subscribe(data => {
            this.requestTagCarList();
            this.globalService.promptBox.open(isTop ? '置顶成功！' : '排序成功！');
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}
