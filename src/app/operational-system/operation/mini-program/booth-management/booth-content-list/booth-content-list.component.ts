import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { BoothService, BoothContentEntity, SearchBoothContentParams } from '../booth.service';
import { BoothContentEditComponent } from '../booth-content-edit/booth-content-edit.component';

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
    this.requestSubscription = this.boothService.requestBoothContentListData(this.searchParams)
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

  // 查询
  public onSearchBtnClick(): void {

  }


  // 编辑
  public onEditClick(data?: BoothContentEntity): void {
    this.boothContentEditRef.open(data || null, () => {
      this.searchText$.next();
    });
  }

  // 删除
  public onDeleteClick(booth: BoothContentEntity): void {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {

    });
  }

  // 启停
  public onChangeSwitchStatus(): void {

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

  // 上线开始时间的禁用部分
  public disabledOnlineStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.online_end_time);
  }

  // 上线结束时间的禁用部分
  public disabledOnlineEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.online_start_time);
  }
}
