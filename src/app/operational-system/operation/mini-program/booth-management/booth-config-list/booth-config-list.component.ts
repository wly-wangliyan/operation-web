import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TabelHelper } from '../../../../../../utils/table-helper';
import { GlobalService } from '../../../../../core/global.service';
import { BoothService, BoothEntity, SearchBoothParams } from '../booth.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BoothConfigEditComponent } from '../booth-config-edit/booth-config-edit.component';

@Component({
  selector: 'app-booth-config-list',
  templateUrl: './booth-config-list.component.html',
  styleUrls: ['./booth-config-list.component.css']
})
export class BoothConfigListComponent implements OnInit, OnDestroy {
  public boothConfigList: Array<BoothEntity> = []; // 展位设置列表
  public searchParams: SearchBoothParams = new SearchBoothParams();
  public pageIndex = TabelHelper.NgDefaultPageIndex; // 当前页码
  public noResultText = TabelHelper.loadingText;
  private searchText$ = new Subject<any>();
  private requestSubscription: Subscription; // 获取数据
  private linkUrl: string;
  private continueRequestSubscription: Subscription;

  private get pageCount(): number {
    return Math.ceil(this.boothConfigList.length / TabelHelper.NgPageSize);
  }

  @ViewChild('boothConfigEdit', { static: true }) public boothConfigEditRef: BoothConfigEditComponent;

  constructor(
    private globalService: GlobalService,
    private boothService: BoothService
  ) { }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestBoothConfigList();
    });
    this.searchText$.next();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 获取展位设置列表
  private requestBoothConfigList(): void {
    this.requestSubscription = this.boothService.requestBoothListData(this.searchParams)
      .subscribe(backData => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.boothConfigList = backData.results;
        this.linkUrl = backData.linkUrl;
      }, err => {
        this.pageIndex = TabelHelper.NgDefaultPageIndex;
        this.noResultText = TabelHelper.noResultText;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 启停
  public onChangeSwitchStatus(): void {

  }

  // 编辑
  public onEditClick(data?: BoothEntity): void {
    this.boothConfigEditRef.open(data || null, () => {
      this.searchText$.next();
    });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.boothService.continueBoothListData(this.linkUrl)
        .subscribe(res => {
          this.boothConfigList = this.boothConfigList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }
}
