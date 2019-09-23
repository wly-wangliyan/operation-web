import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { ProductLibraryHttpService, ProductEntity, SearchParams } from '../product-library-http.service';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FileImportViewModel } from '../../../../../utils/file-import.model';
import { ProgressModalComponent } from '../../../../share/components/progress-modal/progress-modal.component';
import { ProjectEntity, ProjectManagemantHttpService } from '../../project-managemant/project-managemant-http.service';

const PageSize = 15;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选

  public projectList: Array<ProjectEntity> = []; // 保养项目列表

  public currentProjectList: Array<ProjectEntity> = []; // 选中类别下保养项目列表

  public project_category = ''; // 类别

  public project_id = ''; // 项目id

  public project_type = ''; // 项目类型

  public is_original = ''; // 是否原厂

  private requestSubscription: Subscription; // 获取数据

  public productList: Array<ProductEntity> = []; // 产品列表

  public projectCategories = [1, 2, 3]; // 项目类别 1:保养项目 2:清洗养护项目 3:维修项目

  public projectTypes = [1, 2]; // 项目类型 1:配件 2:服务

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string;

  private importSpotSubscription: Subscription; // 导入描述对象

  public importViewModel: FileImportViewModel = new FileImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;


  private get pageCount(): number {
    if (this.productList.length % PageSize === 0) {
      return this.productList.length / PageSize;
    }
    return this.productList.length / PageSize + 1;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private projectService: ProjectManagemantHttpService,
    private productLibraryService: ProductLibraryHttpService
  ) { }

  public ngOnInit() {
    this.generateProductList();
    this.requestProjectList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取产品列表
  private generateProductList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProductList();
    });
    this.searchText$.next();
  }

  // 请求产品列表
  private requestProductList() {
    this.productLibraryService.requestProductListData(this.searchParams).subscribe(res => {
      this.productList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取所有配件/服务
  private requestProjectList() {
    this.projectList = [];
    this.requestSubscription = this.projectService.requestProjectListData().subscribe(res => {
      this.projectList = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 变更项目类别
  public onChangeCategory(event: any) {
    const category = event.target.value;
    this.project_id = '';
    this.searchParams.upkeep_item_id = null;
    if (category) {
      if (this.projectList) {
        this.currentProjectList = this.projectList.filter(value => value.upkeep_item_category === Number(category));
      }
      const category_id = event.target.value;
      this.searchParams.upkeep_item_category = Number(category_id);
    } else {
      this.currentProjectList = [];
      this.searchParams.upkeep_item_category = null;
    }
  }

  // 变更项目名称
  public onChangeProjectId(event: any) {
    if (!event.target.value) {
      this.searchParams.upkeep_item_id = null;
    } else {
      this.searchParams.upkeep_item_id = event.target.value;
    }
  }

  // 变更项目类型
  public onChangeType(event: any) {
    const type_id = event.target.value;
    if (type_id) {
      this.searchParams.upkeep_accessory_type = Number(type_id);
    } else {
      this.searchParams.upkeep_accessory_type = null;
    }
  }

  // 变更是否原厂
  public onChangeOriginal(event: any) {
    if (event.target.value) {
      // this.searchParams.is_original = event.target.value === 'false' ? false : true;
      this.searchParams.is_original = event.target.value;
    } else {
      this.searchParams.is_original = null;
    }
  }

  // 品牌、厂商、车系回调
  public onChangeSearchParams(event: any) {
    if (event) {
      this.searchParams.vehicle_brand_id = event.brand;
      this.searchParams.vehicle_firm_id = event.firm;
    }
  }

  // 搜索
  public onSearchBtnClick() {
    this.searchText$.next();
    this.initPageIndex();
  }

  /** 删除产品 */
  public onDeleteProgect(data: ProductEntity) {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.productLibraryService.requestDeleteProductData(data.upkeep_accessory_id).subscribe(res => {
        this.globalService.promptBox.open('删除成功');
        this.searchText$.next();
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
      this.continueRequestSubscription = this.productLibraryService.continueProductListData(this.linkUrl)
        .subscribe(res => {
          this.productList = this.productList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

  // 解订阅
  public onCloseUnsubscribe() {
    this.importSpotSubscription && this.importSpotSubscription.unsubscribe();
  }

  /**
   * 导入
   * 导入成功后需要刷新列表
   */
  public onImportProduct() {
    $('#importProductPromptDiv').modal('show');
    this.importViewModel.initImportData();
    console.log('导入');
  }

  // 取消导入
  public onCancelData() {
    this.onCloseUnsubscribe();
    this.importViewModel.initImportData();
    $('#importProductPromptDiv').modal('hide');
  }

  /* 导入数据 */
  public onSubmitImportProduct() {
    if (this.importViewModel.address) {
      const length = this.importViewModel.address.length;
      const index = this.importViewModel.address.lastIndexOf('.');
      const type = this.importViewModel.address.substring(index, length);
      if (type !== '.xlsx' && type !== '.csv') {
        this.globalService.promptBox.open('文件格式错误！', null, 2000, null, false);
        return;
      }
    }
    if (this.importViewModel.checkFormDataValid()) {
      this.progressModalComponent.openOrClose(true);
      this.importSpotSubscription = this.productLibraryService.requestImportProductData(
        this.importViewModel.type, this.importViewModel.file).subscribe(res => {
          this.progressModalComponent.openOrClose(false);
          $('#dataImportModal').modal('hide');
          const date = JSON.parse(res.response);
          this.globalService.promptBox.open(`成功导入${date.success}条，失败${date.failed}条！`, () => {
            this.importViewModel.initImportData();
            $('#importProductPromptDiv').modal('hide');
            this.searchText$.next();
            this.initPageIndex();
          }, -1);
        }, err => {
          this.progressModalComponent.openOrClose(false);
          timer(300).subscribe(() => {
            if (!this.globalService.httpErrorProcess(err)) {
              if (err.status === 422) {
                const tempErr = JSON.parse(err.responseText);
                const error = tempErr.length > 0 ? tempErr[0].errors[0] : tempErr.errors[0];
                if (error.field === 'FILE' && error.code === 'invalid') {
                  this.globalService.promptBox.open('导入文件不能为空！', null, 2000, null, false);
                } else if (error.resource === 'FILE' && error.code === 'incorrect_format') {
                  this.globalService.promptBox.open('文件格式错误！', null, 2000, null, false);
                } else if (error.resource === 'FILE' && error.code === 'scale_out') {
                  this.globalService.promptBox.open('单次最大可导入200条，请重新上传！', null, 2000, null, false);
                } else {
                  this.globalService.promptBox.open('导入失败，请重新上传！', null, 2000, null, false);
                }
              }
            }
          });
        });
    }
  }
}
