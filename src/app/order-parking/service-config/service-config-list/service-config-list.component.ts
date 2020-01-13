import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../core/global.service';
import { HttpErrorEntity } from '../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { AddCarParkingComponent } from './add-car-parking/add-car-parking.component';
import {
    ServiceConfigService,
    ParkingEntity,
    ParkingSearchParams,
    RecommendStatusParams
} from '../service-config.service';

const PageSize = 15;

@Component({
    selector: 'app-service-config-list',
    templateUrl: './service-config-list.component.html',
    styleUrls: ['./service-config-list.component.css']
})
export class ServiceConfigListComponent implements OnInit {

    public searchParams: ParkingSearchParams = new ParkingSearchParams(); // 条件筛选

    public productConfigList: Array<ParkingEntity> = []; // 产品订单列表

    public pageIndex = 1; // 当前页码

    public noResultText = '数据加载中...';

    public imageUrls = []; // 图片放大集合

    private linkUrl: string; // 分页url

    private searchText$ = new Subject<any>();

    private continueRequestSubscription: Subscription; // 分页获取数据

    private get pageCount(): number {
        if (this.productConfigList.length % PageSize === 0) {
            return this.productConfigList.length / PageSize;
        }
        return this.productConfigList.length / PageSize + 1;
    }

    @ViewChild('addCarParking', {static: true}) public addCarParking: AddCarParkingComponent;

    @ViewChild(ZPhotoSelectComponent, {static: true}) public ZPhotoSelectComponent: ZPhotoSelectComponent;

    constructor(private globalService: GlobalService,
                private serviceConfigService: ServiceConfigService) {
    }

    public ngOnInit() {
        this.searchText$.pipe(debounceTime(500)).subscribe(() => {
            this.serviceConfigService.requestParkingListData(this.searchParams).subscribe(res => {
                this.productConfigList = res.results;
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

    // 添加停车场
    public onAddCarParking() {
        this.addCarParking.open(() => {
            timer(1000).subscribe(() => {
                this.searchText$.next();
            });
        });
    }

    /** 删除产品配置 */
    public onDeleteProduct(data: ParkingEntity) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.serviceConfigService.requestDeleteProductData(data.parking_id).subscribe(() => {
                this.globalService.promptBox.open('删除成功', () => {
                    this.searchText$.next();
                });
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        });
    }

    // 修改停车场被推荐状态
    public requestChangeRecommendStatus(data: ParkingEntity) {
        const msg = (data.is_recommended === 1) ? '取消推荐' : '设为推荐';
        const recommendStatusParams = new RecommendStatusParams();
        recommendStatusParams.recommend_status = (data.is_recommended === 1) ? 2 : 1;

        this.serviceConfigService.requestChangeRecommendStatusData(data.parking_id, recommendStatusParams).subscribe(() => {
            this.globalService.promptBox.open(msg + '成功', () => {
                this.searchText$.next();
            });
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                let errMsg = '操作失败，请重试！';

                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

                    for (const content of error.errors) {
                        if (content.field === 'recommend_status' && content.code === 'missing_field') {
                            errMsg = '推荐状态参数缺失！';
                        } else if (content.field === 'recommend_status' && content.code === 'invalid') {
                            errMsg = '推荐状态参数错误或无效！';
                        }
                    }
                }
                this.globalService.promptBox.open(errMsg, null, 2000, null, false);
            }
        });
    }


    // 翻页
    public onNZPageIndexChange(pageIndex: number) {
        this.pageIndex = pageIndex;
        if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
            // 当存在linkUrl并且快到最后一页了请求数据
            this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
            this.continueRequestSubscription = this.serviceConfigService.continueParkingListData(this.linkUrl)
                .subscribe(res => {
                    this.productConfigList = this.productConfigList.concat(res.results);
                    this.linkUrl = res.linkUrl;
                }, err => {
                    this.globalService.httpErrorProcess(err);
                });
        }
    }
}

