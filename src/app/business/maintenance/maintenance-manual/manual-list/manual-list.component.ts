import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { MaintenanceManualHttpService } from '../maintenance-manual-http.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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

  /**
   * 导入
   * 导入成功后需要刷新类表
   */
  public onImportProject() {
    console.log('导入');
    if (true) {
      this.searchText$.next();
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
