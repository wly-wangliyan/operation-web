import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../core/global.service';
import { ServiceConfigService, ParkingEntity, ParkingSearchParams } from '../service-config.service';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { AddCarParkingComponent } from './add-car-parking/add-car-parking.component';

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

  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url

  private get pageCount(): number {
    if (this.productConfigList.length % PageSize === 0) {
      return this.productConfigList.length / PageSize;
    }
    return this.productConfigList.length / PageSize + 1;
  }

  @ViewChild('addCarParking', { static: true }) public addCarParking: AddCarParkingComponent;
  @ViewChild(ZPhotoSelectComponent, { static: true }) public ZPhotoSelectComponent: ZPhotoSelectComponent;

  constructor(
    private globalService: GlobalService,
    private serviceConfigService: ServiceConfigService) { }

  public ngOnInit() {
    const obj = new ParkingEntity();
    obj.images = '43324324';
    // const obj = { images: '43324324' };
    this.productConfigList.push(obj);
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

