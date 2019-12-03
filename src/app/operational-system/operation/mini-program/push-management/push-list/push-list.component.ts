import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerEntity, BannerService } from '../../banner-management/banner.service';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { PushEditComponent } from '../push-edit/push-edit.component';
import { PushEntity, PushManagementService, SearchParams } from '../push-management.service';

const PageSize = 15;

@Component({
  selector: 'app-push-list',
  templateUrl: './push-list.component.html',
  styleUrls: ['./push-list.component.css']
})
export class PushListComponent implements OnInit {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选参数
  public pushList: Array<PushEntity> = []; // banner列表
  public noResultText = '数据加载中...';
  public start_time: any = '';
  public end_time: any = '';
  public pageIndex = 1; // 页码

  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    if (this.pushList.length % PageSize === 0) {
      return this.pushList.length / PageSize;
    }
    return this.pushList.length / PageSize + 1;
  }

  @ViewChild('pushEdit', { static: false }) public pushEdit: PushEditComponent;

  constructor(
      private globalService: GlobalService,
      private pushService: PushManagementService) { }

  public ngOnInit() {
    this.generateBannerList();
  }

  // 初始化获取推送列表
  private generateBannerList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBannerList();
    });
    this.searchText$.next();
  }

  // 请求推送列表
  private requestBannerList(): void {
    this.requestSubscription = this.pushService.requestPushListData(this.searchParams).subscribe(res => {
      this.pushList = res.results;
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
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.pushService.continuePushListData(this.linkUrl)
          .subscribe(res => {
            this.pushList = this.pushList.concat(res.results);
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

  // 修改启停状态
  public onSwitchChange(push_plan_id: string, event: any) {
    const swith = event ? 1 : 2;
    let sucessMsg = '开启成功!';
    let errMsg = '开启失败,请重试!';
    if (!event) {
      sucessMsg = '关闭成功';
      errMsg = '关闭失败，请重试!';
    }
    this.pushService.requestChangeUseStatus(push_plan_id, swith).subscribe(() => {
      this.globalService.promptBox.open(sucessMsg);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.resource === 'end_time' && content.code === 'already_expired') {
              this.globalService.promptBox.open('当前时间已超出下线时间，无法开启!', null, 2000, null, false);
            } else {
              this.globalService.promptBox.open(errMsg, null, 2000, null, false);
            }
            this.searchText$.next();
          }
        }
      }
    });
  }

  // 显示添加编辑Pushmodal
  public onShowModal(data?: PushEntity) {
    this.pushEdit.open(data, () => {
      this.pushEdit.clear();
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, () => {
      this.pushEdit.clear();
    });
  }

  // 删除推送信息
  public onDeleteClick(banner_id: string): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.pushService.requestDeletePushData(banner_id).subscribe(() => {
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
        new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp && eTimeStamp) {
      if (sTimestamp > eTimeStamp) {
        this.globalService.promptBox.open('上线开始时间不能大于结束时间！', null, 2000, null, false);
        return false;
      }
    }
    this.searchParams.section = sTimestamp + ',' + eTimeStamp;
    return true;
  }
}
