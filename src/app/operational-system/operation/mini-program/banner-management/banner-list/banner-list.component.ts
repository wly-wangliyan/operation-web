import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../../../core/global.service';
import { BannerService, SearchParams, BannerEntity } from '../banner.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpErrorEntity } from 'src/app/core/http.service';
import { BannerEditComponent } from '../banner-edit/banner-edit.component';

const PageSize = 15;

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css', '../../../../../../assets/less/tab-bar-list.less']
})
export class BannerListComponent implements OnInit, OnDestroy {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选参数

  public bannerList: Array<BannerEntity> = []; // banner列表

  public noResultText = '数据加载中...';

  public start_time: any = '';

  public end_time: any = '';

  public tabList: Array<any> = [];

  private searchText$ = new Subject<any>();

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 页码

  private linkUrl: string;

  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.bannerList.length % PageSize === 0) {
      return this.bannerList.length / PageSize;
    }
    return this.bannerList.length / PageSize + 1;
  }

  @ViewChild('bannerEdit', { static: false }) public bannerEdit: BannerEditComponent;

  constructor(
    private globalService: GlobalService,
    private bannerService: BannerService) { }

  public ngOnInit() {
    this.tabList = [
      { key: 1, value: '首页Banner' },
      { key: 2, value: '检车Banner' },
      { key: 3, value: '机场停车Banner' },
      { key: 5, value: '洗车Banner' },
      { key: 4, value: '弹窗展位' }
    ];
    this.generateBannerList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.searchText$ && this.searchText$.unsubscribe();
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
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.bannerService.continueBannerListData(this.linkUrl)
        .subscribe(res => {
          this.bannerList = this.bannerList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 搜索
  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
    }
  }

  // 上架开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 上架结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 开启开关状态改变
  public onSwitchChange(event: boolean): void {
    timer(2000).subscribe(() => {
      return event;
    });
  }

  // 修改启停状态
  public onSwitchClick(banner_id: string, status: boolean): void {
    const swith = !status;
    let sucessMsg = '开启成功!';
    let errMsg = '开启失败,请重试!';
    if (!swith) {
      sucessMsg = '关闭成功';
      errMsg = '关闭失败，请重试!';
    }
    this.bannerService.requestChangeUseStatus(banner_id, swith).subscribe(() => {
      this.globalService.promptBox.open(sucessMsg);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.resource === 'offline_status' && content.code === 'offline') {
              this.globalService.promptBox.open('当前时间已超出下线时间，无法开启!', null, 2000, null, false);
            } else if (content.resource === 'online_status' && content.code === 'limit') {
              this.globalService.promptBox.open('最大可同时显示5个Banner图，无法开启!', null, 2000, null, false);
            } else if (content.resource === 'banner' && content.code === 'popup exists') {
              this.globalService.promptBox.open('该页面已开启弹窗，请关闭后在试!', null, 2000, null, false);
            } else {
              this.globalService.promptBox.open(errMsg, null, 2000, null, false);
            }
            this.searchText$.next();
          }
        }
      }
    });
  }

  // 列表排序(停用的不发送请求，位置没有发生变化的不发送请求)
  public drop(event: CdkDragDrop<string[]>, data: any): void {
    if (!data[event.previousIndex].is_use) {
      return;
    }
    if (data[event.previousIndex].is_use === false) {
      return;
    }
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    let move_num = event.previousIndex;
    if (event.previousIndex > event.currentIndex) {
      const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
      move_num = this.bannerList[index].sort_num;
      if (event.currentIndex === 0 && this.bannerList[index].sort_num === 1) {
        move_num = 0;
      }
    } else {
      move_num = this.bannerList[event.currentIndex].sort_num;
    }
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.bannerService.requestUpdateSort(this.bannerList[event.previousIndex].banner_id, move_num).subscribe((e) => {
      this.globalService.promptBox.open('排序成功');
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        this.globalService.promptBox.open('排序失败，请重试！', null, 2000, null, false);
        this.searchText$.next();
      }
    });
  }

  // 显示添加编辑Bannermodal
  public onShowModal(data?: BannerEntity): void {
    const banner_id = data ? data.banner_id : null;
    this.bannerEdit.open(banner_id, this.searchParams.banner_type, () => {
      this.bannerEdit.clear();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, () => {
      this.bannerEdit.clear();
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

  // 校验数据
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
      new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : null;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
      new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : null;
    this.searchParams.start_time = sTimestamp;
    this.searchParams.end_time = eTimeStamp;

    if (sTimestamp && eTimeStamp) {
      if (sTimestamp > eTimeStamp) {
        this.globalService.promptBox.open('上线开始时间不能大于结束时间！', null, 2000, null, false);
        return false;
      }
    }
    return true;
  }

  // tab页切换
  public onTabChange(banner_type: number): void {
    this.noResultText = '数据加载中...';
    this.bannerList = [];
    this.searchParams = new SearchParams();
    this.start_time = null;
    this.end_time = null;
    this.searchParams.banner_type = banner_type;
    this.searchText$.next();
  }
}
