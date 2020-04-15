import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../../core/http.service';
import { CarBrandEntity, VehicleManagementHttpService } from '../../vehicle-management-http.service';

@Component({
  selector: 'app-vehicle-top-brand',
  templateUrl: './vehicle-top-brand.component.html',
  styleUrls: ['./vehicle-top-brand.component.css']
})

export class VehicleTopBrandComponent implements OnInit {

  constructor(
    private globalService: GlobalService,
    private vehicleManagementService: VehicleManagementHttpService,
  ) { }

  public carBrandList: Array<CarBrandEntity> = [];
  public noRecommendedResultText = '加载数据中...';
  public noNotRecommendedResultText = '加载数据中...';
  public notRecommendedList: Array<CarBrandEntity> = [];
  public recommendedList: Array<CarBrandEntity> = [];

  private sureCallback: any;
  private subscription: Subscription;
  private searchRecommendedBrandText$ = new Subject<any>();

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  ngOnInit() {
    // 已推荐品牌列表
    this.searchRecommendedBrandText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.vehicleManagementService.requestRecommendedCarBrandsListData(true))
    ).subscribe(res => {
      this.recommendedList = res.results;
      this.noRecommendedResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 选入未推荐的品牌
  public onChooseBtnClick(data: CarBrandEntity) {
    this.notRecommendedList = this.notRecommendedList.filter(item => item.car_brand_id !== data.car_brand_id);
    const recommendedCarBrandList = [];
    recommendedCarBrandList.push(data);
    this.recommendedList = this.recommendedList.concat(recommendedCarBrandList);
  }

  // 移除已推荐的品牌
  public onDeleteBtnClick(data: CarBrandEntity) {
    this.recommendedList = this.recommendedList.filter(item => item.car_brand_id !== data.car_brand_id);
    const notRecommendedCarBrandList = [];
    notRecommendedCarBrandList.push(data);
    this.notRecommendedList = this.notRecommendedList.concat(notRecommendedCarBrandList);
  }

  // 保存数据
  public onSaveBtnClick() {
    const carBrandIdList = this.recommendedList.map(item => item.car_brand_id);
    const car_brand_ids = carBrandIdList.join(',');
    this.vehicleManagementService.requestUpdateRecommendedBrands(car_brand_ids).subscribe(() => {
      this.getSuccessInfo();
    }, err => {
      this.getErrorInfo(err);
    });
  }

  // 接口成功的回调
  private getSuccessInfo() {
    this.globalService.promptBox.open('热门品牌数据保存成功！');
    if (this.sureCallback) {
      const temp = this.sureCallback;
      temp();
    }
    this.onCloseModal();
  }

  // 捕获错误信息
  private getErrorInfo(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          // tslint:disable-next-line:max-line-length
          const field = content.field === 'car_brand_ids' ? '汽车品牌' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段缺失!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}字段无效!`, null, 2000, '/assets/images/warning.png');
          } else if (content.code === 'number_error') {
            this.globalService.promptBox.open('推荐的汽车品牌数量错误,请重试!', null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('热门品牌保存失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public onCloseModal() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sureCallback) {
      this.sureCallback = null;
    }
    this.carBrandList = [];
    this.recommendedList = [];
    this.notRecommendedList = [];
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(carBrandList: Array<CarBrandEntity> = [], sureFunc: any) {
    this.carBrandList = carBrandList;
    this.searchRecommendedBrandText$.next();
    this.notRecommendedList = this.carBrandList.filter(item => !item.is_recommended);
    this.noNotRecommendedResultText = '暂无数据';
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      return false;
    }
  }
}

