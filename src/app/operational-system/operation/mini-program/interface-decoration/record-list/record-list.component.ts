import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerEntity, BannerService, SearchParams } from '../../banner-management/banner.service';
import { Subject, Subscription, timer } from 'rxjs';
import { BannerEditComponent } from '../../banner-management/banner-edit/banner-edit.component';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选参数

  public bannerList: Array<BannerEntity> = []; // banner列表

  public noResultText = '数据加载中...';

  public start_time: any = '';

  public end_time: any = '';

  private searchText$ = new Subject<any>();

  private requestSubscription: Subscription; // 获取数据

  constructor(
      private globalService: GlobalService,
      private bannerService: BannerService) { }

  public ngOnInit() {
    const arr = [1, 2, 3, 4, 5];
    const index = 1;
    arr[index] = arr.splice(index - 1, 1, arr[index])[0];
    this.generateBannerList();
  }

  // 初始化获取banner列表
  private generateBannerList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBannerList();
    });
    this.searchText$.next();
  }

  // 请求banner列表
  private requestBannerList(): void {
    this.requestSubscription = this.bannerService.requestBannerListData(this.searchParams).subscribe(res => {
      this.bannerList = res.results;
      this.noResultText = '暂无数据';
    }, err => {
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 删除Banner
  public onDeleteClick(banner_id: string): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.bannerService.requestDeleteBannerData(banner_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功');
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('删除失败，请重试！', null, 2000, null, false);
          this.searchText$.next();
        }
      });
    });
  }

  // tab页切换
  public onTabChange(banner_type: number) {
    this.searchParams = new SearchParams();
    this.start_time = null;
    this.end_time = null;
    this.searchParams.banner_type = banner_type;
    this.searchText$.next();
  }
}
