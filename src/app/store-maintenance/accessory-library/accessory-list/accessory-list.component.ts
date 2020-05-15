import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  AccessoryLibraryService,
  SearchParams,
  ProjectEntity,
  AccessoryEntity
} from '../accessory-library.service';
import {
  AccessoryBrandEntity,
  BrandManagementHttpService
} from '../../brand-management/brand-management-http.service';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SelectMultiBrandFirmComponent } from './select-multi-brand-firm/select-multi-brand-firm.component';
import { ProgressModalComponent } from '../../../share/components/progress-modal/progress-modal.component';
import { FileImportViewModel } from '../../../../utils/file-import.model';

const PageSize = 15;

@Component({
  selector: 'app-accessory-list',
  templateUrl: './accessory-list.component.html',
  styleUrls: ['./accessory-list.component.css']
})
export class AccessoryListComponent implements OnInit {
  public projectList: Array<ProjectEntity> = [];
  public brandList: Array<AccessoryBrandEntity> = [];
  public accessoryNewList: Array<any> = [];
  public pageIndex = 1;
  public searchParams = new SearchParams();
  public noResultText = '数据加载中...';
  public start_pay_time = null; // 支付时间
  public end_pay_time = null;
  public start_reserve_time = null; // 预定时间
  public end_reserve_time = null;
  public workerList: Array<any> = [];
  public importViewModel: FileImportViewModel = new FileImportViewModel();

  private accessory_id: string; // 配件id
  private searchText$ = new Subject<any>();
  private searchProjectText$ = new Subject<any>();
  private searchBrandText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private importSubscription: Subscription;

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  private get pageCount(): number {
    if (this.accessoryNewList.length % PageSize === 0) {
      return this.accessoryNewList.length / PageSize;
    }
    return this.accessoryNewList.length / PageSize + 1;
  }

  @ViewChild(SelectMultiBrandFirmComponent, { static: true })
  public selectMultiBrandFirmComponent: SelectMultiBrandFirmComponent;

  constructor(
    private globalService: GlobalService,
    private accessoryLibraryService: AccessoryLibraryService,
    private brandManagementService: BrandManagementHttpService
  ) { }

  public ngOnInit() {
    // 配件库列表
    this.searchText$.pipe(debounceTime(500)).subscribe(res => {
      this.requestAccessoryList();
    });
    this.searchText$.next();

    // 项目列表
    this.searchProjectText$.subscribe(res => {
      this.requestProjectList();
    });
    this.searchProjectText$.next();

    // 配件品牌列表
    this.searchBrandText$.subscribe(res => {
      this.requestAccessoryBrandAllList();
    });
    this.searchBrandText$.next();
  }

