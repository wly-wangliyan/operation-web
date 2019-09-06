import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { MaintenanceManualHttpService } from '../maintenance-manual-http.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VehicleImportViewModel } from '../../vehicle-type-management/vehicle-type-list/vehicle-import.model';
import { ProgressModalComponent } from '../../../../share/components/progress-modal/progress-modal.component';

const PageSize = 15;
@Component({
  selector: 'app-manual-list',
  templateUrl: './manual-list.component.html',
  styleUrls: ['./manual-list.component.css']
})
export class ManualListComponent implements OnInit {

  public manualList: Array<any> = []; // 保养手册列表

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string;

  private importSpotSubscription: Subscription; // 导入描述对象
  public importViewModel: VehicleImportViewModel = new VehicleImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  private get pageCount(): number {
    if (this.manualList.length % PageSize === 0) {
      return this.manualList.length / PageSize;
    }
    return this.manualList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private manualService: MaintenanceManualHttpService
  ) { }

  public ngOnInit() {
    this.generateProjectList();
  }

  // 初始化获取手册列表
  private generateProjectList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProjectList();
    });
    this.searchText$.next();
  }

  // 请求手册列表
  private requestProjectList() {
    console.log('请求获取保养手册接口');
    this.noResultText = '暂无数据';
  }

  /** 删除 */
  public onDeleteProgect() {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      console.log('调用删除接口');
    });
  }

  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      console.log('分页请求保养手册数据');
      // this.continueRequestSubscription = this.manualService.continueManualList(this.linkUrl).subscribe(res => {
      //   this.manualList = this.manualList.concat(res.results);
      //   this.linkUrl = res.linkUrl;
      // }, err => {
      //   this.globalService.httpErrorProcess(err);
      // });
    }
  }

  // 解订阅
  public onCloseUnsubscribe() {
    this.importSpotSubscription && this.importSpotSubscription.unsubscribe();
  }

  /**
   * 导入
   * 导入成功后需要刷新类表
   */
  public onImportProject() {
    $('#importManualPromptDiv').modal('show');
    this.importViewModel.initImportData();
    console.log('导入');
    if (true) {
      this.searchText$.next();
    }
  }

  // 取消导入
  public onCancelData() {
    this.onCloseUnsubscribe();
    this.importViewModel.initImportData();
    $('#importManualPromptDiv').modal('hide');
  }

  /* 导入数据 */
  public onSubmitImportBerth() {
    if (this.importViewModel.address) {
      const length = this.importViewModel.address.length;
      const index = this.importViewModel.address.lastIndexOf('.');
      const type = this.importViewModel.address.substring(index, length);
      if (type !== '.xlsx' && type !== '.xls' && type !== '.csv') {
        this.globalService.promptBox.open('文件格式错误！', null, -1, null, false);
        return;
      }
    }
    if (this.importViewModel.checkFormDataValid()) {
      /* this.progressModalComponent.openOrClose(true);
       this.importSpotSubscription = this.setBerthService.requestImportSpot(
           this.importViewModel.type, this.importViewModel.file, this.projectId).subscribe(() => {
         $('#dataImportModal').modal('hide');
         this.globalService.promptBox.open('名单导入成功！', () => {
           this.importViewModel.initImportData();
           $('#importBerthPromptDiv').modal('hide');
           this.progressModalComponent.openOrClose(false);
         }, -1);
       }, err => {
         this.progressModalComponent.openOrClose(false);
         timer(300).subscribe(() => {
           if (!this.globalService.httpErrorProcess(err)) {
             if (err.status === 422) {
               const tempErr = JSON.parse(err.responseText);
               const error = tempErr.length > 0 ? tempErr[0].errors[0] : tempErr.errors[0];
               if (error.resource === 'file' && error.code === 'missing') {
                 this.globalService.promptBox.open('泊位文件不能为空！');
               } else {
                 this.globalService.promptBox.open('泊位文件错误');
               }
             }
           }
         });
       });*/
    }
  }

  public onDownloadMould() {
    console.log('下载模板');
  }

  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

}
