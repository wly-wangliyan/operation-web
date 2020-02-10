import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import {
  AccessoryBrandEntity,
  BrandManagementHttpService,
} from '../../../brand-management/brand-management-http.service';
@Component({
  selector: 'app-choose-brand',
  templateUrl: './choose-brand.component.html',
  styleUrls: ['./choose-brand.component.css']
})
export class ChooseBrandComponent implements OnInit {

  @Input() private selectedBrandId: string; // 已选中的品牌Id

  public brandList: Array<AccessoryBrandEntity> = []; // 品牌列表

  public currentBrand: AccessoryBrandEntity = new AccessoryBrandEntity(); // 所选品牌对象

  private requestSubscription: Subscription; // 获取数据

  public tipMsg = ''; // 提示信息

  private searchText$ = new Subject<any>();

  constructor(
    private globalService: GlobalService,
    private brandManagementService: BrandManagementHttpService
  ) { }

  @Output('selectedBrand') public selectedBrand = new EventEmitter();

  public ngOnInit() {
    // 配件品牌列表
    this.searchText$.pipe(debounceTime(500)).subscribe(res => {
      this.requestBrandList();
    });
    this.searchText$.next();
  }

  private requestBrandList(): void {
    this.brandManagementService.requestAccessoryBrandAllListData().subscribe(res => {
      this.brandList = res.results;
    }, err => {
      this.brandList = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  /**
   * 打开
   */
  public open() {
    setTimeout(() => {
      this.searchText$.next();
      this.initModal();
      $('#chooseBrandModal').modal();
    }, 0);
  }

  // 初始化
  private initModal() {
    this.tipMsg = '';
    if (this.selectedBrandId && this.brandList.some(brand => brand.accessory_brand_id === this.selectedBrandId)) {
      const brandList = this.brandList.filter(brand => brand.accessory_brand_id === this.selectedBrandId);
      this.currentBrand = brandList ? brandList[0] : null;
    }
  }

  /**
   * 关闭
   */
  public close() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    $('#chooseBrandModal').modal('hide');
  }

  public onBrandClick(brand: AccessoryBrandEntity) {
    this.tipMsg = '';
    this.currentBrand = brand;
  }

  // 回传选中事件
  public onSelectEmit() {
    if (this.currentBrand && this.currentBrand.accessory_brand_id) {
      this.selectedBrand.emit(
        {
          brand: this.currentBrand
        });
      $('#chooseBrandModal').modal('hide');
    } else {
      this.tipMsg = '请选择品牌!';
    }
  }
}


