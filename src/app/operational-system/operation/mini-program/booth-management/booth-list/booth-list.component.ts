import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BoothService, BoothEntity, SearchBoothParams } from '../booth.service';

@Component({
  selector: 'app-booth-list',
  templateUrl: './booth-list.component.html',
  styleUrls: ['./booth-list.component.css']
})
export class BoothListComponent implements OnInit, OnDestroy {

  public boothList: Array<BoothEntity> = []; // 展位列表(只展示已开启的)
  public searchParams: SearchBoothParams = new SearchBoothParams(); // 条件筛选
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;
  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    return Math.ceil(this.boothList.length / TabelHelper.NgPageSize);
  }

  constructor(
    private globalService: GlobalService,
    private boothService: BoothService
  ) { }

  public ngOnInit() {
    this.searchParams.status = 1;
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBoothList();
    });
    this.searchText$.next();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 获取已开启的展位列表
  private requestBoothList(): void {
    this.requestSubscription = this.boothService.requestBoothListData(this.searchParams)
      .subscribe(backData => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.boothList = backData.results;
        this.linkUrl = backData.linkUrl;
      }, err => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 查询
  public onSearchBtnClick(): void {
    this.searchText$.next();
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.boothService.continueBoothListData(this.linkUrl)
        .subscribe(res => {
          this.boothList = this.boothList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }
}
