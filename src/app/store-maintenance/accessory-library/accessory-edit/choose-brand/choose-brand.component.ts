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

  @Input() private selectedBrandid: string; // 已选中的品牌Id

  public brandList: Array<AccessoryBrandEntity> = []; // 项目列表

  public currentbrandList: Array<AccessoryBrandEntity> = []; // 所选项目类别对应的保养项目列表

  public currentBrand: AccessoryBrandEntity = new AccessoryBrandEntity(); // 所选配件/服务

  private requestSubscription: Subscription; // 分页获取数据

  public currentCategory: string;

  public tipMsg = ''; // 提示信息

  public currentBrandId: string;

  private searchText$ = new Subject<any>();

  constructor(
    private globalService: GlobalService,
    private brandManagementService: BrandManagementHttpService
  ) { }

  @Output('selectedBrand') public selectedBrand = new EventEmitter();

  public ngOnInit() {
    // 配件品牌列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.brandManagementService.requestAccessoryBrandAllListData())
    ).subscribe(res => {
      this.brandList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  /**
   * 打开
   */
  public open() {
    const obj = new AccessoryBrandEntity();
    obj.accessory_brand_id = '1';
    obj.brand_name = '风帆';
    this.brandList.push(obj);
    const obj1 = new AccessoryBrandEntity();
    obj1.accessory_brand_id = '2';
    obj1.brand_name = '美孚';
    this.brandList.push(obj1);
    const obj2 = new AccessoryBrandEntity();
    setTimeout(() => {
      this.initModal();
      $('#chooseBrandModal').modal();
    }, 0);
  }

  // 初始化
  private initModal() {
    this.tipMsg = '';
    this.currentBrandId = '';
    this.brandList = [];
    if (this.selectedBrandid) {
      this.currentBrandId = this.selectedBrandid;
    }
  }

  /**
   * 关闭
   */
  public close() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    $('#chooseBrandModal').modal('hide');
  }

  public onCategoryClick(category: string) {
    this.tipMsg = '';
    this.currentbrandList = [];
    this.currentBrand = new AccessoryBrandEntity();
    this.currentCategory = category;
    if (this.brandList) {
      this.currentbrandList = this.brandList.filter(value => value.accessory_brand_id === category);
    }
  }

  // 选中项目
  public onProjectClick(brand: AccessoryBrandEntity) {
    this.tipMsg = '';
    this.currentBrand = brand;
  }

  // 回传选中事件
  public onSelectEmit() {
    if (this.currentBrand && this.currentBrand.accessory_brand_id) {
      this.selectedBrand.emit(
        {
          category: this.currentCategory,
          brand: this.currentBrand
        });
      $('#chooseBrandModal').modal('hide');
    } else {
      this.tipMsg = '请选择配件/服务';
    }
  }
}


