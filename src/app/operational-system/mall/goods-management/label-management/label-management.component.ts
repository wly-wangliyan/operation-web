import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import { ProductService, SearchLabelParams, LabelEntity } from 'src/app/operational-system/ticket/product-management/product.service';
import { LabelEditComponent } from './label-edit/label-edit.component';
import { HttpErrorEntity } from '../../../../core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.css']
})
export class LabelManagementComponent implements OnInit {

  private get pageCount(): number {
    if (this.labelList.length % PageSize === 0) {
      return this.labelList.length / PageSize;
    }
    return this.labelList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private productService: ProductService, ) { }

  public labelList: Array<LabelEntity> = [];
  public searchParams: SearchLabelParams = new SearchLabelParams();
  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';
  public tabs: Array<any> = [];
  public selectedTabIndex = 0;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url

  @ViewChild('labelEdit', { static: true }) public labelEdit: LabelEditComponent;

  ngOnInit() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.searchParams.is_recommended = 0 ? false : true;
      this.productService.requestLabelListData(this.searchParams).subscribe(res => {
        this.labelList = res.results;
        this.noResultText = '暂无数据';
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });

    this.searchText$.next();
  }

  // 新建/编辑标签
  public onEditLabel(tag_id: string, name: string, index: number) {
    this.labelEdit.open(tag_id, name, () => {
      timer(1000).subscribe(() => {
        this.selectedTabIndex = index;
        this.searchText$.next();
      });
    });
  }

  // 删除标签
  public onDelLabel(tag_id: string) {
    // 判断条件
    if (true) {
      this.globalService.promptBox.open('此分类下已关联产品，无法删除！', null, 2000, '/assets/images/warning.png');
    } else {
      this.globalService.confirmationBox.open('提示', '此操作不可恢复，确定要删除吗？', () => {
        this.globalService.confirmationBox.close();
        this.productService.requestDeleteLabelData(tag_id).subscribe(() => {
          this.globalService.promptBox.open('删除成功', () => {
            this.selectedTabIndex = 0;
            this.searchText$.next();
          });
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
      });
    }

  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.productService.continueProductListData(this.linkUrl)
        .subscribe(res => {
          this.labelList = this.labelList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

}