  private requestAccessoryList(): void {
    this.accessoryLibraryService.requestAccessoryListData(this.searchParams).subscribe(res => {
      this.pageIndex = 1;
      this.accessoryNewList = res.results.map(i => ({
        ...i, accessory_imagesList: i.accessory_images ? i.accessory_images.split(',') : []
      }));
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  private requestProjectList(): void {
    this.accessoryLibraryService.requestProjectListData().subscribe(res => {
      this.projectList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  private requestAccessoryBrandAllList(): void {
    this.brandManagementService.requestAccessoryBrandAllListData().subscribe(res => {
      this.brandList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.accessoryNewList = [];
    this.noResultText = '数据加载中...';
    this.searchText$.next();
  }

  // 开关状态改变
  public onSwitchChange(status: boolean, event: boolean) {
    timer(2000).subscribe(() => {
      return (status = event);
    });
  }

  // 开关点击调用接口
  public onSwitchClick(accessory_id: string, status: boolean) {
    const text = !status ? '开启' : '关闭';
    this.accessoryLibraryService
      .requestUpdateStatusData(accessory_id, !status)
      .subscribe(
        res => {
          this.globalService.promptBox.open(`${text}成功`);
          this.searchText$.next();
        },
        err => {
          this.globalService.promptBox.open(
            `${text}失败，请重试！`,
            null,
            2000,
            '/assets/images/warning.png'
          );
          this.searchText$.next();
        }
      );
  }

  // 推荐设置打开所属厂商选择组件
  public onOpenBrandFirmModal(data: AccessoryEntity): void {
    if (data.upload_status === 1) {
      return;
    }
    // 获取推荐设置
    this.accessoryLibraryService.requestRecommendCarSeries(data.accessory_id).subscribe(res => {
      data.car_series_list = res;
      this.selectMultiBrandFirmComponent.open(data, () => {
        this.accessoryNewList = [];
        this.noResultText = '数据加载中...';
        this.searchText$.next();
      });
    }, error => {
      this.globalService.httpErrorProcess(error);
    });

  }


  /** 删除配件 */
  public onDeleteAccessory(data: AccessoryEntity) {
    this.globalService.confirmationBox.open(
      '提示',
      '此操作不可逆，是否确认删除？',
      () => {
        this.globalService.confirmationBox.close();
        this.accessoryLibraryService
          .requestDeleteAccessoryData(data.accessory_id)
          .subscribe(
            () => {
              this.globalService.promptBox.open(`删除成功`);
              this.accessoryNewList = [];
              this.noResultText = '数据加载中...';
              this.searchText$.next();
            },
            err => {
              this.globalService.httpErrorProcess(err);
            }
          );
      }
    );
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.accessoryLibraryService
        .continueAccessoryistData(this.linkUrl).subscribe(res => {
          this.accessoryNewList = this.accessoryNewList.concat(res.results.map(i => ({
            ...i, accessory_imagesList: i.accessory_images ? i.accessory_images.split(',') : []
          })));
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 上传弹窗
  public onOpenImportModal(data: AccessoryEntity) {
    if (data.upload_status === 1) {
      return;
    }
    this.accessory_id = data.accessory_id;
    $('#importBerthPromptDiv').modal('show');
  }

  // 解订阅
  public onCloseUnsubscribe() {
    this.importSubscription && this.importSubscription.unsubscribe();
  }

  public onCancelData() {
    this.onCloseUnsubscribe();
    this.importViewModel.initImportData();
    $('#importBerthPromptDiv').modal('hide');
  }

  /* 导入数据 */
  public onSubmitImportBerth() {
    if (this.importViewModel.address) {
      const length = this.importViewModel.address.length;
      const index = this.importViewModel.address.lastIndexOf('.');
      const type = this.importViewModel.address.substring(index, length);
      if (type !== '.txt') {
        this.globalService.promptBox.open('文件格式错误！', null, 2000, '/assets/images/warning.png');
        return;
      }
    }

    const successFun = res => {
      this.progressModalComponent.openOrClose(false);
      $('#dataImportModal').modal('hide');
      this.globalService.promptBox.open(`上传成功！`, () => {
        this.importViewModel.initImportData();
        $('#importBerthPromptDiv').modal('hide');
        this.searchText$.next();
        this.searchBrandText$.next();
      }, -1);
    };

    const failFun = err => {
      this.progressModalComponent.openOrClose(false);
      timer(300).subscribe(() => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const tempErr = JSON.parse(err.responseText);
            const error = tempErr.length > 0 ? tempErr[0].errors[0] : tempErr.errors[0];
            if (error.field === 'FILE' && error.code === 'invalid') {
              this.globalService.promptBox.open('导入文件错误或无效！', null, 2000, '/assets/images/warning.png');
            } else if (error.resource === 'FILE' && error.code === 'incorrect_format') {
              this.globalService.promptBox.open('文件格式错误！', null, 2000, '/assets/images/warning.png');
            } else if (error.resource === 'FILE' && error.code === 'scale_out') {
              this.globalService.promptBox.open('单次最大可导入1000条，请重新上传！', null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('导入文件错误或无效！', null, 2000, '/assets/images/warning.png');
            }
          }
        }
      });
    };

    if (this.importViewModel.checkFormDataValid()) {
      this.progressModalComponent.openOrClose(true);
      this.importSubscription = this.accessoryLibraryService.requestImportRecommendCarSeries
      (this.accessory_id, this.importViewModel.type, this.importViewModel.file).subscribe(res => {
        successFun(res);
      }, err => {
        failFun(err);
      });
    } else {
      this.globalService.promptBox.open('文件地址不能为空，请选择！', null, 2000, null, false);
    }
  }
}
