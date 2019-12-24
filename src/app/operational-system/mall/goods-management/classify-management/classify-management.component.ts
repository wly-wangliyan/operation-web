import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import { SearchSortParams, SortEntity, ClassifyManagementHttpService } from '../classify-management-http.service';
import { ClassifyEditComponent } from './classify-edit/classify-edit.component';
import { HttpErrorEntity } from '../../../../core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-classify-management',
  templateUrl: './classify-management.component.html',
  styleUrls: ['./classify-management.component.css']
})
export class ClassifyManagementComponent implements OnInit {

  private get pageCount(): number {
    if (this.classifyList.length % PageSize === 0) {
      return this.classifyList.length / PageSize;
    }
    return this.classifyList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private classifyHttpService: ClassifyManagementHttpService, ) { }

  public classifyList: Array<SortEntity> = [];
  public searchParams: SearchSortParams = new SearchSortParams();
  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';
  public tabs: Array<any> = [];
  public selectedTabIndex = 0;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url

  @ViewChild('classifyEdit', { static: true }) public classifyEdit: ClassifyEditComponent;

  ngOnInit() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.classifyHttpService.requestClassifyListData(this.searchParams).subscribe(res => {
        this.classifyList = res.results;
        this.noResultText = '暂无数据';
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });

    this.searchText$.next();
  }

  // 新建/编辑标签
  public onEditClassify(sort_id: string, name: string) {
    this.classifyEdit.open(sort_id, name, () => {
      timer(1000).subscribe(() => {
        this.searchText$.next();
      });
    });
  }

  // 删除标签
  public onDelClassify(sort_id: string) {
    this.globalService.confirmationBox.open('提示', '此操作不可恢复，确定要删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.classifyHttpService.requestDeleteClassifyData(sort_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功', () => {
          this.selectedTabIndex = 0;
          this.searchText$.next();
        });
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.code === 'commodity_exist') {
                this.globalService.promptBox.open('此分类下已关联产品，无法删除！', null, 2000, '/assets/images/warning.png');
              } else {
                this.globalService.promptBox.open('此分类删除失败,请重试!', null, 2000, '/assets/images/warning.png');
              }
            }
          }
        }
      });
    });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.classifyHttpService.continueClassifyListData(this.linkUrl)
        .subscribe(res => {
          this.classifyList = this.classifyList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

}
