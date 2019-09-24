import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { VersionAddComponent } from '../version-add/version-add.component';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute } from '@angular/router';
import { SearchVersionParams, VersionEntity, VersionManagementService } from '../version-management.service';
import { debounceTime, switchMap } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-version-list',
  templateUrl: './version-list.component.html',
  styleUrls: ['./version-list.component.css']
})
export class VersionListComponent implements OnInit {
  public versionList: Array<VersionEntity> = [];
  public pageIndex = 1;
  public searchParams: SearchVersionParams = new SearchVersionParams();
  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private application_id: string;
  public application_name: string;

  @ViewChild(VersionAddComponent, { static: true }) public versionComponent: VersionAddComponent;

  private get pageCount(): number {
    if (this.versionList.length % PageSize === 0) {
      return this.versionList.length / PageSize;
    }
    return this.versionList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private versionManagementService: VersionManagementService) {
    this.searchParams.page_size = PageSize * 3;
    activatedRoute.queryParams.subscribe(queryParams => {
      this.application_id = queryParams.application_id;
      this.application_name = queryParams.application_name;
    });
  }

  ngOnInit() {
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.versionManagementService.requestVersionList(this.application_id, this.searchParams))
    ).subscribe(res => {
      this.versionList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 显示添加编辑项目modal
  public onShowModal() {
    this.versionComponent.open(this.application_id, () => {
      this.versionComponent.clear();
      this.pageIndex = 1;
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '保存', () => {
      this.versionComponent.clear();
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.versionManagementService.continueVersionList(this.linkUrl).subscribe(res => {
        this.versionList = this.versionList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 版本下线、上线
  public onVersionDisplayBtnClick(data: any, dispaly: boolean) {
    const param = { is_display: dispaly };
    this.versionManagementService.requestDisplayVersion(data.version_id, param).subscribe((e) => {
      const msg = dispaly ? '下线成功！' : '上线成功！';
      this.globalService.promptBox.open(msg);
      this.searchText$.next();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 删除某一项目
  public onDeleteBtnClick(data: any) {
    this.globalService.confirmationBox.open('警告', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.versionManagementService.requestDeleteVersion(data.version_id).subscribe((e) => {
        this.versionList = this.versionList.filter(version => version.version_id !== data.version_id);
        this.pageIndex = 1;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }
}
