import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { GlobalService } from '../../../../../core/global.service';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { BoothService, BoothContentEntity, SearchBoothContentParams, BoothEntity } from '../booth.service';
import { BoothContentEditComponent } from '../booth-content-edit/booth-content-edit.component';
import { HttpErrorEntity } from '../../../../../core/http.service';

@Component({
  selector: 'app-booth-content-list',
  templateUrl: './booth-content-list.component.html',
  styleUrls: ['./booth-content-list.component.css']
})
export class BoothContentListComponent implements OnInit, OnDestroy {

  public boothContentList: Array<BoothContentEntity> = []; // 展位列表(只展示已开启的)
  public searchParams: SearchBoothContentParams = new SearchBoothContentParams();
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;
  public online_start_time = ''; // 上线开始时间
  public online_end_time = ''; // 上线结束时间
  private booth_id = '';  // 展位id
  private boothData: BoothEntity; // 所属展位
  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    return Math.ceil(this.boothContentList.length / TabelHelper.NgPageSize);
  }

  @ViewChild('boothContentEdit', { static: true }) public boothContentEditRef: BoothContentEditComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private boothService: BoothService
  ) {
    this.route.paramMap.subscribe(map => {
      this.booth_id = map.get('booth_id');
    });
  }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBoothContentList();
    });
    if (this.booth_id) {
      this.requestBoothDetail();
      this.searchText$.next();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 获取展位内容列表
  private requestBoothContentList(): void {
    this.requestSubscription = this.boothService.requestBoothContentListData(this.booth_id, this.searchParams)
      .subscribe(backData => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.boothContentList = backData.results;
        this.linkUrl = backData.linkUrl;
      }, err => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 获取所属展位详情
  private requestBoothDetail(): void {
    this.boothService.requestBoothDetailData(this.booth_id)
      .subscribe(backData => {
        this.boothData = backData;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 查询
  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
    }
  }


  // 编辑
  public onEditClick(data?: BoothContentEntity): void {
    const tipMsg = data ? '编辑' : '新建';
    let boothData = this.boothData ? this.boothData.clone() : null;
    if (!boothData) {
      if (data && data.booth) {
        boothData = data.booth.clone();
      } else {
        this.globalService.promptBox.open(`所属展位信息获取失败，无法${tipMsg}，\n请刷新重试！`, null, 2000, null, false);
        return;
      }
    }
    this.boothContentEditRef.open(data || null, boothData, () => {
      this.searchText$.next();
    });
  }

  // 删除
  public onDeleteClick(boothContent: BoothContentEntity): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.boothService.requestDeleteBoothContentData(this.booth_id, boothContent.booth_content_id)
        .subscribe(res => {
          this.searchText$.next();
          this.globalService.promptBox.open('删除成功');
        }, err => {
          if (!this.globalService.httpErrorProcess(err)) {
            this.globalService.promptBox.open('删除失败，请重试！', null, 2000, null, false);
          }
        });
    });
  }

  // 启停
  public onChangeSwitchStatus(boothContent: BoothContentEntity, booth_content_id: string): void {
    const swith_status = boothContent.status === 1 ? 2 : 1;
    const limit = boothContent.booth && boothContent.booth.booth_type === 1 ? 5 : 1;
    const tipMsg = swith_status === 1 ? '开启' : '关闭';
    this.boothService.requestChangeBoothContentStatus(this.booth_id, booth_content_id, swith_status)
      .subscribe(() => {
        this.globalService.promptBox.open(`${tipMsg}成功`);
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.field === 'status' && content.code === 'missing_field') {
                this.globalService.promptBox.open(`参数缺失，无法${tipMsg}!`, null, 2000, null, false);
              } else if (content.field === 'status' && content.code === 'invalid') {
                this.globalService.promptBox.open(`参数不合法，无法${tipMsg}!`, null, 2000, null, false);
              } else if (content.resource === 'booth_content' && content.code === 'beyond_limit') {
                this.globalService.promptBox.open(`只能同时开启${limit}个内容!`, null, 2000, null, false);
              } else {
                this.globalService.promptBox.open(`${tipMsg}失败！`, null, 2000, null, false);
              }
            }
          }
        }
      });
  }

  // 列表排序(停用的不发送请求，位置没有发生变化的不发送请求)
  public onDrop(event: CdkDragDrop<string[]>, data: any): void {
    if (!data[event.previousIndex].status || data[event.previousIndex].status === 2) {
      return;
    }
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    let move_num = event.previousIndex;
    if (event.previousIndex > event.currentIndex) {
      const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
      move_num = this.boothContentList[index].order_num;
      if (event.currentIndex === 0 && this.boothContentList[index].order_num === 1) {
        move_num = 0;
      }
    } else {
      move_num = this.boothContentList[event.currentIndex].order_num;
    }
    console.log(data[event.previousIndex].order_num, data[event.currentIndex].order_num, move_num);
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.boothService.requestUpdateBoothContentOrder(
      this.booth_id,
      this.boothContentList[event.previousIndex].booth_content_id,
      move_num).subscribe((res) => {
        this.globalService.promptBox.open('排序成功');
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('排序失败，请重试！', null, 2000, null, false);
          this.searchText$.next();
        }
      });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.boothService.continueBoothContentListData(this.linkUrl)
        .subscribe(res => {
          this.boothContentList = this.boothContentList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  /* 生成并检查参数有效性 */
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.online_start_time ? (new Date(this.online_start_time).setHours(new Date(this.online_start_time).getHours(),
      new Date(this.online_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.online_end_time ? (new Date(this.online_end_time).setHours(new Date(this.online_end_time).getHours(),
      new Date(this.online_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('上线开始时间不能大于上线结束时间！', null, 2000, null, false);
      return false;
    }
    if (this.online_start_time || this.online_end_time) {
      this.searchParams.section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.section = null;
    }
    return true;
  }

  // 上线开始时间的禁用部分
  public disabledOnlineStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.online_end_time);
  }

  // 上线结束时间的禁用部分
  public disabledOnlineEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.online_start_time);
  }
}
